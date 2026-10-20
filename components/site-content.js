(() => {
  const apiBase = window.CMS_API_BASE_URL || 'https://api.rafnixg.dev/api';
  const valueAt = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);
  const safeUrl = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch { return null; }
  };

  async function loadSiteContent() {
    try {
      const response = await fetch(`${apiBase}/site-content`, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const content = await response.json();
      document.querySelectorAll('[data-content-key]').forEach(element => {
        const value = valueAt(content, element.dataset.contentKey);
        if (typeof value !== 'string') return;
        if (element.matches('section-header')) {
          const heading = element.querySelector('h2');
          if (heading) heading.textContent = value;
        } else {
          element.textContent = value;
        }
      });
      document.querySelectorAll('[data-content-sub-key]').forEach(element => {
        const value = valueAt(content, element.dataset.contentSubKey);
        const paragraph = element.querySelector('p');
        if (paragraph && typeof value === 'string') paragraph.textContent = value;
      });
      document.querySelectorAll('[data-content-href]').forEach(element => {
        const url = safeUrl(valueAt(content, element.dataset.contentHref));
        if (url) element.href = url;
      });
      if (Array.isArray(content.specialties)) {
        const list = document.querySelector('#specialties-list');
        if (list) {
          list.replaceChildren(...content.specialties.map(value => {
            const chip = document.createElement('span');
            chip.className = 'rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary';
            chip.textContent = value;
            return chip;
          }));
        }
      }
      document.querySelectorAll('social-links').forEach(element => {
        if (Array.isArray(content.social_links)) element.setLinks(content.social_links);
      });
      const homePage = document.body.dataset.page !== 'projects';
      const titleKey = homePage ? 'meta_title' : 'projects_meta_title';
      const descriptionKey = homePage ? 'meta_description' : 'projects_meta_description';
      const title = typeof content[titleKey] === 'string' ? content[titleKey] : '';
      const description = typeof content[descriptionKey] === 'string' ? content[descriptionKey] : '';
      if (title) {
        document.title = title;
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
        document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
      }
      if (description) {
        document.querySelector('meta[name="description"]')?.setAttribute('content', description);
        document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
        document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
      }
    } catch (error) {
      console.error('[site-content]', error);
    }
  }
  document.addEventListener('DOMContentLoaded', loadSiteContent, { once: true });
})();
