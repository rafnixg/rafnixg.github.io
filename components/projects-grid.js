/**
 * <projects-grid> — Web Component
 *
 * Carga proyectos desde un JSON Resume (jsonresume.org) y renderiza
 * <project-card> por cada entrada en el array `projects`.
 *
 * Atributos:
 *   src  — URL del resume.json (default: https://resume.rafnixg.dev/resume.json)
 *
 * Eventos:
 *   projects-ready — disparado (bubbles) cuando las tarjetas están en el DOM.
 *                    Útil para aplicar filtros de forma diferida.
 */

function _escAttr(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _buildCard(p) {
  const kw = JSON.stringify(p.keywords || []);
  return `<project-card
    name="${_escAttr(p.name)}"
    description="${_escAttr(p.description)}"
    url="${_escAttr(p.url)}"
    keywords='${kw}'
    entity="${_escAttr(p.entity)}"
    show-image
  ></project-card>`;
}

class ProjectsGrid extends HTMLElement {
  connectedCallback() {
    this._load();
  }

  async _load() {
    const src = this.getAttribute('src') || '/data/resume.json';
    this.innerHTML =
      '<p class="col-span-full py-12 text-center text-muted-foreground">Cargando proyectos...</p>';

    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const projects = Array.isArray(data.projects) ? data.projects : [];

      if (!projects.length) {
        this.innerHTML =
          '<p class="col-span-full text-center text-muted-foreground">No se encontraron proyectos.</p>';
        return;
      }

      this.innerHTML = projects.map(_buildCard).join('\n');
      this.dispatchEvent(new CustomEvent('projects-ready', { bubbles: true }));
    } catch (err) {
      console.error('[projects-grid]', err);
      this.innerHTML =
        '<p class="col-span-full text-center text-muted-foreground">No se pudieron cargar los proyectos.</p>';
    }
  }
}

customElements.define('projects-grid', ProjectsGrid);
