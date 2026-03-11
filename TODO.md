# TODO — Redesign 2026

Estado: **completado** (rama `redesing-2026`) — pendiente merge a `main`

## Completado

- [x] Crear rama `redesing-2026`
- [x] Scaffolding: `package.json`, Tailwind config, fetch scripts, workflow
- [x] Migrar assets (icons, favicon, og:image, fuentes)
- [x] Implementar HTML/CSS base (Hero, Projects, Articles, Contact, Footer)
- [x] Web Components: `<project-card>`, `<projects-grid>`
- [x] Web Components: `<site-nav>`, `<site-footer>`, `<section-header>`, `<social-links>`, `<article-card>`
- [x] `index.html` — todos los componentes integrados, sin `script.js`
- [x] `projects.html` — catálogo completo con filtros por categoría
- [x] Fix CORS: `resume.rafnixg.dev` → datos locales en `data/resume.json`
- [x] `build/fetch-resume.js` + script `build:resume` en `package.json`
- [x] Workflow GitHub actualizado para obtener artículos y proyectos
- [x] Reorganizar CSS: `style.css` y `input.css` → `assets/css/`
- [x] Eliminar archivos sin uso (`script.js`, imágenes antiguas, directorio `src/`)
- [x] `node_modules` removido del historial de git
- [x] Crear `robots.txt`, `llms.txt`, `humans.txt`, `.well-known/security.txt`
- [x] Mejorar `sitemap.xml` (ambas páginas, `changefreq`, `priority`)
- [x] Mejorar `.gitignore`
- [x] Actualizar `README.md` y `doc.md`

## Pendiente

- [ ] Revisión responsive y polish visual final
- [ ] Commit final + PR + merge `redesing-2026` → `main`

## Notas técnicas

- Web Components usan **Light DOM** para compatibilidad con Tailwind CSS compilado.
- `data/resume.json` se genera en build (CORS fix). No editar manualmente.
- `assets/css/tailwind.css` es output de build. No editar manualmente.
- Input de Tailwind: `assets/css/input.css`. Variables CSS del tema definidas ahí.
- Workflow: `.github/workflows/update-articles.yml` — mensual + manual, obtiene artículos y proyectos.

## Comandos útiles

```bash
npm install                  # instalar dependencias
npm run build                # fetch artículos + proyectos + compilar CSS
npm run build:css            # solo compilar CSS
node build/fetch-articles.js # solo artículos
node build/fetch-resume.js   # solo proyectos
python -m http.server 8000   # servidor local
```
