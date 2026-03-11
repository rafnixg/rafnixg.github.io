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
# Instalar dependencias
npm install

# Compilar CSS + obtener articulos
npm run build

# Solo CSS
npm run build:css

# Solo articulos
node build/fetch-articles.js

# Servidor local
python -m http.server 8000
# o con Node.js
npx serve .
```

### Build de articulos

El archivo `build/fetch-articles.js` consulta `https://gql.hashnode.com` y genera `data/articles.json`.

Tambien existe un workflow en `.github/workflows/update-articles.yml` que permite:

- actualizacion mensual programada
- ejecucion manual con `workflow_dispatch`

### Despliegue en GitHub Pages

1. Asegurarse de que `assets/css/tailwind.css` y `data/articles.json` esten generados y commiteados:
   ```bash
   npm run build
   git add assets/css/tailwind.css data/articles.json
   git commit -m "chore: build assets"
   ```
2. Hacer merge de `redesing-2026` a `main`:
   ```bash
   git checkout main
   git merge redesing-2026
   git push origin main
   ```
3. GitHub Actions desplegara automaticamente via `pages-build-deployment`.  
   Verificar el estado en: `https://github.com/rafnixg/rafnixg.github.io/actions`

### Estructura de assets

```
assets/
  css/tailwind.css      — CSS compilado (generado por npm run build:css)
  fonts/Mona-Sans.woff2 — Fuente personalizada
  icons/
    icon.svg            — Favicon SVG
    icon-light-32x32.png
    icon-dark-32x32.png
    apple-icon.png
  images/
    banner_web.png      — Imagen para og:image / Twitter card
    logo.png
    skills/             — Logos de tecnologias
    social-links/       — Iconos de redes sociales
```

### Estado

Layout principal migrado:

- Hero
- Projects
- Articles (cargados desde `data/articles.json` via fetch)
- Contact
- Footer
- pulir metadata/icons
- revisar detalles de responsive y polish final
