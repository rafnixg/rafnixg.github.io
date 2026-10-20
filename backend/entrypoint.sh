#!/bin/sh
set -eu
cd /app/backend
chown app:app /app/uploads
setpriv --reuid=app --regid=app --init-groups alembic upgrade head
exec setpriv --reuid=app --regid=app --init-groups uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
