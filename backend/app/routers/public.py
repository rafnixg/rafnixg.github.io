from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Article, Project, ResumeDocument, SiteContent
from app.schemas import ArticleOutput, ProjectOutput

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/site-content")
def site_content(db: Session = Depends(get_db)):
    item = db.get(SiteContent, 1)
    return item.content if item else {}


@router.get("/resume")
def resume(db: Session = Depends(get_db)):
    item = db.get(ResumeDocument, 1)
    return item.document if item else {}


@router.get("/projects", response_model=list[ProjectOutput])
def projects(featured: bool = False, db: Session = Depends(get_db)):
    query = select(Project).where(Project.visible.is_(True))
    if featured:
        query = query.where(Project.featured.is_(True))
    return db.scalars(query.order_by(Project.sort_order, Project.id)).all()


@router.get("/articles", response_model=list[ArticleOutput])
def articles(db: Session = Depends(get_db)):
    query = select(Article).where(Article.visible.is_(True)).order_by(Article.sort_order, Article.date_added.desc())
    return [
        {
            "id": article.id,
            "title": article.title,
            "brief": article.brief,
            "url": article.url,
            "dateAdded": article.date_added,
            "visible": article.visible,
            "sort_order": article.sort_order,
        }
        for article in db.scalars(query).all()
    ]
