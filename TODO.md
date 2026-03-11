# TODO — Redesign 2026

Estado: en progreso (rama `redesing-2026`)

Tareas principales

- [x] Crear rama `redesing-2026`
- [x] Scaffolding: `package.json`, Tailwind config, fetch script, workflow
- [x] Mapear paginas y componentes (prioridad alta)
- [x] Esbozar estructura HTML/CSS/JS (Hero, Projects, Articles, Contact, Footer)
- [ ] Migrar assets (icons, images, fonts)
- [x] Implementar componentes en VanillaJS
- [x] Integrar estilos compilados (`assets/css/tailwind.css`)
- [x] Probar localmente y ajustar interacciones basicas
- [ ] Optimizar y preparar commit/PR final
- [ ] Documentar pasos de despliegue

Notas rápidas

- Usaremos Tailwind CLI para compilar a `assets/css/tailwind.css`.
- Articulos se pre-renderizan con `build/fetch-articles.js` y se guardan en `data/articles.json`.
- Workflow GitHub: `.github/workflows/update-articles.yml` (mensual + manual) actualiza `data/articles.json`.
- El endpoint correcto de Hashnode para esta integracion es `https://gql.hashnode.com`.

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

- `index.html` — punto de entrada con el layout estatico del nuevo diseno.
- `script.js` — interactividad minima del nuevo layout.
- `components/articles.js` — cliente para cargar `data/articles.json`.
- `build/fetch-articles.js` — script para consultar Hashnode y producir `data/articles.json`.
- `assets/css/tailwind.css` — salida del build CSS.

Problemas detectados

- El endpoint viejo `https://api.hashnode.com` falla con `Stellate service not found`; se corrigio a `https://gql.hashnode.com` y a la estructura `publications -> edges -> posts -> edges`.
- Queda pendiente copiar los iconos del repo nuevo si queremos igualar tambien la metadata visual (`icon.svg`, `apple-icon.png`, `icon-light-32x32.png`, `icon-dark-32x32.png`).
