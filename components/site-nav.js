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
           <a href="#articles" class="text-sm text-muted-foreground hover:text-foreground">Articulos</a>
           <a href="#contact"  class="text-sm text-muted-foreground hover:text-foreground">Contacto</a>
           <a href="https://resume.rafnixg.dev" target="_blank" rel="noopener noreferrer" class="text-sm text-muted-foreground hover:text-foreground">CV</a>
           <a href="projects.html" class="text-sm font-semibold text-primary hover:text-primary/80">Todos los Proyectos →</a>
         </nav>
         <button class="sm:hidden rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground"
                 id="site-nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="site-nav-mobile">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5" aria-hidden="true">
             <line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>
           </svg>
         </button>`;

    this.innerHTML = `
      <div class="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        ${left}
        ${right}
      </div>
      <div id="site-nav-mobile" class="hidden border-t border-border bg-background/95 px-4 pb-4 sm:hidden">
        <nav class="flex flex-col gap-1 pt-2" aria-label="Menú móvil">
          <a href="#articles" class="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground">Articulos</a>
          <a href="#contact"  class="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground">Contacto</a>
          <a href="https://resume.rafnixg.dev" target="_blank" rel="noopener noreferrer" class="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground">CV</a>
          <a href="projects.html" class="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-card">Todos los Proyectos →</a>
        </nav>
      </div>`;

    const toggle = this.querySelector('#site-nav-toggle');
    const mobileMenu = this.querySelector('#site-nav-mobile');
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden', isOpen);
        toggle.setAttribute('aria-expanded', String(!isOpen));
      });
      // Cerrar al hacer click en un link del menú móvil
      mobileMenu.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          toggle.setAttribute('aria-expanded', 'false');
        })
      );
    }
  }
}

customElements.define('site-nav', SiteNav);
