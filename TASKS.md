# Estado del proyecto

Última actualización: 2026-10-18

Este archivo es el seguimiento operativo del proceso de migración a CMS. Cada cambio
de alcance debe actualizar las listas de completadas y pendientes.

## Completadas

- [x] Backend FastAPI modular con PostgreSQL y Dockerfile.
- [x] Docker Compose local con PostgreSQL, FastAPI, Nginx y smoke test.
- [x] CORS explícito, Trusted Hosts, CSP, CSRF y cookies de sesión configurables.
- [x] Panel CMS con formularios para Inicio, proyectos, artículos, páginas, CV,
      medios y SEO.
- [x] Endpoint público para JSON Resume y edición del CV desde el admin.
- [x] Plantillas públicas server-rendered con SEO y componentes Jinja reutilizables.
- [x] Rediseño documental del CV y de la portada pública.
- [x] Sección de proyectos con búsqueda, filtros y contador dinámico.
- [x] Eventos Umami anónimos para navegación, proyectos, artículos, CV y contacto.
- [x] Smoke test de API, autenticación, CORS, sanitización, media, SEO y analytics.
- [x] `AGENTS.md` con convenciones y checklist de contribución.
- [x] CI estático para build frontend, compilación Python y whitespace checks.
- [x] CI de integración con Docker Compose y smoke test en GitHub Actions.
- [x] Workflow mensual de artículos con permisos mínimos, timeout y reintentos.
- [x] Dependabot configurado para Python, npm y GitHub Actions.
- [x] PR #1 creada desde la rama `quality-improvements`.

## Pendientes

- [ ] Revisar y fusionar PR #1 cuando los checks de GitHub estén verdes.
- [ ] Revisar las 12 alertas de Dependabot reportadas por GitHub (5 altas, 6 moderadas y 1 baja).
- [ ] Confirmar en el panel Umami que los eventos aparecen después de publicar.
- [ ] Configurar dominios/DNS/TLS finales en Dokploy.
- [ ] Ejecutar una prueba de despliegue con `COOKIE_SECURE=true` y dominios reales.
- [ ] Añadir una política de backup y restauración documentada para PostgreSQL y
      el volumen de medios.
- [ ] Evaluar cache HTTP para assets y páginas públicas después del primer despliegue.

## Incidencias de desarrollo local

- Si Docker informa que `127.0.0.1:8000` está ocupado, comprobar primero:

  ```powershell
  docker compose --env-file .env.compose.local ps
  docker ps --format 'table {{.Names}}\t{{.Ports}}\t{{.Status}}'
  Get-NetTCPConnection -LocalPort 8000 -State Listen
  ```

- Los puertos del stack usan `CMS_WEB_PORT`, `CMS_API_PORT` y
  `CMS_POSTGRES_PORT`. Se usan nombres específicos para no colisionar con
  variables genéricas del entorno como `API_PORT`.

- Si hay un stack anterior, detener únicamente ese proyecto con:

  ```powershell
  docker compose --env-file .env.compose.local down
  ```

  No usar `down -v` salvo que se quiera borrar explícitamente los volúmenes locales
  de PostgreSQL y medios.
