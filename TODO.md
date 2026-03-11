# TODO — Redesign 2026

Estado: en progreso (rama `redesing-2026`)

Tareas principales

- [x] Crear rama `redesing-2026`
- [x] Scaffolding: `package.json`, Tailwind config, fetch script, workflow
- [x] Mapear paginas y componentes (prioridad alta)
- [x] Esbozar estructura HTML/CSS/JS (Hero, Projects, Articles, Contact, Footer)
- [x] Migrar assets (icons, images, fonts)
- [x] Implementar componentes en VanillaJS
- [x] Integrar estilos compilados (`assets/css/tailwind.css`)
- [x] Probar localmente y ajustar interacciones basicas
- [x] Crear Web Components (`<project-card>`, `<projects-grid>`)
- [x] Crear pagina `projects.html` con catalogo completo + filtros
- [x] Enlazar "Ver mas proyectos" desde `index.html` → `projects.html`
- [x] Mover documentacion de despliegue a `doc.md`; simplificar `README.md`
- [ ] Optimizar y preparar commit/PR final
- [ ] Verificar CORS de `resume.rafnixg.dev` desde `rafnixg.dev`

Notas rápidas

- Usaremos Tailwind CLI para compilar a `assets/css/tailwind.css`.
- Articulos se pre-renderizan con `build/fetch-articles.js` y se guardan en `data/articles.json`.
- Workflow GitHub: `.github/workflows/update-articles.yml` (mensual + manual) actualiza `data/articles.json`.
- El endpoint correcto de Hashnode para esta integracion es `https://gql.hashnode.com`.
- Proyectos en `projects.html` se cargan dinamicamente desde `https://resume.rafnixg.dev/resume.json`.
- Web Components usan Light DOM para compatibilidad con Tailwind CSS compilado.

Comandos útiles

```bash
# Instalar dependencias
npm install

# Generar articles.json y compilar CSS
npm run build

# Ejecutar solo fetch de artículos
node build/fetch-articles.js

# Compilar solo CSS (requiere Tailwind instalado)
npm run build:css

# Servir localmente (desde repo raíz)
python -m http.server 8000
```

Archivos clave

- `index.html` — punto de entrada; hero, 4 proyectos destacados, articulos, contacto.
- `projects.html` — catalogo completo de proyectos con filtros por tipo.
- `script.js` — interactividad minima (año en footer).
- `components/project-card.js` — Web Component `<project-card>`.
- `components/projects-grid.js` — Web Component `<projects-grid>`.
- `components/articles.js` — cliente para cargar `data/articles.json`.
- `build/fetch-articles.js` — script para consultar Hashnode y producir `data/articles.json`.
- `assets/css/tailwind.css` — salida del build CSS.
- `doc.md` — documentacion completa de stack, componentes y despliegue.

Problemas detectados

- El endpoint viejo `https://api.hashnode.com` falla con `Stellate service not found`; se corrigio a `https://gql.hashnode.com` y a la estructura `publications -> edges -> posts -> edges`.
- Pendiente verificar que `resume.rafnixg.dev` devuelva cabecera `Access-Control-Allow-Origin` correcta para peticiones desde `rafnixg.dev` en `projects.html`.
