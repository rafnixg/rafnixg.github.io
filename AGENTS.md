# Contribuir a Rafnixg.dev

## Alcance

Este repositorio contiene un monolito modular FastAPI que sirve el sitio público,
el CV y un CMS privado. PostgreSQL es la fuente de datos en producción y en el
entorno local de Docker Compose.

## Mapa rápido

- `backend/app/routers/web.py`: páginas públicas renderizadas con Jinja y SEO.
- `backend/app/routers/public.py`: API pública de contenido, proyectos, artículos y CV.
- `backend/app/routers/admin.py`: API y autenticación del panel CMS.
- `backend/app/templates/`: layouts y componentes reutilizables.
- `assets/css/`: estilos fuente; `assets/css/tailwind.css` es compilado.
- `data/`: contenido inicial usado por el seed.
- `compose.yaml`: PostgreSQL, FastAPI, Nginx local y smoke test.

## Desarrollo local

```powershell
Copy-Item .env.compose.example .env.compose.local
docker compose --env-file .env.compose.local up --build -d
docker compose --env-file .env.compose.local --profile test run --rm smoke
```

La web está en `http://localhost:8000`, la API y el admin en `http://localhost:8001`.
No se deben versionar `.env.compose.local`, contraseñas, sesiones ni archivos subidos.

## Reglas de implementación

- Mantener el backend como monolito modular; evitar servicios o dependencias nuevas
  sin una necesidad clara.
- Validar y sanitizar cualquier entrada administrativa. Las operaciones mutantes
  requieren sesión y CSRF.
- Mantener CORS explícito y nunca usar `*` con credenciales.
- Usar componentes Jinja reutilizables y estilos con los tokens existentes.
- Las métricas Umami deben ser eventos anónimos de interacción; no incluir emails,
  nombres de usuario, tokens o contenido sensible.
- Toda nueva interacción pública debe conservar foco visible, estados activos y
  funcionamiento en 320, 375, 414 y 768 px.
- Actualizar `backend/smoke.py` cuando se agregue una ruta crítica o un requisito
  de seguridad verificable.

## Verificación antes de una PR

```powershell
git diff --check
npm run build
docker compose --env-file .env.compose.local up --build -d
docker compose --env-file .env.compose.local --profile test run --rm smoke
```

Los commits deben explicar el cambio y la PR debe incluir alcance, pruebas y
notas de despliegue si se modifican variables de entorno o Docker.
