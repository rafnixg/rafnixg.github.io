# Rafnixg.dev

[![pages-build-deployment](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/pages/pages-build-deployment/badge.svg?branch=main)](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/pages/pages-build-deployment)
[![Sync Hashnode articles](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/update-articles.yml/badge.svg)](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/update-articles.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/rafnixg/rafnixg.github.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Sitio personal de [Rafnix Guzman](https://rafnixg.dev) — Python Backend | AI Engineer | Odoo Developer.

Construido con FastAPI, PostgreSQL, Jinja, Tailwind CSS y JavaScript. FastAPI sirve las páginas públicas con metadatos SEO renderizados en servidor y ofrece un panel CMS de uso personal. El antiguo frontend estático se conserva en el repositorio como referencia.

---

## Inicio rápido

```bash
cp .env.compose.example .env.compose.local  # define secretos locales
docker compose --env-file .env.compose.local up --build -d
```

Abre `http://localhost:8000` para la web y `http://localhost:8001/admin` para el CMS. Para reconstruir los recursos del panel después de cambiar Tailwind o Quill, ejecuta `npm install && npm run build` antes de crear la imagen.

El monolito se empaqueta con Docker y se despliega en Dokploy. Al primer inicio, Alembic crea las tablas y carga el contenido inicial de `data/`. El panel, la web y el CV comparten aplicación; los archivos subidos se guardan en un volumen persistente. Para desarrollo local usa Docker Compose y `COOKIE_SECURE=false`.

---

## Stack

| Capa       | Tecnología |
| ---------- | ---------- |
| Markup     | Plantillas Jinja con componentes reutilizables |
| Estilos    | Tailwind CSS CLI → `assets/css/tailwind.css` |
| JS         | Panel con formularios; editor visual Quill servido localmente |
| Datos      | FastAPI + PostgreSQL; sincronización mensual de artículos desde Hashnode |
| CI/CD      | GitHub Actions — sincronización mensual de artículos |
| Deploy     | Dokploy (web, CV, API y panel) + PostgreSQL y volumen de medios |

---

## Comandos

```bash
# Compilar CSS
npm run build

# Ejemplo completo con PostgreSQL
docker compose --env-file .env.compose.local up --build -d
```

### Prueba local con Docker Compose

1. Copia `.env.compose.example` a `.env.compose.local` y reemplaza los cuatro valores por secretos locales. El archivo local está ignorado por Git.
2. Ejecuta `docker compose --env-file .env.compose.local up --build -d` desde la raíz del repositorio.
3. Abre la web en `http://localhost:8000`, el CV en `http://localhost:8000/cv`, comprueba la API en `http://localhost:8001/health` y entra al panel en `http://localhost:8001/admin`. PostgreSQL queda disponible solo en `127.0.0.1:5433`.
4. Para detener los servicios, ejecuta `docker compose --env-file .env.compose.local down`. PostgreSQL y medios permanecen en los volúmenes `postgres_data` y `media_data`.

Para repetir la prueba automatizada de salud, contenido, autenticación y CORS, ejecuta `docker compose --env-file .env.compose.local --profile test run --rm smoke` con los servicios levantados.

El usuario local del panel es `admin`. La web pública se renderiza desde FastAPI con los datos guardados en PostgreSQL; la API JSON queda disponible para otros consumidores.

### Métricas Umami

La web pública conserva el seguimiento de páginas de Umami y añade eventos de interacción sin cookies: `project_open`, `project_filter`, `article_open`, `cv_open`, `projects_open`, `articles_open`, `social_open`, `contact_jump` y `projects_jump`. Los enlaces incluyen la superficie (`home`, `projects`, `nav`) y, cuando aplica, el nombre del proyecto o red. Estos eventos se consultan en el panel de Umami asociado al sitio; no se almacenan métricas en PostgreSQL ni se envían datos personales.

El panel está en `https://api.rafnixg.dev/admin`. Desde allí se editan Inicio, Proyectos, Artículos, Páginas, CV, Medios y SEO mediante formularios. Los cambios se publican al guardar. La API pública conserva `/api/site-content`, `/api/projects`, `/api/articles` y `/api/resume`. En Dokploy configura `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `ARTICLE_SYNC_TOKEN`, `COOKIE_SECURE=true`, `CORS_ORIGINS` y `MEDIA_DIR=/app/uploads`, con un volumen persistente en esa última ruta. Dirige `rafnixg.dev`, `resume.rafnixg.dev` y `api.rafnixg.dev` al mismo servicio; FastAPI usa el host para servir el sitio correcto. Los secretos deben ser fuertes, distintos y quedar fuera del repositorio.

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

### Dokploy (monolito CMS)
El mismo contenedor sirve `rafnixg.dev`, `resume.rafnixg.dev` y `api.rafnixg.dev`. Configura los tres dominios en el proxy, PostgreSQL persistente y un volumen para `/app/uploads`. Verifica DNS/TLS antes de retirar el alojamiento estático principal. El panel queda bajo `/admin` y la API bajo `/api`.

### GitHub Pages (copia histórica)
La rama `main` puede seguir mostrando el frontend estático anterior en `https://rafnixg.github.io`, pero no refleja las ediciones inmediatas del CMS y no debe anunciarse como origen canónico.

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

