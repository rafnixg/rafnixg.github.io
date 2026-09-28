import json
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Article, Project, ResumeDocument, SiteContent

REPO_ROOT = Path(__file__).resolve().parents[2]


def _date(value: str | None) -> datetime:
    if not value:
        return datetime.now(timezone.utc)
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed.replace(tzinfo=timezone.utc) if parsed.tzinfo is None else parsed


def seed_if_empty(db: Session) -> None:
    if db.get(SiteContent, 1) is None:
        content_path = REPO_ROOT / "data" / "site-content.json"
        content = json.loads(content_path.read_text(encoding="utf-8"))
        db.add(SiteContent(id=1, content=content))

    if db.get(ResumeDocument, 1) is None:
        resume_path = REPO_ROOT / "data" / "resume.json"
        resume = json.loads(resume_path.read_text(encoding="utf-8"))
        db.add(ResumeDocument(id=1, document=resume))

    if db.scalar(select(Project.id).limit(1)) is None:
        resume_path = REPO_ROOT / "data" / "resume.json"
        resume = json.loads(resume_path.read_text(encoding="utf-8"))
        featured_urls = {
            "https://github.com/rafnixg/femtobot",
            "https://github.com/rafnixg/bcv-api",
            "https://github.com/rafnixg/sismosve",
            "https://github.com/rafnixg/own_wsgi",
        }
        for index, project in enumerate(resume.get("projects", [])):
            url = project.get("url")
            if not url:
                continue
            db.add(Project(
                name=project.get("name") or "Proyecto",
                description=project.get("description") or "",
                url=url,
                keywords=project.get("keywords") or [],
                entity=project.get("entity") or "Personal Project",
                featured=url in featured_urls,
                visible=True,
                sort_order=index,
            ))
        db.flush()
        for url, name, description, keywords in [
            ("https://github.com/rafnixg/femtobot", "Femtobot - AI Agent Educativo", "Plantilla mínima para agentes conversacionales en Python (inspirado en 'nanobot').", ["Agents", "Python", "LLM", "Tool-calling", "Educational"]),
            ("https://github.com/rafnixg/bcv-api", "BCV Exchange Rate API", "API REST para obtener tasas de cambio del Banco Central de Venezuela en tiempo real.", ["FastAPI", "Python", "REST API", "Exchange Rates"]),
            ("https://github.com/rafnixg/sismosve", "SismosVE - Venezuela Earthquake Monitor", "Aplicación web para visualizar y monitorear sismos en Venezuela.", ["FastAPI", "Python", "Leaflet.js", "Docker"]),
            ("https://github.com/rafnixg/own_wsgi", "Own WSGI Server", "Tutorial educativo sobre cómo crear un servidor WSGI desde cero.", ["Python", "WSGI", "Server Architecture"]),
        ]:
            existing = db.scalar(select(Project).where(Project.url == url))
            if existing:
                existing.featured = True
                existing.name = name
                existing.description = description
                existing.keywords = keywords
            else:
                db.add(Project(name=name, description=description, url=url, keywords=keywords, featured=True, sort_order=-1))

    if db.scalar(select(Article.id).limit(1)) is None:
        articles_path = REPO_ROOT / "data" / "articles.json"
        payload = json.loads(articles_path.read_text(encoding="utf-8"))
        for index, item in enumerate(payload.get("posts", [])):
            url = item.get("url")
            if not url:
                continue
            db.add(Article(
                id=item.get("id") or url,
                title=item.get("title") or "",
                brief=item.get("brief") or "",
                url=url,
                date_added=_date(item.get("dateAdded")),
                visible=True,
                sort_order=index,
            ))
    db.commit()
