# Rafnixg.dev

[![pages-build-deployment](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/pages/pages-build-deployment/badge.svg?branch=main)](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/pages/pages-build-deployment)
[![Update Articles & Resume](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/update-articles.yml/badge.svg)](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/update-articles.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/rafnixg/rafnixg.github.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Sitio personal de [Rafnix Guzman](https://rafnixg.dev) — Python Backend | AI Engineer | Odoo Developer.

Construido con HTML estático, Tailwind CSS y Vanilla JS Web Components. Desplegado en **Coolify** (dominio `rafnixg.dev`) y en **GitHub Pages** como espejo.

---

## Inicio rápido

```bash
npm install                  # instalar dependencias
npm run build                # fetch artículos + resume + compilar CSS
python -m http.server 8000   # servidor local en http://localhost:8000
```

---

## Stack

| Capa       | Tecnología |
| ---------- | ---------- |
| Markup     | HTML estático (`index.html`, `projects.html`) |
| Estilos    | Tailwind CSS CLI → `assets/css/tailwind.css` |
| JS         | Vanilla JS + Web Components (Light DOM) |
| Datos      | `data/articles.json` (Hashnode GraphQL API) · `data/resume.json` (JSON Resume local) |
| CI/CD      | GitHub Actions — Pages + actualización mensual de datos |
| Deploy     | Coolify (self-hosted) + GitHub Pages (espejo) |

---

## Comandos

```bash
# Build completo (artículos + resume + CSS)
npm run build

# Tareas individuales
npm run build:css          # compilar Tailwind
npm run build:articles     # fetch de artículos desde Hashnode
npm run build:resume       # fetch de resume.rafnixg.dev

# Servidor local
python -m http.server 8000
npx serve .
```

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
├── build/
│   ├── fetch-articles.js   ← Fetch artículos desde Hashnode
│   └── fetch-resume.js     ← Fetch resume.rafnixg.dev → data/resume.json
├── components/             ← Web Components
│   ├── site-nav.js
│   ├── site-footer.js
│   ├── section-header.js
│   ├── social-links.js
│   ├── project-card.js
│   ├── projects-grid.js
│   ├── article-card.js
│   └── articles.js
├── data/
│   ├── articles.json       ← Generado por build:articles
│   └── resume.json         ← Generado por build:resume
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
Carga `data/resume.json` y renderiza una `<project-card>` por proyecto. Emite el evento `projects-ready` cuando las tarjetas están en el DOM.

| Atributo | Tipo   | Descripción |
| -------- | ------ | ----------- |
| `src`    | string | URL del JSON Resume (default: `/data/resume.json`) |

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

### Coolify (producción — `rafnixg.dev`)
El sitio se sirve desde infrastructure self-hosted con **Coolify**. El dominio `rafnixg.dev` apunta a este servidor.

### GitHub Pages (espejo)
Desplegado automáticamente desde la rama `main` via GitHub Actions (`pages-build-deployment`).  
URL: `https://rafnixg.github.io`

### Actualización de datos
`.github/workflows/update-articles.yml` ejecuta `build:articles` y `build:resume` mensualmente y commitea los JSON actualizados.

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

