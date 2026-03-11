# Rafnixg.dev

[![pages-build-deployment](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/pages/pages-build-deployment/badge.svg?branch=main)](https://github.com/rafnixg/rafnixg.github.io/actions/workflows/pages/pages-build-deployment)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/rafnixg/rafnixg.github.io)

## Personal website

Sitio personal estatico construido con HTML, CSS y JavaScript, migrado desde un diseno original en Next.js hacia una implementacion sin frameworks.

## Redesign 2026

La rama de trabajo para esta migracion es `redesing-2026`.

### Stack actual

- HTML estatico en `index.html`
- Tailwind CSS compilado a `assets/css/tailwind.css`
- JavaScript vanilla para interacciones y render de articulos
- Build script en Node para obtener posts desde Hashnode

### Comandos

```bash
npm install
npm run build
python -m http.server 8000
```

### Build de articulos

El archivo `build/fetch-articles.js` consulta `https://gql.hashnode.com` y genera `data/articles.json`.

Tambien existe un workflow en `.github/workflows/update-articles.yml` que permite:

- actualizacion mensual programada
- ejecucion manual con `workflow_dispatch`

### Estado

Ya esta migrado el layout principal del nuevo diseno:

- Hero
- Projects
- Articles
- Contact
- Footer

Pendiente:

- copiar algunos assets visuales del repo nuevo
- pulir metadata/icons
- revisar detalles de responsive y polish final
