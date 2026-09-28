const csrf = document.querySelector('meta[name="csrf-token"]').content;
const headers = { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf };
const request = async (url, options = {}) => {
  const response = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  if (response.status === 401) location.href = '/admin';
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || `HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
};

async function loadContent() {
  const content = await request('/api/admin/site-content');
  document.querySelector('#content').value = JSON.stringify(content, null, 2);
}
document.querySelector('#save-content').addEventListener('click', async () => {
  const status = document.querySelector('#content-status');
  try {
    const payload = JSON.parse(document.querySelector('#content').value);
    await request('/api/admin/site-content', { method: 'PUT', body: JSON.stringify(payload) });
    status.textContent = 'Guardado y publicado.';
  } catch (error) { status.textContent = error.message; }
});

async function loadResume() {
  const resume = await request('/api/admin/resume');
  document.querySelector('#resume').value = JSON.stringify(resume, null, 2);
}
document.querySelector('#save-resume').addEventListener('click', async () => {
  const status = document.querySelector('#resume-status');
  try {
    const payload = JSON.parse(document.querySelector('#resume').value);
    await request('/api/admin/resume', { method: 'PUT', body: JSON.stringify(payload) });
    status.textContent = 'Currículum guardado y publicado.';
  } catch (error) { status.textContent = error.message; }
});

function text(tag, value, className) {
  const node = document.createElement(tag);
  node.textContent = value ?? '';
  if (className) node.className = className;
  return node;
}
async function loadProjects() {
  const root = document.querySelector('#projects');
  const projects = await request('/api/admin/projects');
  root.replaceChildren();
  projects.forEach(project => {
    const row = document.createElement('div'); row.className = 'item';
    row.append(text('strong', `${project.name}${project.featured ? ' · Destacado' : ''}${project.visible ? '' : ' · Oculto'}`));
    row.append(text('small', project.url));
    const controls = document.createElement('div'); controls.className = 'item-controls';
    const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'secondary'; edit.textContent = 'Editar';
    edit.addEventListener('click', () => fillProject(project));
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'danger'; remove.textContent = 'Eliminar';
    remove.addEventListener('click', async () => { if (confirm(`¿Eliminar ${project.name}?`)) { await request(`/api/admin/projects/${project.id}`, { method: 'DELETE' }); await loadProjects(); } });
    controls.append(edit, remove); row.append(controls); root.append(row);
  });
}
function fillProject(project) {
  document.querySelector('#project-id').value = project.id;
  document.querySelector('#project-name').value = project.name;
  document.querySelector('#project-url').value = project.url;
  document.querySelector('#project-description').value = project.description;
  document.querySelector('#project-keywords').value = (project.keywords || []).join(', ');
  document.querySelector('#project-entity').value = project.entity;
  document.querySelector('#project-featured').checked = project.featured;
  document.querySelector('#project-visible').checked = project.visible;
  document.querySelector('#project-order').value = project.sort_order;
  document.querySelector('#project-form-title').textContent = `Editar: ${project.name}`;
}
function clearProject() {
  document.querySelector('#project-form').reset();
  document.querySelector('#project-id').value = '';
  document.querySelector('#project-visible').checked = true;
  document.querySelector('#project-form-title').textContent = 'Agregar proyecto';
}
document.querySelector('#project-cancel').addEventListener('click', clearProject);
document.querySelector('#project-form').addEventListener('submit', async event => {
  event.preventDefault();
  const status = document.querySelector('#project-status');
  const payload = {
    name: document.querySelector('#project-name').value,
    url: document.querySelector('#project-url').value,
    description: document.querySelector('#project-description').value,
    keywords: document.querySelector('#project-keywords').value.split(',').map(value => value.trim()).filter(Boolean),
    entity: document.querySelector('#project-entity').value,
    featured: document.querySelector('#project-featured').checked,
    visible: document.querySelector('#project-visible').checked,
    sort_order: Number(document.querySelector('#project-order').value || 0),
  };
  try {
    const id = document.querySelector('#project-id').value;
    await request(id ? `/api/admin/projects/${id}` : '/api/admin/projects', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
    status.textContent = 'Guardado.'; clearProject(); await loadProjects();
  } catch (error) { status.textContent = error.message; }
});

async function loadArticles() {
  const root = document.querySelector('#articles');
  const articles = await request('/api/admin/articles'); root.replaceChildren();
  articles.forEach(article => {
    const row = document.createElement('div'); row.className = 'item';
    row.append(text('strong', article.title)); row.append(text('small', article.url));
    const controls = document.createElement('div'); controls.className = 'item-controls';
    const visibleLabel = document.createElement('label'); const visible = document.createElement('input'); visible.type = 'checkbox'; visible.checked = article.visible;
    visibleLabel.append(visible, document.createTextNode('Visible'));
    const orderLabel = document.createElement('label'); orderLabel.textContent = 'Orden'; const order = document.createElement('input'); order.type = 'number'; order.value = article.sort_order; order.style.width = '6rem'; orderLabel.append(order);
    const save = document.createElement('button'); save.textContent = 'Guardar';
    save.addEventListener('click', async () => { await request(`/api/admin/articles/${encodeURIComponent(article.id)}`, { method: 'PUT', body: JSON.stringify({ visible: visible.checked, sort_order: Number(order.value || 0) }) }); save.textContent = 'Guardado'; });
    controls.append(visibleLabel, orderLabel, save); row.append(controls); root.append(row);
  });
}
Promise.all([loadContent(), loadResume(), loadProjects(), loadArticles()]).catch(error => { document.body.prepend(text('p', error.message, 'status')); });
