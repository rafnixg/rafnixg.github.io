async function renderArticles() {
  const container = document.querySelector(".article-boxes");
  if (!container) return;

  try {
    const response = await fetch("/data/articles.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = await response.json();
    const posts = Array.isArray(payload.posts) ? payload.posts : [];

    if (posts.length === 0) {
      container.innerHTML = '<p class="text-center text-muted-foreground">No se pudieron cargar los articulos</p>';
      return;
    }

    container.innerHTML = posts.map(a => `
      <article-card
        title="${String(a.title ?? '').replace(/"/g, '&quot;')}"
        brief="${String(a.brief ?? '').replace(/"/g, '&quot;')}"
        url="${String(a.url ?? '').replace(/"/g, '&quot;')}"
        date="${a.dateAdded ?? ''}"
        views="${a.views ?? 0}"
        read-time="${String(a.readTime ?? 'Lectura breve').replace(/"/g, '&quot;')}"
      ></article-card>`).join('');
  } catch (error) {
    console.error("Error loading articles.json", error);
    container.innerHTML = '<p class="text-center text-muted-foreground">No se pudieron cargar los articulos</p>';
  }
}

renderArticles();

document.addEventListener("DOMContentLoaded", renderArticles);