import secrets

from fastapi import HTTPException, Request, status
from pwdlib import PasswordHash

from app.config import settings

password_hash = PasswordHash.recommended()
ADMIN_PASSWORD_HASH = password_hash.hash(settings.admin_password)


def csrf_token(request: Request) -> str:
    token = request.session.get("csrf_token")
    if not token:
        token = secrets.token_urlsafe(32)
        request.session["csrf_token"] = token
    return token


def require_admin(request: Request) -> None:
    if not request.session.get("admin"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")


def check_csrf(request: Request, token: str | None) -> None:
    expected = request.session.get("csrf_token", "")
    if not token or not secrets.compare_digest(expected, token):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid CSRF token")
