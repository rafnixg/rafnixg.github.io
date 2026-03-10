async function renderArticles() {
  const container = document.querySelector('.article-boxes');
  if (!container) return;

  try {
    const res = await fetch('/data/articles.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('no data');
    const json = await res.json();
    const posts = json.posts || [];

    container.innerHTML = posts.slice(0,4).map(post => `
      <article class="article-box">
        <div class="article-textbox">
          <div>
            <h3 class="h4">${escapeHtml(post.title)}</h3>
            <p class="article-text">${escapeHtml(post.brief || '')}</p>
          </div>
          <div class="article-info">
            <a href="${post.url}" class="link" target="_blank" rel="noopener">Continue reading</a>
          </div>
        </div>
      </article>
    `).join('');
  } catch (err) {
    console.warn('Could not load articles.json', err);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  renderArticles();
});
