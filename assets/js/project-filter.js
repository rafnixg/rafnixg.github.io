(() => {
  const list = document.querySelector('#projects-list');
  if (!list) return;
  const rows = [...list.querySelectorAll('[data-project-name]')];
  const search = document.querySelector('#project-search');
  const count = document.querySelector('#project-count');
  const empty = document.querySelector('#projects-no-results');
  let activeFilter = 'all';

  const update = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    rows.forEach((row) => {
      const matchesText = !query || row.dataset.projectName.includes(query);
      const matchesFilter = activeFilter === 'all' || row.dataset.projectEntity === activeFilter;
      const shown = matchesText && matchesFilter;
      row.hidden = !shown;
      if (shown) visible += 1;
    });
    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
  };

  document.querySelectorAll('[data-project-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.projectFilter || 'all';
      document.querySelectorAll('[data-project-filter]').forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      if (window.umami) window.umami.track('project_filter', { filter: activeFilter });
      update();
    });
  });
  search?.addEventListener('input', update);
  update();
})();
