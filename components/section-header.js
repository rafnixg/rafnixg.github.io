/**
 * <section-header> — Web Component
 *
 * Bloque de título + subtítulo centrado para encabezados de sección.
 *
 * Atributos:
 *   heading  — texto del título (h2)
 *   sub      — texto del subtítulo (párrafo)
 *   align    — "left" | "center" (default: "center")
 */
class SectionHeader extends HTMLElement {
  connectedCallback() {
    this.className = 'mb-16 space-y-4';
    this._render();
  }

  _esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  _render() {
    const heading = this._esc(this.getAttribute('heading') || '');
    const sub     = this._esc(this.getAttribute('sub')     || '');
    const align   = this.getAttribute('align') === 'left' ? 'text-left' : 'text-center';

    this.classList.add(align);

    this.innerHTML = `
      <h2 class="text-4xl font-bold md:text-5xl">${heading}</h2>
      ${sub ? `<p class="mx-auto max-w-2xl text-lg text-muted-foreground">${sub}</p>` : ''}`;
  }
}

customElements.define('section-header', SectionHeader);
