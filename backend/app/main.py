from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy import text

from app.config import settings
from app.database import SessionLocal
from app.routers import admin, public
from app.seed import seed_if_empty

@asynccontextmanager
async def lifespan(app: FastAPI):
    with SessionLocal() as db:
        seed_if_empty(db)
    yield


app = FastAPI(title="Rafnixg.dev CMS", version="1.0.0", lifespan=lifespan, docs_url=None, redoc_url=None)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["api.rafnixg.dev", "localhost", "127.0.0.1"],
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "X-CSRF-Token"],
    allow_credentials=False,
)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.session_secret,
    session_cookie="cms_session",
    max_age=60 * 60 * 8,
    same_site="strict",
    https_only=settings.cookie_secure,
)


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if request.url.path == "/admin" or request.url.path.startswith("/api/admin/"):
        response.headers["Cache-Control"] = "no-store"
        response.headers["Pragma"] = "no-cache"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; object-src 'none'; script-src 'self' 'unsafe-inline' https://umami.rafnixg.dev; "
        "style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; "
        "connect-src 'self' https://api.rafnixg.dev https://umami.rafnixg.dev; "
        "form-action 'self'; frame-ancestors 'none'; base-uri 'self'"
    )
    return response
app.include_router(public.router)
app.include_router(admin.router)


@app.get("/health")
def health():
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception:
        return JSONResponse({"status": "unavailable"}, status_code=503)


@app.get("/admin.js")
def admin_script():
    return FileResponse(Path(__file__).parent / "admin.js", media_type="application/javascript")
