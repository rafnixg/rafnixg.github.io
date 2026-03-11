/**
 * <project-card> — Web Component
 *
 * Atributos:
 *   name        — nombre del proyecto
 *   description — descripción
 *   url         — enlace (preferiblemente GitHub)
 *   keywords    — JSON array de tecnologías, e.g. '["Python","FastAPI"]'
 *   entity      — tipo de proyecto ("Personal Project", "Open Source Contribution", …)
 *   show-image  — presencia activa → muestra OG-image de GitHub
 */
class ProjectCard extends HTMLElement {
  connectedCallback() {
    this.className =
      'flex flex-col overflow-hidden rounded-2xl border border-border bg-card/80 shadow-lg shadow-black/10 transition-shadow hover:shadow-glow';
    const entity = this.getAttribute('entity') || '';
    if (entity) this.dataset.entity = entity;
    this._render();
  }

  _ghImage(url) {
    const m = (url || '').match(/github\.com\/([^/?#\s]+\/[^/?#\s]+)/);
    return m ? `https://opengraph.githubassets.com/1a/${m[1]}` : null;
  }

  _esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  _render() {
    const name        = this.getAttribute('name')        || '';
    const description = this.getAttribute('description') || '';
    const url         = this.getAttribute('url')         || '#';
    const entity      = this.getAttribute('entity')      || '';
    const showImage   = this.hasAttribute('show-image');

    let keywords = [];
    try { keywords = JSON.parse(this.getAttribute('keywords') || '[]'); } catch { /* noop */ }

    const imgSrc  = showImage ? this._ghImage(url) : null;
    const imgHtml = imgSrc
      ? `<div class="overflow-hidden bg-muted">
           <img src="${imgSrc}" alt="${this._esc(name)}" loading="lazy"
                class="h-auto w-full object-contain transition-transform duration-300 hover:scale-105">
         </div>`
      : '';

    const tagsHtml = keywords.slice(0, 5)
      .map(k => `<span class="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">${this._esc(k)}</span>`)
      .join('');

    const entityHtml = entity
      ? `<span class="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">${this._esc(entity)}</span>`
      : '';

    this.innerHTML = `
      ${imgHtml}
      <div class="flex flex-1 flex-col gap-4 p-6">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <h3 class="text-xl font-bold leading-snug">${this._esc(name)}</h3>
          ${entityHtml}
        </div>
        <p class="flex-1 text-sm text-muted-foreground">${this._esc(description)}</p>
        <div class="flex flex-wrap gap-2">${tagsHtml}</div>
        <a href="${this._esc(url)}" target="_blank" rel="noopener noreferrer"
           class="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4" aria-hidden="true">
            <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.93 10.93 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.41-2.68 5.38-5.24 5.67.41.35.78 1.04.78 2.1 0 1.52-.01 2.74-.01 3.11 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
          </svg>
          Ver en GitHub
        </a>
      </div>`;
  }
}

customElements.define('project-card', ProjectCard);
