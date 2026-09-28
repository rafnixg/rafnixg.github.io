/* Form-driven, single-owner CMS. No raw JSON editor is exposed to the UI. */
const csrf = document.querySelector('meta[name="csrf-token"]').content;
const $ = selector => document.querySelector(selector);
const api = async (url, options = {}) => {
  const headers = { 'X-CSRF-Token': csrf, ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) { location.href = '/admin'; throw new Error('Sesión caducada'); }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body.detail === 'string' ? body.detail : `HTTP ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
};
const node = (tag, text = '', className = '') => { const n = document.createElement(tag); n.textContent = text; if (className) n.className = className; return n; };
const btn = (label, click, cls = 'secondary small') => { const b = node('button', label, cls); b.type = 'button'; b.addEventListener('click', click); return b; };
const status = (id, message, error = false) => { const n = $(id); n.textContent = message; n.classList.toggle('error', error); };
const labels = {
  basics:'Datos personales', meta:'Metadatos del CV', location:'Ubicación', profiles:'Perfiles', work:'Experiencia', volunteer:'Voluntariado', education:'Educación', awards:'Premios', certificates:'Certificaciones', publications:'Publicaciones', skills:'Habilidades', languages:'Idiomas', interests:'Intereses', references:'Referencias', projects:'Proyectos del CV',
  name:'Nombre', label:'Profesión o etiqueta', image:'Imagen', email:'Correo', url:'URL', summary:'Resumen', countryCode:'Código de país', address:'Dirección', network:'Red', username:'Usuario', position:'Cargo', startDate:'Fecha de inicio', endDate:'Fecha de fin', highlights:'Logros', institution:'Institución', area:'Área', studyType:'Grado', courses:'Cursos', awarder:'Otorgado por', date:'Fecha', title:'Título', issuer:'Emisor', publisher:'Editorial', level:'Nivel', keywords:'Palabras clave', language:'Idioma', fluency:'Dominio', reference:'Referencia', roles:'Roles', type:'Tipo', entity:'Categoría', description:'Descripción', canonical:'URL canónica', version:'Versión', theme:'Tema', organization:'Organización', score:'Calificación', location:'Ubicación',
  hero_title_prefix:'Título inicial', hero_title_suffix:'Título final', hero_description:'Presentación', hero_contact_label:'Botón de contacto', hero_projects_label:'Botón de proyectos', cv_url:'Enlace al CV', cv_label:'Etiqueta del CV', nav_articles_label:'Menú de artículos', nav_contact_label:'Menú de contacto', nav_projects_label:'Menú de proyectos', specialties_label:'Etiqueta de especialidades', specialties:'Especialidades', projects_title:'Título de proyectos', projects_description:'Descripción de proyectos', projects_page_title:'Título de página de proyectos', projects_page_description:'Descripción de página de proyectos', projects_more_label:'Ver más proyectos', articles_title:'Título de artículos', articles_description:'Descripción de artículos', articles_all_label:'Ver todos los artículos', articles_url:'Enlace del blog', contact_title:'Título de contacto', contact_description:'Descripción de contacto', contact_links_label:'Etiqueta de redes', footer_made_label:'Créditos', footer_source_label:'Código fuente', footer_sitemap_label:'Mapa del sitio', footer_back_label:'Volver al inicio', social_links:'Redes sociales', project_filters:'Filtros de proyectos', all:'Todos', personal:'Personales', oss:'Open Source', learning:'Aprendizaje', meta_title:'Título SEO · Inicio', meta_description:'Descripción SEO · Inicio', projects_meta_title:'Título SEO · Proyectos', projects_meta_description:'Descripción SEO · Proyectos', home_og_image:'Imagen social · Inicio', projects_og_image:'Imagen social · Proyectos'
};
const label = key => labels[key] || key.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
const getAt = (root, path) => path.reduce((value, part) => value[part], root);
const setAt = (root, path, value) => { const parent = getAt(root, path.slice(0, -1)); parent[path.at(-1)] = value; };
const blank = value => Array.isArray(value) ? [] : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, v]) => [key, blank(v)])) : typeof value === 'boolean' ? false : typeof value === 'number' ? 0 : '';
const resumeSamples = {
  profiles:{ network:'', username:'', url:'' }, work:{ name:'', position:'', url:'', startDate:'', endDate:'', location:'', summary:'', highlights:[] }, volunteer:{ organization:'', position:'', url:'', startDate:'', endDate:'', summary:'', highlights:[] }, education:{ institution:'', area:'', studyType:'', startDate:'', endDate:'', score:'', courses:[] }, awards:{ title:'', date:'', awarder:'', summary:'' }, certificates:{ name:'', date:'', issuer:'', url:'' }, publications:{ name:'', publisher:'', releaseDate:'', url:'', summary:'' }, skills:{ name:'', level:'', keywords:[] }, languages:{ language:'', fluency:'' }, interests:{ name:'', keywords:[] }, references:{ name:'', reference:'' }, projects:{ name:'', description:'', url:'', startDate:'', endDate:'', entity:'', type:'', roles:[], highlights:[], keywords:[] }
};
const sampleFor = (path, current) => {
  const key = path.at(-1);
  if (resumeSamples[key]) return structuredClone(resumeSamples[key]);
  if (current.length) return blank(current[0]);
  if (key === 'social_links') return { label:'', url:'' };
  return '';
};
let expandedEntry = '';
function renderField(parent, root, path, redraw) {
  const key = path.at(-1), value = getAt(root, path);
  const wrapper = node('div', '', 'field'); parent.append(wrapper);
  if (Array.isArray(value)) {
    const head = node('div', '', 'item-head'); head.append(node('label', label(key)), btn('Añadir', () => { expandedEntry = [...path, value.length].join('.'); value.push(sampleFor(path, value)); redraw(); expandedEntry = ''; })); wrapper.append(head);
    value.forEach((entry, index) => {
      const card = node('details', '', 'item collapsible'); card.open = expandedEntry === [...path, index].join('.');
      const preview = entry && typeof entry === 'object' ? (entry.name || entry.title || entry.institution || entry.organization || entry.network || entry.language || entry.position || '') : String(entry || '');
      card.append(node('summary', preview ? `${index + 1}. ${preview.slice(0, 90)}` : `${label(key)} ${index + 1}`));
      const controls = node('div', '', 'item-actions');
      if (index) controls.append(btn('↑', () => { [value[index - 1], value[index]] = [value[index], value[index - 1]]; redraw(); }));
      if (index < value.length - 1) controls.append(btn('↓', () => { [value[index + 1], value[index]] = [value[index], value[index + 1]]; redraw(); }));
      controls.append(btn('Quitar', () => { if (confirm('¿Quitar esta entrada?')) { value.splice(index, 1); redraw(); } }, 'danger small')); card.append(controls);
      if (entry && typeof entry === 'object' && !Array.isArray(entry)) Object.keys(entry).forEach(child => renderField(card, root, [...path, index, child], redraw));
      else renderScalar(card, root, [...path, index], `${label(key)} ${index + 1}`);
      wrapper.append(card);
    });
  } else if (value && typeof value === 'object') {
    const box = node('div', '', 'nested'); box.append(node('h3', label(key))); Object.keys(value).forEach(child => renderField(box, root, [...path, child], redraw)); wrapper.append(box);
  } else renderScalar(wrapper, root, path, label(key));
}
function renderScalar(parent, root, path, caption) {
  const value = getAt(root, path), key = String(path.at(-1));
  const id = `f-${path.join('-').replace(/[^a-z0-9-]/gi, '')}`;
  const labelNode = node('label', caption); labelNode.htmlFor = id; parent.append(labelNode);
  let control;
  if (typeof value === 'boolean') { control = document.createElement('input'); control.type = 'checkbox'; control.checked = value; control.addEventListener('change', () => setAt(root, path, control.checked)); }
  else if (typeof value === 'number') { control = document.createElement('input'); control.type = 'number'; control.value = value; control.addEventListener('input', () => setAt(root, path, Number(control.value || 0))); }
  else { control = /summary|description|reference|brief/.test(key) ? document.createElement('textarea') : document.createElement('input'); if (control.tagName === 'INPUT') control.type = key === 'email' ? 'email' : 'text'; control.value = value ?? ''; control.addEventListener('input', () => setAt(root, path, control.value)); }
  control.id = id; parent.append(control);
}
let site = {}, resume = {}, projects = [], articles = [], pages = [], media = [];
const siteGroups = [
  ['Presentación', ['hero_title_prefix','hero_title_suffix','hero_description','hero_contact_label','hero_projects_label','specialties_label','specialties']],
  ['Navegación y enlaces', ['cv_url','cv_label','nav_articles_label','nav_contact_label','nav_projects_label','articles_url']],
  ['Proyectos y artículos', ['projects_title','projects_description','projects_page_title','projects_page_description','projects_more_label','articles_title','articles_description','articles_all_label','project_filters']],
  ['Contacto y pie', ['contact_title','contact_description','contact_links_label','social_links','footer_made_label','footer_source_label','footer_sitemap_label','footer_back_label']]
];
const seoKeys = ['meta_title','meta_description','projects_meta_title','projects_meta_description','home_og_image','projects_og_image'];
let siteTab = 0, resumeTab = 0;
const resumeGroups = [
  ['Perfil', ['basics']],
  ['Trayectoria', ['work','volunteer','education']],
  ['Reconocimientos', ['awards','certificates','publications']],
  ['Capacidades', ['skills','languages','interests','references']],
  ['Proyectos', ['projects']],
  ['Metadatos', ['meta']]
];
function renderTabs(id, groups, active, select) {
  const root = $(id); root.replaceChildren();
  groups.forEach(([name], index) => {
    const tab = btn(name, () => select(index), 'inner-tab');
    tab.setAttribute('role', 'tab'); tab.setAttribute('aria-selected', String(index === active));
    tab.tabIndex = index === active ? 0 : -1;
    root.append(tab);
  });
}
function drawSite() {
  const root = $('#site-fields'); root.replaceChildren();
  renderTabs('#site-tabs', siteGroups, siteTab, index => { siteTab = index; drawSite(); });
  const [title, keys] = siteGroups[siteTab];
  const sitePanel = node('div', '', 'panel'); sitePanel.append(node('h2', title)); keys.filter(key => key in site).forEach(key => renderField(sitePanel, site, [key], drawSite)); root.append(sitePanel);
  const seoRoot = $('#seo-fields'); seoRoot.replaceChildren(); const panel = node('div', '', 'panel'); panel.append(node('h2', 'Metadatos de páginas principales')); seoKeys.forEach(key => renderField(panel, site, [key], drawSite)); seoRoot.append(panel);
}
function drawResume() {
  const root = $('#resume-fields'); root.replaceChildren();
  renderTabs('#resume-tabs', resumeGroups, resumeTab, index => { resumeTab = index; drawResume(); });
  resumeGroups[resumeTab][1].forEach(section => {
    if (section !== 'basics' && section !== 'meta' && !(section in resume)) resume[section] = [];
    const panel = node('div', '', 'panel'); panel.append(node('h2', label(section)));
    if (section === 'basics' || section === 'meta') Object.keys(resume[section] || {}).forEach(key => renderField(panel, resume, [section, key], drawResume));
    else renderField(panel, resume, [section], drawResume);
    root.append(panel);
  });
}
async function loadSite() { site = await api('/api/admin/site-content'); for (const key of ['home_og_image','projects_og_image']) site[key] ??= ''; drawSite(); }
async function loadResume() { resume = await api('/api/admin/resume'); drawResume(); }
async function saveDocument(path, value, id) { try { await api(path, { method:'PUT', body:JSON.stringify(value) }); status(id, 'Guardado y publicado.'); } catch (error) { status(id, error.message, true); } }
$('#save-site').addEventListener('click', () => saveDocument('/api/admin/site-content', site, '#site-status'));
$('#save-seo').addEventListener('click', () => saveDocument('/api/admin/site-content', site, '#seo-status'));
$('#save-resume').addEventListener('click', () => saveDocument('/api/admin/resume', resume, '#resume-status'));
document.querySelectorAll('.nav-btn').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.nav-btn,.section').forEach(element => element.classList.remove('active')); button.classList.add('active'); $(`#${button.dataset.target}`).classList.add('active'); history.replaceState(null, '', `#${button.dataset.target}`); }));
function drawProjects() {
  const root = $('#project-list'); root.replaceChildren(); const q = $('#project-search').value.toLowerCase();
  projects.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(q)).forEach(p => { const row = node('div', '', 'item'); row.append(node('strong', p.name), node('small', `${p.visible ? 'Visible' : 'Oculto'} · orden ${p.sort_order} · ${p.url}`, 'muted')); const actions = node('div', '', 'actions'); actions.append(btn('Editar', () => editProject(p)), btn('Eliminar', async () => { if (!confirm(`¿Eliminar ${p.name}?`)) return; await api(`/api/admin/projects/${p.id}`, { method:'DELETE' }); await loadProjects(); }, 'danger small')); row.append(actions); root.append(row); });
}
async function loadProjects() { projects = await api('/api/admin/projects'); drawProjects(); drawCounts(); }
$('#project-search').addEventListener('input', drawProjects);
function editProject(p) { $('#project-id').value=p.id; $('#project-name').value=p.name; $('#project-url').value=p.url; $('#project-description').value=p.description; $('#project-keywords').value=p.keywords.join(', '); $('#project-entity').value=p.entity; $('#project-order').value=p.sort_order; $('#project-featured').checked=p.featured; $('#project-visible').checked=p.visible; $('#project-heading').textContent=`Editar ${p.name}`; $('#project-form').scrollIntoView({behavior:'smooth'}); }
function clearProject() { $('#project-form').reset(); $('#project-id').value=''; $('#project-visible').checked=true; $('#project-heading').textContent='Nuevo proyecto'; }
$('#project-clear').addEventListener('click', clearProject);
$('#project-form').addEventListener('submit', async event => { event.preventDefault(); const id=$('#project-id').value; const payload={ name:$('#project-name').value, url:$('#project-url').value, description:$('#project-description').value, keywords:$('#project-keywords').value.split(',').map(x=>x.trim()).filter(Boolean), entity:$('#project-entity').value, sort_order:Number($('#project-order').value||0), featured:$('#project-featured').checked, visible:$('#project-visible').checked }; try { await api(id?`/api/admin/projects/${id}`:'/api/admin/projects',{method:id?'PUT':'POST',body:JSON.stringify(payload)}); status('#project-status','Proyecto guardado.'); clearProject(); await loadProjects(); } catch(error){ status('#project-status',error.message,true); } });
function drawArticles() { const root=$('#article-list'); root.replaceChildren(); const q=$('#article-search').value.toLowerCase(); articles.filter(a=>a.title.toLowerCase().includes(q)).forEach(a=>{const row=node('div','','item');row.append(node('strong',a.title),node('small',a.url,'muted'));const controls=node('div','','actions');const visible=document.createElement('input');visible.type='checkbox';visible.checked=a.visible;const lbl=node('label','Visible');lbl.prepend(visible);const order=document.createElement('input');order.type='number';order.min='0';order.value=a.sort_order;order.style.width='90px';controls.append(lbl,order,btn('Guardar',async()=>{try{await api(`/api/admin/articles/${encodeURIComponent(a.id)}`,{method:'PUT',body:JSON.stringify({visible:visible.checked,sort_order:Number(order.value||0)})});status('#article-status','Artículo actualizado.');}catch(error){status('#article-status',error.message,true);}}));row.append(controls);root.append(row);}); if (!$('#article-status')) { const message=node('p','','status'); message.id='article-status'; root.append(message); } }
async function loadArticles(){articles=await api('/api/admin/articles');drawArticles();drawCounts();} $('#article-search').addEventListener('input',drawArticles);
let quill;
function drawPages(){const root=$('#page-list');root.replaceChildren();pages.forEach(p=>{const row=node('div','','item');row.append(node('strong',p.title),node('small',`/${p.slug} · ${p.visible?'Visible':'Oculta'}`,'muted'));const actions=node('div','','actions');actions.append(btn('Editar',()=>editPage(p)),btn('Ver',()=>window.open(`/${p.slug}`,'_blank')),btn('Eliminar',async()=>{if(!confirm(`¿Eliminar la página ${p.title}?`))return;await api(`/api/admin/pages/${p.id}`,{method:'DELETE'});await loadPages();},'danger small'));row.append(actions);root.append(row);});}
async function loadPages(){pages=await api('/api/admin/pages');drawPages();drawCounts();}
function editPage(p){$('#page-id').value=p.id;$('#page-title').value=p.title;$('#page-slug').value=p.slug;$('#page-meta-title').value=p.meta_title;$('#page-meta-description').value=p.meta_description;$('#page-og-image').value=p.og_image;$('#page-visible').checked=p.visible;quill.root.innerHTML=p.body_html;$('#page-heading').textContent=`Editar ${p.title}`;$('#page-form').scrollIntoView({behavior:'smooth'});}
function clearPage(){$('#page-form').reset();$('#page-id').value='';$('#page-visible').checked=true;$('#page-heading').textContent='Nueva página';quill.setText('');}
$('#page-clear').addEventListener('click',clearPage);
$('#page-title').addEventListener('input',()=>{if(!$('#page-id').value)$('#page-slug').value=$('#page-title').value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');});
$('#page-form').addEventListener('submit',async event=>{event.preventDefault();const id=$('#page-id').value;const payload={slug:$('#page-slug').value,title:$('#page-title').value,body_html:quill.getSemanticHTML(),meta_title:$('#page-meta-title').value,meta_description:$('#page-meta-description').value,og_image:$('#page-og-image').value,visible:$('#page-visible').checked};try{await api(id?`/api/admin/pages/${id}`:'/api/admin/pages',{method:id?'PUT':'POST',body:JSON.stringify(payload)});status('#page-status','Página guardada y publicada.');clearPage();await loadPages();}catch(error){status('#page-status',error.message,true);}});
function drawMedia(){const root=$('#media-list');root.replaceChildren();media.forEach(m=>{const url=`/media/${m.filename}`;const card=node('div','','media-card');if(m.mime_type.startsWith('image/')){const img=document.createElement('img');img.src=url;img.alt=m.original_name;card.append(img);}card.append(node('strong',m.original_name),node('small',`${Math.ceil(m.size/1024)} KB`,'muted'));const actions=node('div','','actions');actions.append(btn('Copiar URL',async()=>{await navigator.clipboard.writeText(`${location.origin}${url}`);status('#media-status','URL copiada.');}),btn('Eliminar',async()=>{if(!confirm(`¿Eliminar ${m.original_name}? Las referencias existentes dejarán de funcionar.`))return;await api(`/api/admin/media/${m.id}`,{method:'DELETE'});await loadMedia();},'danger small'));card.append(actions);root.append(card);});}
async function loadMedia(){media=await api('/api/admin/media');drawMedia();drawCounts();}
$('#media-form').addEventListener('submit',async event=>{event.preventDefault();const form=new FormData();form.append('file',$('#media-file').files[0]);try{await api('/api/admin/media',{method:'POST',body:form});status('#media-status','Archivo subido.');$('#media-form').reset();await loadMedia();}catch(error){status('#media-status',error.message,true);}});
function drawCounts(){ $('#dashboard-counts').textContent=`${projects.length} proyectos · ${articles.length} artículos · ${pages.length} páginas · ${media.length} archivos`; }
async function start(){
  quill=new Quill('#page-editor',{theme:'snow',formats:['header','bold','italic','underline','strike','blockquote','list','link','image'],modules:{toolbar:[[{header:[2,3,false]}],['bold','italic','underline','strike'],[{list:'ordered'},{list:'bullet'}],['blockquote','link','image']]}});
  quill.getModule('toolbar').addHandler('image',()=>{const value=prompt('URL HTTPS o /media/ de la imagen');if(!value || !(value.startsWith('https://')||value.startsWith('/media/')))return;const range=quill.getSelection(true);quill.insertEmbed(range.index,'image',value);});
  const results=await Promise.allSettled([loadSite(),loadResume(),loadProjects(),loadArticles(),loadPages(),loadMedia()]);
  results.filter(r=>r.status==='rejected').forEach(r=>{const alert=node('p',r.reason.message,'status error');$('.main').prepend(alert);});
  const section=location.hash.slice(1);if(section && document.querySelector(`.nav-btn[data-target="${section}"]`)) document.querySelector(`.nav-btn[data-target="${section}"]`).click();
}
start();
