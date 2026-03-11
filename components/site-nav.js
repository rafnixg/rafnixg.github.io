/**
 * <site-nav> — Web Component
 *
 * Barra de navegación compartida.
 *
 * Atributos:
 *   page  — nombre de la página activa mostrada en el lado derecho
 *           ("" o ausente → muestra los links de sección del home)
 *   back  — si está presente, añade un enlace "← Inicio" en lugar del menú
 */
class SiteNav extends HTMLElement {
  connectedCallback() {
    this.className = 'sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm';
    this._render();
  }

  _render() {
    const page = this.getAttribute('page') || '';
    const back = this.hasAttribute('back');

    const left = back
      ? `<a href="/" class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
             <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
           </svg>
           Inicio
         </a>`
      : `<a href="/" class="text-sm font-bold text-foreground tracking-tight">rafnixg.dev</a>`;

    const right = back
      ? page
        ? `<span class="text-sm font-semibold text-foreground">${page}</span>`
        : ''
      : `<nav class="hidden gap-6 sm:flex" aria-label="Navegación principal">
           <a href="#projects" class="text-sm text-muted-foreground hover:text-foreground">Proyectos</a>
           <a href="#articles" class="text-sm text-muted-foreground hover:text-foreground">Articulos</a>
           <a href="#contact"  class="text-sm text-muted-foreground hover:text-foreground">Contacto</a>
           <a href="projects.html" class="text-sm font-semibold text-primary hover:text-primary/80">Ver todos los proyectos →</a>
         </nav>`;

    this.innerHTML = `
      <div class="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        ${left}
        ${right}
      </div>`;
  }
}

customElements.define('site-nav', SiteNav);
