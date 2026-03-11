# Documentación — Rafnixg.dev (Redesign 2026)

Guía de desarrollo, build y despliegue del sitio personal.

---

## Stack

| Capa       | Tecnología                                      |
| ---------- | ----------------------------------------------- |
| Markup     | HTML estático (`index.html`, `projects.html`)   |
| Estilos    | Tailwind CSS compilado → `assets/css/tailwind.css` |
| JS         | Vanilla JS + Web Components                     |
| Datos      | `data/articles.json` (Hashnode), `resume.rafnixg.dev/resume.json` (proyectos) |
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

# Solo artículos (requiere HASHNODE_TOKEN en entorno)
node build/fetch-articles.js

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
| `src`    | string | URL del `resume.json` (default: `https://resume.rafnixg.dev/resume.json`) |

**Ejemplo:**
```html
<projects-grid
  src="https://resume.rafnixg.dev/resume.json"
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
    logo.png
    skills/               ← Logos de tecnologías
    social-links/         ← Iconos de redes sociales
```

---

## Variables CSS del tema

Definidas en `src/input.css` bajo `:root`:

| Variable        | Valor (RGB)  | Uso                      |
| --------------- | ------------ | ------------------------ |
| `--primary`     | 101 116 255  | Acento principal (azul)  |
| `--secondary`   | 24 174 201   | Acento secundario (cyan) |
| `--background`  | 20 24 36     | Fondo principal          |
| `--card`        | 27 32 46     | Fondo de tarjetas        |
| `--foreground`  | 244 247 251  | Texto principal          |
| `--border`      | 48 57 78     | Bordes                   |
