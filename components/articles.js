function formatArticleDate(value) {
  if (!value) return "Sin fecha";

  try {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch (_error) {
    return value;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function articleTemplate(article) {
  const views = Number.isFinite(article.views) ? article.views : 0;
  const readTime = article.readTime || "Lectura breve";

  return `
    <a class="article-link" href="${article.url}" target="_blank" rel="noopener noreferrer">
      <article class="article-card">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 space-y-2">
            <h3 class="article-title text-2xl font-bold">${escapeHtml(article.title)}</h3>
            <p class="text-base text-muted-foreground">${escapeHtml(article.brief || "")}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="article-arrow h-5 w-5">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </div>

        <div class="article-meta mt-4">
          <span class="article-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
            </svg>
            ${formatArticleDate(article.dateAdded)}
          </span>
          <span class="article-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            ${views} vistas
          </span>
          <span>${escapeHtml(readTime)} lectura</span>
        </div>
      </article>
    </a>
  `;
}

async function renderArticles() {
  const container = document.querySelector(".article-boxes");
  if (!container) return;

  try {
    const response = await fetch("/data/articles.json", { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const posts = Array.isArray(payload.posts) ? payload.posts : [];

    if (posts.length === 0) {
      container.innerHTML = '<p class="text-center text-muted-foreground">No se pudieron cargar los articulos</p>';
      return;
    }

    container.innerHTML = posts.map(articleTemplate).join("");
  } catch (error) {
    console.error("Error loading articles.json", error);
    container.innerHTML = '<p class="text-center text-muted-foreground">No se pudieron cargar los articulos</p>';
  }
}

document.addEventListener("DOMContentLoaded", renderArticles);