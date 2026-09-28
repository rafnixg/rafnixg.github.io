"""Server-rendered public pages with stable, crawlable metadata."""

from pathlib import Path
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse, PlainTextResponse, RedirectResponse, Response
from fastapi.templating import Jinja2Templates
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Article, Page, PageRedirect, Project, ResumeDocument, SiteContent

router = APIRouter(tags=["website"])
templates = Jinja2Templates(directory=str(Path(__file__).resolve().parents[1] / "templates"))
SITE_URL = "https://rafnixg.dev"
CV_URL = "https://resume.rafnixg.dev"


def https_url(value: object) -> str:
    if not isinstance(value, str):
        return ""
    parsed = urlparse(value)
    return value if parsed.scheme == "https" and parsed.hostname else ""


templates.env.filters["https_url"] = https_url


def _cv_host(request: Request) -> bool:
    return request.headers.get("host", "").split(":", 1)[0].lower() == "resume.rafnixg.dev"


def _content(db: Session) -> dict:
    row = db.get(SiteContent, 1)
    return row.content if row else {}


def _pages(db: Session) -> list[Page]:
    return list(db.scalars(select(Page).where(Page.visible.is_(True)).order_by(Page.title)).all())


def _seo(request: Request, title: str, description: str, canonical: str, image: str = "") -> dict:
    if image.startswith("/media/"):
        image = SITE_URL + image
    elif not https_url(image):
        image = ""
    return {
        "title": title,
        "description": description,
        "canonical": canonical,
        "image": image or f"{SITE_URL}/assets/images/banner_web.png",
        "request": request,
    }


@router.get("/", response_class=HTMLResponse)
def home(request: Request, db: Session = Depends(get_db)):
    if _cv_host(request):
        return _resume_page(request, db)
    content = _content(db)
    projects = db.scalars(select(Project).where(Project.visible.is_(True), Project.featured.is_(True)).order_by(Project.sort_order, Project.id)).all()
    articles = db.scalars(select(Article).where(Article.visible.is_(True)).order_by(Article.sort_order, Article.date_added.desc()).limit(3)).all()
    seo = _seo(request, content.get("meta_title", "Rafnixg.dev"), content.get("meta_description", ""), SITE_URL + "/", content.get("home_og_image", ""))
    return templates.TemplateResponse(request, "public_home.html", {**seo, "content": content, "projects": projects, "articles": articles, "visible_pages": _pages(db)})


@router.get("/projects.html", response_class=HTMLResponse)
def projects_page(request: Request, db: Session = Depends(get_db)):
    if _cv_host(request):
        raise HTTPException(404)
    content = _content(db)
    projects = db.scalars(select(Project).where(Project.visible.is_(True)).order_by(Project.sort_order, Project.id)).all()
    seo = _seo(request, content.get("projects_meta_title", "Proyectos"), content.get("projects_meta_description", ""), SITE_URL + "/projects.html", content.get("projects_og_image", ""))
    return templates.TemplateResponse(request, "public_projects.html", {**seo, "content": content, "projects": projects, "visible_pages": _pages(db)})


def _resume_page(request: Request, db: Session):
    row = db.get(ResumeDocument, 1)
    resume = row.document if row else {}
    basics = resume.get("basics", {})
    seo = _seo(request, f"{basics.get('name', 'CV')} — {basics.get('label', 'Currículum')}", basics.get("summary", "")[:300], CV_URL + "/", basics.get("image", ""))
    return templates.TemplateResponse(request, "public_resume.html", {**seo, "resume": resume, "basics": basics})


@router.get("/cv", response_class=HTMLResponse)
def local_resume_preview(request: Request, db: Session = Depends(get_db)):
    return _resume_page(request, db)


@router.get("/robots.txt", response_class=PlainTextResponse)
def robots(request: Request):
    domain = CV_URL if _cv_host(request) else SITE_URL
    return f"User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin/\nSitemap: {domain}/sitemap.xml\n"


@router.get("/sitemap.xml")
def sitemap(request: Request, db: Session = Depends(get_db)):
    if _cv_host(request):
        urls = [CV_URL + "/"]
    else:
        pages = db.scalars(select(Page).where(Page.visible.is_(True)).order_by(Page.slug)).all()
        urls = [SITE_URL + "/", SITE_URL + "/projects.html"] + [f"{SITE_URL}/{page.slug}" for page in pages]
    body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    body += "".join(f"  <url><loc>{url}</loc></url>\n" for url in urls)
    body += "</urlset>\n"
    return Response(body, media_type="application/xml")


@router.get("/{slug}", response_class=HTMLResponse)
def custom_page(slug: str, request: Request, db: Session = Depends(get_db)):
    if _cv_host(request):
        raise HTTPException(404)
    page = db.scalar(select(Page).where(Page.slug == slug, Page.visible.is_(True)))
    if page is None:
        redirect = db.get(PageRedirect, slug)
        target = db.get(Page, redirect.page_id) if redirect else None
        if target and target.visible:
            return RedirectResponse(f"/{target.slug}", status_code=301)
        raise HTTPException(404)
    seo = _seo(request, page.meta_title or page.title, page.meta_description, f"{SITE_URL}/{page.slug}", page.og_image)
    return templates.TemplateResponse(request, "public_page.html", {**seo, "page": page, "content": _content(db), "visible_pages": _pages(db)})
