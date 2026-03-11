# Documentación — Rafnixg.dev (Redesign 2026)

Guía de desarrollo, build y despliegue del sitio personal.

---

## Stack

| Capa       | Tecnología                                      |
| ---------- | ----------------------------------------------- |
| Markup     | HTML estático (`index.html`, `projects.html`)   |
| Estilos    | Tailwind CSS compilado → `assets/css/tailwind.css` |
| JS         | Vanilla JS + Web Components                     |
| Datos      | `data/articles.json` (Hashnode), `data/resume.json` (JSON Resume local) |
| CI/CD      | GitHub Actions (Pages + actualización de artículos) |

---

## Comandos

```bash
# Instalar dependencias
npm install

# Compilar CSS + obtener artículos (build completo)
npm run build

# Solo CSS
npm run build:css

# Solo artículos
node build/fetch-articles.js

# Solo proyectos (resume.json)
node build/fetch-resume.js

# Servidor local
python -m http.server 8000
# o con Node.js
npx serve .
```

---

## Componentes Web

### `<project-card>`  
`components/project-card.js`

Renderiza una tarjeta de proyecto con imagen OpenGraph de GitHub, descripción, etiquetas y enlace.

**Atributos:**

| Atributo      | Tipo    | Descripción                                      |
| ------------- | ------- | ------------------------------------------------ |
| `name`        | string  | Nombre del proyecto                              |
| `description` | string  | Descripción corta                                |
| `url`         | string  | URL del repositorio (GitHub preferido)           |
| `keywords`    | JSON    | Array de tecnologías, e.g. `'["Python","FastAPI"]'` |
| `entity`      | string  | Tipo: "Personal Project", "Personal Lab", "Open Source Contribution", "Learning Project" |
| `show-image`  | boolean | Presencia activa → muestra imagen OpenGraph de GitHub |

**Ejemplo:**
```html
<project-card
  name="BCV Exchange Rate API"
  description="API REST para tasas de cambio del BCV."
  url="https://github.com/rafnixg/bcv-api"
  keywords='["FastAPI","Python"]'
  entity="Personal Project"
  show-image
></project-card>
```

---

### `<projects-grid>`  
`components/projects-grid.js`

Carga el array `projects` desde un JSON Resume y renderiza una `<project-card>` por cada entrada. Emite el evento `projects-ready` (bubbles) cuando las tarjetas están en el DOM, lo que permite aplicar filtros diferidos.

**Atributos:**

| Atributo | Tipo   | Descripción                                                      |
| -------- | ------ | ---------------------------------------------------------------- |
| `src`    | string | URL del `resume.json` (default: `/data/resume.json`) |

**Ejemplo:**
```html
<projects-grid
  class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
></projects-grid>
```

---

## Páginas

| Archivo          | Descripción                                                  |
| ---------------- | ------------------------------------------------------------ |
| `index.html`     | Página principal: Hero, 4 proyectos destacados, Artículos, Contacto |
| `projects.html`  | Catálogo completo de proyectos con filtros (Todos / Personales / Open Source / Aprendizaje) |

---

## Build de artículos

`build/fetch-articles.js` consulta `https://gql.hashnode.com` (publicación `blog.rafnixg.dev`) y genera `data/articles.json` con los últimos posts.

También existe `.github/workflows/update-articles.yml` que ejecuta este script:
- mensualmente (programado)
- manualmente vía `workflow_dispatch`

---

## Despliegue en GitHub Pages

1. Generar y commitear los assets compilados:
   ```bash
   npm run build
   git add assets/css/tailwind.css data/articles.json
   git commit -m "chore: build assets"
   ```

2. Fusionar `redesing-2026` → `main`:
   ```bash
   git checkout main
   git merge redesing-2026
   git push origin main
   ```

3. GitHub Actions despliega automáticamente vía `pages-build-deployment`.  
   Estado: `https://github.com/rafnixg/rafnixg.github.io/actions`

---

## Estructura de assets

```
assets/
  css/
    tailwind.css          ← CSS compilado (no editar manualmente)
  fonts/
    Mona-Sans.woff2       ← Fuente variable
    LICENSE.txt
  icons/
    icon.svg              ← Favicon SVG principal
    icon-light-32x32.png  ← Favicon 32×32 modo claro
    icon-dark-32x32.png   ← Favicon 32×32 modo oscuro
    apple-icon.png        ← Apple Touch Icon
  images/
    banner_web.png        ← og:image / Twitter card
```

---

## Variables CSS del tema

Definidas en `assets/css/input.css` bajo `:root`:

| Variable        | Valor (RGB)  | Uso                      |
| --------------- | ------------ | ------------------------ |
| `--primary`     | 101 116 255  | Acento principal (azul)  |
| `--secondary`   | 24 174 201   | Acento secundario (cyan) |
| `--background`  | 20 24 36     | Fondo principal          |
| `--card`        | 27 32 46     | Fondo de tarjetas        |
| `--foreground`  | 244 247 251  | Texto principal          |
| `--border`      | 48 57 78     | Bordes                   |

---

## Nuevos Web Components

### `<site-nav>`
`components/site-nav.js`

Barra de navegación sticky compartida.

| Atributo | Tipo    | Descripción |
| -------- | ------- | ----------- |
| `page`  | string  | Etiqueta de la página activa (se muestra a la derecha) |
| `back`  | boolean | Muestra "← Inicio" en lugar del menú de secciones |

### `<site-footer>`
`components/site-footer.js`

Footer compartido con año automático.

| Atributo | Tipo    | Descripción |
| -------- | ------- | ----------- |
| `back`  | boolean | Muestra "← Volver al inicio" en lugar de links de política |

### `<section-header>`
`components/section-header.js`

Bloque de título + subtítulo para encabezados de sección.

| Atributo  | Tipo   | Descripción |
| --------- | ------ | ----------- |
| `heading` | string | Texto del `<h2>` |
| `sub`     | string | Párrafo de subtítulo |
| `align`   | string | `"left"` o `"center"` (default: center) |

### `<social-links>`
`components/social-links.js`

Iconos de redes sociales (GitHub, LinkedIn, Links).

| Atributo  | Tipo   | Descripción |
| --------- | ------ | ----------- |
| `variant` | string | `"icons"` (círculos SVG, default) o `"pills"` (botones texto) |

### `<article-card>`
`components/article-card.js`

Tarjeta de artículo con fecha, vistas y tiempo de lectura.

| Atributo    | Tipo   | Descripción |
| ----------- | ------ | ----------- |
| `title`     | string | Título del artículo |
| `brief`     | string | Resumen corto |
| `url`       | string | Enlace al artículo |
| `date`      | string | Fecha ISO (formateada automáticamente) |
| `views`     | string | Número de vistas |
| `read-time` | string | Tiempo de lectura en minutos |

---

## Archivos web estándar

| Archivo                    | Descripción |
| -------------------------- | ----------- |
| `robots.txt`               | Directivas para crawlers, apunta al sitemap |
| `llms.txt`                 | Descripción del sitio para agentes AI (llmstxt.org) |
| `humans.txt`               | Créditos del equipo y tecnologías |
| `.well-known/security.txt` | Contacto de seguridad |
| `sitemap.xml`              | Sitemap con ambas páginas, `changefreq` y `priority` |

---

## Estructura de CSS

```
assets/css/
  input.css      ← fuente Tailwind + variables CSS del tema (editar aquí)
  style.css      ← estilos globales, fuentes, web components display fix
  tailwind.css   ← output compilado por Tailwind CLI (no editar)
```
