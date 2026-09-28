from datetime import datetime
import re

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator


class ProjectInput(BaseModel):
    name: str = Field(min_length=1, max_length=180)
    description: str = Field(default="", max_length=5000)
    url: HttpUrl = Field(max_length=1000)
    keywords: list[str] = Field(default_factory=list, max_length=20)
    entity: str = Field(default="Personal Project", max_length=80)
    featured: bool = False
    visible: bool = True
    sort_order: int = Field(default=0, ge=0, le=100000)

    @field_validator("url")
    @classmethod
    def require_https(cls, value: HttpUrl) -> HttpUrl:
        if value.scheme != "https":
            raise ValueError("Project URL must use HTTPS")
        return value

    @field_validator("keywords")
    @classmethod
    def bound_keywords(cls, value: list[str]) -> list[str]:
        if any(len(keyword) > 80 for keyword in value):
            raise ValueError("Each keyword must be at most 80 characters")
        return value


class ProjectOutput(ProjectInput):
    model_config = ConfigDict(from_attributes=True)
    id: int


class ArticleOutput(BaseModel):
    id: str
    title: str
    brief: str
    url: str
    dateAdded: datetime
    visible: bool
    sort_order: int


class ArticleCuration(BaseModel):
    visible: bool
    sort_order: int = Field(ge=0, le=100000)


class PageInput(BaseModel):
    slug: str = Field(min_length=1, max_length=160)
    title: str = Field(min_length=1, max_length=200)
    body_html: str = Field(default="", max_length=100_000)
    meta_title: str = Field(default="", max_length=200)
    meta_description: str = Field(default="", max_length=500)
    og_image: str = Field(default="", max_length=1000)
    visible: bool = True

    @field_validator("slug")
    @classmethod
    def valid_slug(cls, value: str) -> str:
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", value):
            raise ValueError("Use lowercase letters, numbers and hyphens")
        if value in {"admin", "api", "assets", "components", "media", "health", "cv", "projects", "robots", "sitemap"}:
            raise ValueError("Reserved slug")
        return value

    @field_validator("og_image")
    @classmethod
    def valid_image(cls, value: str) -> str:
        if value and not (value.startswith("/media/") or value.startswith("https://")):
            raise ValueError("Image must use HTTPS or /media/")
        return value
