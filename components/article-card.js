/**
 * <article-card> — Web Component
 *
 * Tarjeta de artículo del blog.
 *
 * Atributos:
 *   title      — título del artículo
 *   brief      — extracto / descripción
 *   url        — enlace al artículo
 *   date       — fecha ISO (dateAdded)
 *   views      — número de vistas
 *   read-time  — tiempo de lectura (string), e.g. "5 min"
 */
class ArticleCard extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  _esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  _formatDate(value) {
    if (!value) return 'Sin fecha';
    try {
      return new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
        .format(new Date(value));
    } catch { return value; }
  }

  _render() {
    const title    = this._esc(this.getAttribute('title')     || '');
    const brief    = this._esc(this.getAttribute('brief')     || '');
    const url      = this._esc(this.getAttribute('url')       || '#');
    const date     = this._formatDate(this.getAttribute('date'));
    const views    = parseInt(this.getAttribute('views'), 10) || 0;
    const readTime = this._esc(this.getAttribute('read-time') || 'Lectura breve');

    this.innerHTML = `
      <a class="article-link" href="${url}" target="_blank" rel="noopener noreferrer">
        <article class="article-card">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 space-y-2">
              <h3 class="article-title text-2xl font-bold">${title}</h3>
              <p class="text-base text-muted-foreground">${brief}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" class="article-arrow h-5 w-5" aria-hidden="true">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </div>
          <div class="article-meta mt-4">
            <span class="article-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" class="h-4 w-4" aria-hidden="true">
                <path d="M8 2v4"/><path d="M16 2v4"/>
                <rect width="18" height="18" x="3" y="4" rx="2"/>
                <path d="M3 10h18"/>
              </svg>
              ${date}
            </span>
            <span class="article-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" class="h-4 w-4" aria-hidden="true">
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              ${views} vistas
            </span>
            <span>${readTime} lectura</span>
          </div>
        </article>
      </a>`;
  }
}

customElements.define('article-card', ArticleCard);
