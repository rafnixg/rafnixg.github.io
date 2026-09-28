import json
import secrets
import time
from pathlib import Path

from fastapi import APIRouter, Depends, Form, Header, HTTPException, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from urllib.parse import urlparse

from app.config import settings
from app.database import get_db
from app.models import Article, Page, PageRedirect, Project, ResumeDocument, SiteContent
from app.schemas import ArticleCuration, PageInput, ProjectInput, ProjectOutput
from app.security import ADMIN_PASSWORD_HASH, check_csrf, csrf_token, password_hash, require_admin
from app.services.articles import sync_articles
from app.services.pages import clean_html

router = APIRouter(tags=["admin"])
templates = Jinja2Templates(directory=str(Path(__file__).resolve().parents[1] / "templates"))
_login_attempts: dict[str, list[float]] = {}
_LOGIN_WINDOW = 10 * 60
_LOGIN_LIMIT = 5


@router.get("/admin", response_class=HTMLResponse)
def admin_page(request: Request):
    if not request.session.get("admin"):
        return templates.TemplateResponse(request, "login.html", {"csrf": csrf_token(request)})
    return templates.TemplateResponse(request, "cms.html", {"csrf": csrf_token(request)})


@router.post("/admin/login")
def login(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
    csrf: str = Form(...),
):
    check_csrf(request, csrf)
    now = time.monotonic()
    remote = request.client.host if request.client else "unknown"
    attempts = [stamp for stamp in _login_attempts.get(remote, []) if now - stamp < _LOGIN_WINDOW]
    _login_attempts[remote] = attempts
    if len(attempts) >= _LOGIN_LIMIT:
        raise HTTPException(status_code=429, detail="Demasiados intentos. Intenta más tarde.")
    valid = password_hash.verify(password, ADMIN_PASSWORD_HASH)
    if username != settings.admin_username or not valid:
        attempts.append(now)
        _login_attempts[remote] = attempts
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")
    _login_attempts.pop(remote, None)
    request.session.clear()
    request.session["admin"] = True
    request.session["csrf_token"] = secrets.token_urlsafe(32)
    return RedirectResponse("/admin", status_code=status.HTTP_303_SEE_OTHER)


@router.post("/admin/logout")
def logout(request: Request, csrf: str = Form(...)):
    check_csrf(request, csrf)
    request.session.clear()
    return RedirectResponse("/admin", status_code=status.HTTP_303_SEE_OTHER)


