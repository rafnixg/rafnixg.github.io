# TODO — Redesign 2026

Estado: en progreso (rama `redesign-2026`)

Tareas principales

- [x] Crear rama `redesign-2026`
- [x] Scaffolding: `package.json`, Tailwind config, fetch script, workflow
- [ ] Mapear páginas y componentes (prioridad alta)
- [ ] Esbozar estructura HTML/CSS/JS (Hero, Projects, Articles, Contact, Footer)
- [ ] Migrar assets (icons, images, fonts)
- [ ] Implementar componentes en VanillaJS / Web Components
- [ ] Integrar estilos compilados (`assets/css/tailwind.css`)
- [ ] Probar localmente y ajustar interacciones
- [ ] Optimizar y preparar commit/PR final
- [ ] Documentar pasos de despliegue

Notas rápidas

- Usaremos Tailwind CLI para compilar a `assets/css/tailwind.css`.
- Artículos se pre-renderizan con `build/fetch-articles.js` y se guardan en `data/articles.json`.
- Workflow GitHub: `.github/workflows/update-articles.yml` (mensual + manual) actualiza `data/articles.json`.

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

- `index.html` — punto de entrada (actualizado para incluir `assets/css/tailwind.css`).
- `script.js` — interactividad (menu, theme, observers).
- `components/articles.js` — cliente para cargar `data/articles.json`.
- `build/fetch-articles.js` — script para consultar Hashnode y producir `data/articles.json`.
- `assets/css/tailwind.css` — salida del build CSS.

Problemas detectados

- El fetch a Hashnode puede devolver errores o no exponer `publication` si el usuario no tiene `publication`. El script ahora imprime el status y cuerpo para facilitar diagnóstico.
