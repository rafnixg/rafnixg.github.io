"""Small end-to-end check for the local Compose stack."""

import json
import os
import re
from io import BytesIO
from uuid import uuid4

import httpx
from PIL import Image
from urllib.error import HTTPError
from urllib.request import Request, urlopen

BASE = "http://cms:8000"


def get(path: str, origin: str | None = None):
    headers = {"Host": "api.rafnixg.dev"}
    if origin:
        headers["Origin"] = origin
    request = Request(BASE + path, headers=headers)
    try:
        with urlopen(request, timeout=10) as response:
            return response.status, response.headers, response.read()
    except HTTPError as error:
        return error.code, error.headers, error.read()


status, _, body = get("/health")
assert status == 200 and json.loads(body)["status"] == "ok", "Database health check failed"

status, _, body = get("/api/site-content")
assert status == 200 and json.loads(body).get("hero_title_prefix"), "Site content unavailable"

status, _, body = get("/api/resume")
assert status == 200 and json.loads(body).get("basics", {}).get("name"), "JSON Resume unavailable"

status, headers, body = get("/api/projects", "http://localhost:8000")
projects = json.loads(body)
assert status == 200 and isinstance(projects, list) and projects, "Projects unavailable"
assert headers.get("Access-Control-Allow-Origin") == "http://localhost:8000", "Local CORS origin rejected"

status, _, body = get("/api/articles")
articles = json.loads(body)
assert status == 200 and isinstance(articles, list) and articles, "Articles unavailable"

status, headers, _ = get("/api/projects", "https://example.invalid")
assert status == 200 and not headers.get("Access-Control-Allow-Origin"), "Unknown CORS origin accepted"

status, _, _ = get("/api/admin/projects")
assert status == 401, "Admin API accepted an anonymous request"

status, _, _ = get("/api/admin/resume")
assert status == 401, "Admin resume accepted an anonymous request"

print(f"Local CMS smoke passed: resume, {len(projects)} projects, {len(articles)} articles, health/auth/CORS OK")

with httpx.Client(base_url=BASE, headers={"Host": "api.rafnixg.dev"}, follow_redirects=True, timeout=15) as client:
    site_html = client.get("/", headers={"Host": "rafnixg.dev"}).text
    cv_html = client.get("/", headers={"Host": "resume.rafnixg.dev"}).text
    assert '<link rel="canonical" href="https://rafnixg.dev/">' in site_html and "Mis Proyectos" in site_html, "Server-rendered site SEO failed"
    assert '<link rel="canonical" href="https://resume.rafnixg.dev/">' in cv_html and "Rafnix Gabriel" in cv_html, "Server-rendered CV SEO failed"
    assert 'class="resume-index"' in cv_html and 'Ver todos los proyectos' in cv_html and 'QR &amp; Barcode Reader' in cv_html, "Document-style CV or expandable projects missing"
    login_page = client.get("/admin")
    login_csrf = re.search(r'name="csrf" value="([^"]+)"', login_page.text).group(1)
    logged_in = client.post("/admin/login", data={"username": "admin", "password": os.environ["ADMIN_PASSWORD"], "csrf": login_csrf})
    assert logged_in.status_code == 200 and 'data-target="cv"' in logged_in.text, "CMS login or navigation failed"
    csrf = re.search(r'name="csrf-token" content="([^"]+)"', logged_in.text).group(1)
    headers = {"X-CSRF-Token": csrf}

    current_resume = client.get("/api/admin/resume").json()
    assert current_resume.get("basics", {}).get("name"), "CV form data missing"
    assert client.put("/api/admin/resume", json=current_resume).status_code == 403, "CSRF check failed"
    assert client.put("/api/admin/resume", json=current_resume, headers=headers).status_code == 200, "CV save failed"

    slug = "cms-smoke-" + uuid4().hex[:8]
    payload = {"slug": slug, "title": "Página de prueba", "body_html": "<p>Prueba</p><script>alert(1)</script>", "meta_title": "Prueba SEO", "meta_description": "Descripción de prueba", "og_image": "", "visible": True}
    created = client.post("/api/admin/pages", json=payload, headers=headers)
    assert created.status_code == 201, f"Page creation failed: {created.text}"
    page_id = created.json()["id"]
    try:
        page = client.get("/" + slug)
        assert page.status_code == 200 and "Prueba SEO" in page.text and "<script>alert(1)</script>" not in page.text, "Page SEO or sanitation failed"
        payload["slug"] += "-new"
        changed = client.put(f"/api/admin/pages/{page_id}", json=payload, headers=headers)
        assert changed.status_code == 200, f"Page update failed: {changed.text}"
        redirect = client.get("/" + slug, follow_redirects=False)
        assert redirect.status_code == 301 and redirect.headers["location"] == "/" + payload["slug"], "Slug redirect failed"
    finally:
        assert client.delete(f"/api/admin/pages/{page_id}", headers=headers).status_code == 204, "Page cleanup failed"

    assert client.get("/api/admin/media").status_code == 200, "Media library unavailable"
    image_bytes = BytesIO()
    Image.new("RGB", (2, 2), "blue").save(image_bytes, format="PNG")
    uploaded = client.post("/api/admin/media", files={"file": ("smoke.png", image_bytes.getvalue(), "image/png")}, headers=headers)
    assert uploaded.status_code == 201, f"Media upload failed: {uploaded.text}"
    media_id = uploaded.json()["id"]
    try:
        served = client.get(uploaded.json()["url"])
        assert served.status_code == 200 and served.headers["content-type"].startswith("image/webp"), "Media serving failed"
    finally:
        assert client.delete(f"/api/admin/media/{media_id}", headers=headers).status_code == 204, "Media cleanup failed"
print("Local admin smoke passed: login, forms, CSRF, pages/SEO/sanitization/redirect and media upload OK")
