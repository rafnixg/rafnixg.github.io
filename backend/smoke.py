"""Small end-to-end check for the local Compose stack."""

import json
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