@router.get("/api/admin/site-content")
def get_admin_content(request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    item = db.get(SiteContent, 1)
    return item.content if item else {}


@router.put("/api/admin/site-content")
async def update_admin_content(request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    check_csrf(request, request.headers.get("X-CSRF-Token"))
    try:
        content = await request.json()
    except ValueError as exc:
        raise HTTPException(400, "Invalid JSON") from exc
    if not isinstance(content, dict) or len(json.dumps(content)) > 100_000:
        raise HTTPException(422, "Content must be a JSON object under 100 KB")
    for key in ("cv_url", "articles_url"):
        if key in content:
            parsed = urlparse(str(content[key]))
            if parsed.scheme != "https" or not parsed.netloc:
                raise HTTPException(422, f"{key} must be an HTTPS URL")
    for key in ("home_og_image", "projects_og_image"):
        if content.get(key) and not (str(content[key]).startswith("/media/") or str(content[key]).startswith("https://")):
            raise HTTPException(422, f"{key} must use HTTPS or /media/")
    social_links = content.get("social_links", [])
    if not isinstance(social_links, list) or len(social_links) > 20:
        raise HTTPException(422, "social_links must be a list of at most 20 items")
    for link in social_links:
        parsed = urlparse(str(link.get("url", ""))) if isinstance(link, dict) else None
        if not parsed or parsed.scheme != "https" or not parsed.hostname:
            raise HTTPException(422, "Social links must use HTTPS")
    item = db.get(SiteContent, 1)
    if item is None:
        item = SiteContent(id=1, content=content)
        db.add(item)
    else:
        item.content = content
    db.commit()
    return {"ok": True}


@router.get("/api/admin/resume")
def get_admin_resume(request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    item = db.get(ResumeDocument, 1)
    return item.document if item else {}


@router.put("/api/admin/resume")
async def update_admin_resume(request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    check_csrf(request, request.headers.get("X-CSRF-Token"))
    try:
        document = await request.json()
    except ValueError as exc:
        raise HTTPException(400, "Invalid JSON") from exc
    if not isinstance(document, dict) or len(json.dumps(document, ensure_ascii=False).encode("utf-8")) > 1_000_000:
        raise HTTPException(422, "Resume must be a JSON object under 1 MB")
    basics = document.get("basics")
    if not isinstance(basics, dict) or not isinstance(basics.get("name"), str) or not basics["name"].strip():
        raise HTTPException(422, "Resume basics.name is required")
    for section in ("work", "volunteer", "education", "awards", "certificates", "publications", "skills", "languages", "interests", "references", "projects"):
        if section in document and not isinstance(document[section], list):
            raise HTTPException(422, f"Resume {section} must be a list")
    item = db.get(ResumeDocument, 1)
    if item is None:
        db.add(ResumeDocument(id=1, document=document))
    else:
        item.document = document
    db.commit()
    return {"ok": True}


@router.get("/api/admin/projects", response_model=list[ProjectOutput])
def admin_projects(request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    return db.scalars(select(Project).order_by(Project.sort_order, Project.id)).all()


@router.post("/api/admin/projects", response_model=ProjectOutput, status_code=201)
def create_project(payload: ProjectInput, request: Request, db: Session = Depends(get_db), csrf: str | None = Header(None, alias="X-CSRF-Token")):
    require_admin(request)
    check_csrf(request, csrf)
    project = Project(**payload.model_dump(mode="json"))
    db.add(project)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "A project with this URL already exists") from exc
    db.refresh(project)
    return project


@router.put("/api/admin/projects/{project_id}", response_model=ProjectOutput)
def update_project(project_id: int, payload: ProjectInput, request: Request, db: Session = Depends(get_db), csrf: str | None = Header(None, alias="X-CSRF-Token")):
    require_admin(request)
    check_csrf(request, csrf)
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(404, "Project not found")
    for key, value in payload.model_dump(mode="json").items():
        setattr(project, key, value)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "A project with this URL already exists") from exc
    db.refresh(project)
    return project


@router.delete("/api/admin/projects/{project_id}", status_code=204)
def delete_project(project_id: int, request: Request, db: Session = Depends(get_db), csrf: str | None = Header(None, alias="X-CSRF-Token")):
    require_admin(request)
    check_csrf(request, csrf)
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(404, "Project not found")
    db.delete(project)
    db.commit()


@router.get("/api/admin/articles")
def admin_articles(request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    return db.scalars(select(Article).order_by(Article.sort_order, Article.date_added.desc())).all()


@router.put("/api/admin/articles/{article_id:path}")
async def curate_article(article_id: str, payload: ArticleCuration, request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    check_csrf(request, request.headers.get("X-CSRF-Token"))
    article = db.get(Article, article_id)
    if article is None:
        raise HTTPException(404, "Article not found")
    article.visible = payload.visible
    article.sort_order = payload.sort_order
    db.commit()
    return {"ok": True}


@router.post("/api/admin/sync/articles")
def sync_articles_endpoint(
    x_article_sync_token: str | None = Header(None),
    db: Session = Depends(get_db),
):
    if not x_article_sync_token or not secrets.compare_digest(x_article_sync_token, settings.article_sync_token):
        raise HTTPException(status_code=401, detail="Invalid sync token")
    return {"synced": sync_articles(db)}


@router.get("/api/admin/pages")
def admin_pages(request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    return db.scalars(select(Page).order_by(Page.title)).all()


@router.post("/api/admin/pages", status_code=201)
def create_page(payload: PageInput, request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    check_csrf(request, request.headers.get("X-CSRF-Token"))
    values = payload.model_dump()
    values["body_html"] = clean_html(values["body_html"])
    page = Page(**values)
    db.add(page)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Slug already in use") from exc
    db.refresh(page)
    return page


@router.put("/api/admin/pages/{page_id}")
def update_page(page_id: int, payload: PageInput, request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    check_csrf(request, request.headers.get("X-CSRF-Token"))
    page = db.get(Page, page_id)
    if page is None:
        raise HTTPException(404, "Page not found")
    values = payload.model_dump()
    values["body_html"] = clean_html(values["body_html"])
    if values["slug"] != page.slug:
        db.merge(PageRedirect(old_slug=page.slug, page_id=page.id))
        old_redirect = db.get(PageRedirect, values["slug"])
        if old_redirect:
            db.delete(old_redirect)
    for key, value in values.items():
        setattr(page, key, value)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Slug already in use") from exc
    db.refresh(page)
    return page


@router.delete("/api/admin/pages/{page_id}", status_code=204)
def delete_page(page_id: int, request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    check_csrf(request, request.headers.get("X-CSRF-Token"))
    page = db.get(Page, page_id)
    if page is None:
        raise HTTPException(404, "Page not found")
    for redirect in db.scalars(select(PageRedirect).where(PageRedirect.page_id == page_id)):
        db.delete(redirect)
    db.delete(page)
    db.commit()
