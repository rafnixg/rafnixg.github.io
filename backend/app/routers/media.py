"""Small, local-volume media library for one administrator."""

from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse
from PIL import Image, ImageOps, UnidentifiedImageError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Media
from app.security import check_csrf, require_admin

router = APIRouter(tags=["media"])
MEDIA_DIR = Path(settings.media_dir)
IMAGE_LIMIT = 5 * 1024 * 1024
PDF_LIMIT = 10 * 1024 * 1024


@router.get("/api/admin/media")
def list_media(request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    return db.scalars(select(Media).order_by(Media.id.desc())).all()


@router.post("/api/admin/media", status_code=201)
async def upload_media(request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)):
    require_admin(request)
    check_csrf(request, request.headers.get("X-CSRF-Token"))
    content = await file.read(PDF_LIMIT + 1)
    if len(content) > PDF_LIMIT:
        raise HTTPException(413, "File exceeds 10 MB")
    original = Path(file.filename or "upload").name[:250]
    if content.startswith(b"%PDF-"):
        if len(content) < 8 or b"%%EOF" not in content[-1024:]:
            raise HTTPException(422, "Invalid PDF")
        extension, mime = ".pdf", "application/pdf"
    else:
        if len(content) > IMAGE_LIMIT:
            raise HTTPException(413, "Image exceeds 5 MB")
        try:
            with Image.open(BytesIO(content)) as image:
                image.verify()
            with Image.open(BytesIO(content)) as image:
                if image.width * image.height > 36_000_000:
                    raise HTTPException(422, "Image dimensions are too large")
                converted = ImageOps.exif_transpose(image).convert("RGB")
                output = BytesIO()
                converted.save(output, format="WEBP", quality=85)
                content = output.getvalue()
        except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as exc:
            raise HTTPException(422, "Only valid raster images or PDFs are accepted") from exc
        extension, mime = ".webp", "image/webp"
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}{extension}"
    target = MEDIA_DIR / filename
    target.write_bytes(content)
    item = Media(filename=filename, original_name=original, mime_type=mime, size=len(content))
    db.add(item)
    try:
        db.commit()
    except Exception:
        target.unlink(missing_ok=True)
        raise
    db.refresh(item)
    return {"id": item.id, "url": f"/media/{filename}", "mime_type": mime, "original_name": original}


@router.delete("/api/admin/media/{media_id}", status_code=204)
def delete_media(media_id: int, request: Request, db: Session = Depends(get_db)):
    require_admin(request)
    check_csrf(request, request.headers.get("X-CSRF-Token"))
    item = db.get(Media, media_id)
    if item is None:
        raise HTTPException(404, "Media not found")
    target = MEDIA_DIR / item.filename
    db.delete(item)
    db.commit()
    target.unlink(missing_ok=True)


@router.get("/media/{filename}")
def serve_media(filename: str, db: Session = Depends(get_db)):
    item = db.scalar(select(Media).where(Media.filename == filename))
    if item is None:
        raise HTTPException(404, "Media not found")
    target = MEDIA_DIR / item.filename
    if not target.is_file():
        raise HTTPException(404, "Media file missing")
    response = FileResponse(target, media_type=item.mime_type)
    if item.mime_type == "application/pdf":
        response.headers["Content-Disposition"] = f'attachment; filename="{item.filename}"'
    return response
