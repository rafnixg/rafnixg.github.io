# Changelog

## v2.0.1 — Hotfixes & polish post-launch

### 🐛 Bug fixes

- **GitHub Actions — 403 en `fetch-resume`**: peticiones sin cabeceras bloqueadas por Cloudflare. Ahora envía `User-Agent` y `Accept` correctos. Si el servidor falla pero existe `resume.json` local, el workflow continúa sin error.
- **GitHub Actions — push sin permisos**: `update-articles.yml` no declaraba `permissions: contents: write` → 403 al hacer `git push`. Corregido. También ajustado `git diff --cached` para detectar correctamente los cambios staged.

### ✨ Mejoras

- **Enlace CV en la navegación**: añadido en desktop y menú móvil, apuntando a `resume.rafnixg.dev` en nueva pestaña.
- **Meta title y descripciones** actualizados usando `basics.label` y resumen de `basics.summary` del JSON Resume. Años corregidos de 10+ a 15+.
- **Datos actualizados**: `articles.json` y `resume.json` regenerados.

### 📝 Documentación

- `doc.md` eliminado e integrado en `README.md`.
- `README.md` renovado con badges, estructura del proyecto en árbol, documentación completa de Web Components y sección de despliegue (Coolify + GitHub Pages).

---

## v2.0.0 — Redesign 2026

Rediseño completo del sitio personal partiendo de cero sobre la rama `redesing-2026`.

### ✨ Nuevas funcionalidades

- **Nuevo layout** completo: Hero, Proyectos, Artículos y Contacto en `index.html`; catálogo de proyectos con filtros en `projects.html`.
- **Web Components** — arquitectura modular en Vanilla JS (Light DOM, compatible con Tailwind):
  - `<site-nav>` con menú hamburger en móvil y soporte de atributos `back` / `page`
  - `<site-footer>` con año automático y links a GitHub
  - `<section-header>` para encabezados de sección
  - `<social-links>` con variantes `icons` / `pills`
  - `<project-card>` y `<projects-grid>` — carga y filtra proyectos desde `data/resume.json`
  - `<article-card>` — tarjeta de artículo con fecha, vistas y tiempo de lectura
- **Pipeline de datos**: `build/fetch-articles.js` (Hashnode GraphQL) y `build/fetch-resume.js` (JSON Resume) generan los JSON en build time.
- **Filtros de proyectos** en `projects.html` por categoría (Todos / Personales / Open Source / Aprendizaje).
- **Tailwind CSS CLI**: compilación desde `assets/css/input.css` → `assets/css/tailwind.css`.
- **Analytics**: Umami self-hosted (`umami.rafnixg.dev`) integrado en ambas páginas.
- **Licencia MIT** añadida.
- **Archivos web estándar**: `robots.txt`, `sitemap.xml`, `llms.txt`, `humans.txt`, `.well-known/security.txt`.
- **GitHub Actions** (`update-articles.yml`): actualización mensual automática de `articles.json` y `resume.json`.

### 🐛 Bug fixes

- Fuente `Mona-Sans` con ruta `@font-face` incorrecta tras mover CSS a `assets/css/` → corregido a `../fonts/`.
- `project-card { display: block }` sobreescribía `[hidden]` del navegador → añadido `project-card[hidden], article-card[hidden] { display: none }`.
- `renderArticles()` nunca se llamaba en el componente de artículos → corregido.
- CORS en `resume.rafnixg.dev` → datos descargados en build time a `data/resume.json`.
- `node_modules` trackeados en git → eliminados con `git rm --cached`.

### 🎨 Polish responsive

- Menú hamburger en `<site-nav>` para pantallas < `sm`.
- `scroll-mt-16` en secciones `#projects`, `#articles`, `#contact` para compensar la nav sticky.
- `.article-link { display: block }` para evitar layout quebrado en tarjetas de artículos.

### 🗂 Organización

- CSS movido a `assets/css/` (`input.css`, `style.css`, `tailwind.css`).
- Directorio `src/` eliminado.
- Archivos no usados eliminados (`script.js`, imágenes legacy).
- `.gitignore` mejorado.

---

## v1.0.0 — Initial release

Primera versión pública del sitio personal.
