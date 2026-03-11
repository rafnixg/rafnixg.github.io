/**
 * <social-links> — Web Component
 *
 * Lista de iconos de redes sociales.
 *
 * Atributos:
 *   variant — "icons" (default, círculos con SVG) | "pills" (botones solo texto)
 */

const LINKS = [
  {
    label: 'GitHub',
    url:   'https://github.com/rafnixg',
    svg: `<path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.93 10.93 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.41-2.68 5.38-5.24 5.67.41.35.78 1.04.78 2.1 0 1.52-.01 2.74-.01 3.11 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>`,
  },
  {
    label: 'LinkedIn',
    url:   'https://linkedin.com/in/rafnixg',
    svg: `<path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9h4v12H3Zm7 0h3.83v1.71h.05c.53-1 1.82-2.06 3.75-2.06 4 0 4.74 2.63 4.74 6.04V21h-4v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93V21h-4Z"/>`,
  },
  {
    label: 'Links',
    url:   'https://links.rafnixg.dev',
    svg: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
    strokeOnly: true,
  },
];

class SocialLinks extends HTMLElement {
  connectedCallback() {
    this._render();
  }

  _render() {
    const variant = this.getAttribute('variant') || 'icons';

    if (variant === 'pills') {
      this.className = 'flex flex-wrap justify-center gap-4';
      this.innerHTML = LINKS.map(l =>
        `<a href="${l.url}" target="_blank" rel="noopener noreferrer"
            class="rounded-lg bg-card px-4 py-2 text-sm font-medium hover:bg-primary/10">${l.label}</a>`
      ).join('');
    } else {
      this.className = 'flex justify-center gap-4';
      this.innerHTML = LINKS.filter(l => l.svg).map(l => {
        const svgAttrs = l.strokeOnly
          ? 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
          : 'fill="currentColor"';
        return `
          <a href="${l.url}" target="_blank" rel="noopener noreferrer"
             class="rounded-full bg-card p-3 hover:bg-primary/10" aria-label="${l.label}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ${svgAttrs} class="h-5 w-5">
              ${l.svg}
            </svg>
          </a>`;
      }).join('');
    }
  }
}

customElements.define('social-links', SocialLinks);
