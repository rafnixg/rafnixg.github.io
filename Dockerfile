FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt \
    && groupadd --system app && useradd --system --gid app --home-dir /app app

COPY backend /app/backend
COPY data /app/data
COPY assets /app/assets
COPY components /app/components
COPY tokens.css /app/tokens.css
RUN mkdir -p /app/uploads && chown -R app:app /app

WORKDIR /app/backend
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=3)" || exit 1
ENTRYPOINT ["/bin/sh", "/app/backend/entrypoint.sh"]
