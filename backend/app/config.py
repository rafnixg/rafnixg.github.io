from dataclasses import dataclass
import os
from urllib.parse import quote


def _required(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def _database_url() -> str:
    """Build a safe database URL when Compose provides separate credentials."""
    explicit = os.getenv("DATABASE_URL", "").strip()
    if explicit:
        return explicit
    password = os.getenv("DATABASE_PASSWORD")
    if password is None:
        return "postgresql+psycopg://cms:cms@localhost:5432/cms"
    scheme = os.getenv("DATABASE_SCHEME", "postgresql+psycopg")
    user = quote(os.getenv("DATABASE_USER", "cms"), safe="")
    encoded_password = quote(password, safe="")
    host = os.getenv("DATABASE_HOST", "localhost")
    port = os.getenv("DATABASE_PORT", "5432")
    name = os.getenv("DATABASE_NAME", "cms")
    return f"{scheme}://{user}:{encoded_password}@{host}:{port}/{name}"


@dataclass(frozen=True)
class Settings:
    database_url: str
    admin_username: str
    admin_password: str
    session_secret: str
    article_sync_token: str
    cookie_secure: bool
    cors_origins: tuple[str, ...]
    media_dir: str


def get_settings() -> Settings:
    session_secret = _required("SESSION_SECRET")
    admin_password = _required("ADMIN_PASSWORD")
    sync_token = _required("ARTICLE_SYNC_TOKEN")
    if len(session_secret) < 32:
        raise RuntimeError("SESSION_SECRET must contain at least 32 characters")
    if len(admin_password) < 12:
        raise RuntimeError("ADMIN_PASSWORD must contain at least 12 characters")
    if len(sync_token) < 32:
        raise RuntimeError("ARTICLE_SYNC_TOKEN must contain at least 32 characters")

    origins = os.getenv(
        "CORS_ORIGINS",
        "https://rafnixg.dev,https://www.rafnixg.dev,https://rafnixg.github.io,https://resume.rafnixg.dev",
    )
    return Settings(
        database_url=_database_url(),
        admin_username=os.getenv("ADMIN_USERNAME", "admin"),
        admin_password=admin_password,
        session_secret=session_secret,
        article_sync_token=sync_token,
        cookie_secure=os.getenv("COOKIE_SECURE", "true").lower() == "true",
        cors_origins=tuple(origin.strip() for origin in origins.split(",") if origin.strip()),
        media_dir=os.getenv("MEDIA_DIR", "/app/uploads"),
    )


settings = get_settings()
