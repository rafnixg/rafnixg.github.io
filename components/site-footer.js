/**
 * <site-footer> — Web Component
 *
 * Footer compartido para todas las páginas.
 *
 * Atributos:
 *   back — si está presente, añade "← Volver al inicio" en vez de los links de política
 */
class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.className = 'border-t border-border bg-card/30 px-4 py-8 md:px-6';
    this._render();
  }

  _render() {
    const back = this.hasAttribute('back');

    const right = back
      ? `<a href="/" class="hover:text-foreground">← Volver al inicio</a>`
      : `<div class="flex gap-6">
           <a href="/sitemap.xml" class="hover:text-foreground">Sitemap</a>
         </div>`;

    this.innerHTML = `
      <div class="container mx-auto max-w-6xl">
        <div class="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>Hecho con ❤️ por <a href="https://github.com/rafnixg" target="_blank" rel="noopener noreferrer" class="hover:text-foreground font-medium">rafnixg</a>
            &mdash;
            <a href="https://github.com/rafnixg/rafnixg.github.io" target="_blank" rel="noopener noreferrer" class="hover:text-foreground">source code</a>
          </p>
          ${right}
        </div>
      </div>`;

    const yearEl = this.querySelector('.js-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }
}

customElements.define('site-footer', SiteFooter);
