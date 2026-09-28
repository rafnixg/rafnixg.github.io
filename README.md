# Rafnixg.dev

[![pages-build-deployment](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/pages/pages-build-deployment/badge.svg?branch=main)](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/pages/pages-build-deployment)
[![Sync Hashnode articles](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/update-articles.yml/badge.svg)](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/update-articles.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/rafnixg/rafnixg.github.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Sitio personal de [Rafnix Guzman](https://rafnixg.dev) — Python Backend | AI Engineer | Odoo Developer.

Construido con HTML estático, Tailwind CSS y Vanilla JS Web Components. El contenido se administra con un CMS modular FastAPI + PostgreSQL; el frontend continúa disponible en `rafnixg.dev` y GitHub Pages.

---

## Inicio rápido

```bash
npm install                  # instalar dependencias del frontend
npm run build                # compilar CSS
python -m http.server 8000   # servidor local en http://localhost:8000
```

El backend se empaqueta con Docker y se despliega en Dokploy. Al primer inicio, las migraciones crean las tablas y el backend carga el contenido inicial de `data/`. Para desarrollo local, configura las variables indicadas en `backend/.env.example`, inicia FastAPI desde `backend/` y sirve el frontend estático desde la raíz. Para el frontend local, agrega su origen a `CORS_ORIGINS` y usa `COOKIE_SECURE=false`. El frontend consulta `https://api.rafnixg.dev`.

---

## Stack

| Capa       | Tecnología |
| ---------- | ---------- |
| Markup     | HTML estático (`index.html`, `projects.html`) |
| Estilos    | Tailwind CSS CLI → `assets/css/tailwind.css` |
| JS         | Vanilla JS + Web Components (Light DOM) |
| Datos      | FastAPI + PostgreSQL; sincronización mensual de artículos desde Hashnode |
| CI/CD      | GitHub Actions — Pages + sincronización mensual de artículos |
| Deploy     | Dokploy (API y panel) + hosting estático + GitHub Pages (espejo) |

---

## Comandos

```bash
# Compilar CSS
npm run build

# Servidor local
python -m http.server 8000
npx serve .
```

### Prueba local con Docker Compose

1. Copia `.env.compose.example` a `.env.compose.local` y reemplaza los cuatro valores por secretos locales. El archivo local está ignorado por Git.
2. Ejecuta `docker compose --env-file .env.compose.local up --build -d` desde la raíz del repositorio.
3. Abre la web en `http://localhost:8000`, comprueba la API en `http://localhost:8001/health` y entra al panel en `http://localhost:8001/admin`. PostgreSQL queda disponible solo en `127.0.0.1:5433`.
4. Para detener los servicios, ejecuta `docker compose --env-file .env.compose.local down`. Los datos permanecen en el volumen `postgres_data`.

Para repetir la prueba automatizada de salud, contenido, autenticación y CORS, ejecuta `docker compose --env-file .env.compose.local --profile test run --rm smoke` con los servicios levantados.

El usuario local del panel es `admin`. El frontend detecta `localhost` y consume automáticamente el CMS local en `http://localhost:8001/api`.

El panel administrativo está en `https://api.rafnixg.dev/admin`. La API pública usa `/api/site-content`, `/api/projects`, `/api/articles` y `/api/resume`. El currículum se administra como un documento JSON Resume completo; los proyectos visibles en el sitio tienen su propia curación en el panel. El repositorio `rafnixg/resume` consume `GET /api/resume` sin autenticación mediante su workflow manual «Publish resume from CMS»; después de guardar el CV, ejecuta ese workflow para actualizar su página estática. En Dokploy configura `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `ARTICLE_SYNC_TOKEN`, `COOKIE_SECURE=true` y `CORS_ORIGINS`; incluye `https://resume.rafnixg.dev` en la lista si su web consulta la API desde el navegador. Los secretos deben ser fuertes, distintos y mantenerse fuera del repositorio. Usa PostgreSQL con almacenamiento persistente y define el mismo `ARTICLE_SYNC_TOKEN` como secreto de GitHub Actions para habilitar la sincronización mensual.

---

## Estructura del proyecto

```
.
├── index.html              ← Página principal
├── projects.html           ← Catálogo completo de proyectos
├── assets/
│   ├── css/
│   │   ├── input.css       ← Fuente Tailwind + variables CSS del tema (EDITAR aquí)
│   │   ├── style.css       ← Estilos globales, fuentes, Web Components fixes
│   │   └── tailwind.css    ← Output compilado (NO editar)
│   ├── fonts/
│   │   └── Mona-Sans.woff2
│   ├── icons/
│   │   ├── icon.svg
│   │   ├── icon-light-32x32.png
│   │   ├── icon-dark-32x32.png
│   │   └── apple-icon.png
│   └── images/
│       └── banner_web.png  ← og:image / Twitter card
├── backend/                ← FastAPI, panel CMS, modelos y migraciones
├── Dockerfile              ← Imagen de backend para Dokploy
├── components/             ← Web Components
│   ├── site-nav.js
│   ├── site-footer.js
│   ├── section-header.js
│   ├── social-links.js
│   ├── project-card.js
│   ├── projects-grid.js
│   ├── article-card.js
│   ├── articles.js
│   └── site-content.js     ← Carga contenido desde la API
├── data/
│   ├── articles.json       ← Datos iniciales para PostgreSQL
│   ├── resume.json         ← CV JSON Resume inicial y fuente inicial de proyectos
│   └── site-content.json   ← Contenido editable inicial del sitio
├── .github/
│   └── workflows/
│       └── update-articles.yml
├── robots.txt
├── sitemap.xml
├── llms.txt
├── humans.txt
└── .well-known/
    └── security.txt
```

---

## Web Components

### `<site-nav>`
Barra de navegación sticky compartida.

| Atributo | Tipo    | Descripción |
| -------- | ------- | ----------- |
| `page`   | string  | Etiqueta de la página activa (se muestra a la derecha) |
| `back`   | boolean | Muestra "← Inicio" en lugar del menú de secciones |

---

### `<site-footer>`
Footer compartido con año automático y links a GitHub.

| Atributo | Tipo    | Descripción |
| -------- | ------- | ----------- |
| `back`   | boolean | Muestra "← Volver al inicio" en lugar del copyright |

---

### `<section-header>`
Bloque de título + subtítulo para encabezados de sección.

| Atributo  | Tipo   | Descripción |
| --------- | ------ | ----------- |
| `heading` | string | Texto del `<h2>` |
| `sub`     | string | Párrafo de subtítulo |
| `align`   | string | `"left"` o `"center"` (default: center) |

---

### `<social-links>`
Iconos de redes sociales (GitHub, LinkedIn, Links).

| Atributo  | Tipo   | Descripción |
| --------- | ------ | ----------- |
| `variant` | string | `"icons"` (default) o `"pills"` |

---

### `<project-card>`
Tarjeta de proyecto con imagen OpenGraph, descripción, etiquetas y enlace.

| Atributo      | Tipo    | Descripción |
| ------------- | ------- | ----------- |
| `name`        | string  | Nombre del proyecto |
| `description` | string  | Descripción corta |
| `url`         | string  | URL del repositorio |
| `keywords`    | JSON    | Array de tecnologías, e.g. `'["Python","FastAPI"]'` |
| `entity`      | string  | `"Personal Project"` · `"Personal Lab"` · `"Open Source Contribution"` · `"Learning Project"` |
| `show-image`  | boolean | Muestra imagen OpenGraph de GitHub si está presente |

---

### `<projects-grid>`
Carga proyectos desde la API del CMS y renderiza una `<project-card>` por proyecto. El atributo `featured` limita el resultado a los destacados. Emite el evento `projects-ready` cuando las tarjetas están en el DOM.

| Atributo | Tipo   | Descripción |
| -------- | ------ | ----------- |
| `src`    | string | URL de una API compatible (default: endpoint público de proyectos CMS) |

---

### `<article-card>`
Tarjeta de artículo con fecha, vistas y tiempo de lectura.

| Atributo    | Tipo   | Descripción |
| ----------- | ------ | ----------- |
| `title`     | string | Título del artículo |
| `brief`     | string | Resumen corto |
| `url`       | string | Enlace al artículo |
| `date`      | string | Fecha ISO (formateada automáticamente) |
| `views`     | string | Número de vistas |
| `read-time` | string | Tiempo de lectura |

---

## Tema CSS

Variables definidas en `assets/css/input.css`:

| Variable       | Uso |
| -------------- | --- |
| `--primary`    | Acento principal (azul) |
| `--secondary`  | Acento secundario (cyan) |
| `--background` | Fondo principal |
| `--card`       | Fondo de tarjetas |
| `--foreground` | Texto principal |
| `--border`     | Bordes |

---

## Despliegue

### Dokploy (backend CMS)
El backend y el panel CMS se despliegan en Dokploy en `api.rafnixg.dev`. El frontend estático conserva sus alojamientos actuales y consume esa API.

### GitHub Pages (espejo)
Desplegado automáticamente desde la rama `main` via GitHub Actions (`pages-build-deployment`).  
URL: `https://rafnixg.github.io`

### Actualización de artículos
`.github/workflows/update-articles.yml` solicita la sincronización de Hashnode una vez al mes. Los artículos y el resto del contenido persisten en PostgreSQL. El currículum deja de actualizarse desde este workflow.

---

## Archivos web estándar

| Archivo                    | Descripción |
| -------------------------- | ----------- |
| `robots.txt`               | Directivas para crawlers |
| `sitemap.xml`              | Sitemap con ambas páginas |
| `llms.txt`                 | Descripción del sitio para agentes AI |
| `humans.txt`               | Créditos |
| `.well-known/security.txt` | Contacto de seguridad |

---

## Licencia

[MIT](LICENSE) © 2026 Rafnix Guzman

