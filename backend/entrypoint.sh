#!/bin/sh
set -eu
cd /app/backend
alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
