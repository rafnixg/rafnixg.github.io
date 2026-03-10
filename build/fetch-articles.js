const fs = require('fs').promises;

async function fetchHashnodePosts() {
  const endpoint = 'https://api.hashnode.com';
  const query = `
  query GetUserArticles($username: String!) {
    user(username: $username) {
      publication {
        posts(page: 0) {
          title
          brief
          slug
          coverImage
          dateAdded
        }
      }
    }
  }
  `;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username: 'rafnixg' } }),
    });
    if (!res.ok) throw new Error('Network response not ok');
    const json = await res.json();
    const posts = json.data?.user?.publication?.posts || [];
    return posts.map((p) => ({
      title: p.title,
      brief: p.brief,
      slug: p.slug,
      coverImage: p.coverImage,
      dateAdded: p.dateAdded,
      url: `https://blog.rafnixg.dev/${p.slug}`,
    }));
  } catch (err) {
    console.warn('Failed to fetch Hashnode posts, writing sample data:', err.message);
    return [
      {
        title: 'Sample article — migration PoC',
        brief: 'This is a placeholder article generated during the migration.',
        slug: 'sample-article-migration-poc',
        coverImage: 'https://via.placeholder.com/800x420.png?text=Sample',
        dateAdded: new Date().toISOString(),
        url: 'https://blog.rafnixg.dev',
      },
    ];
  }
}

async function writeArticlesJSON() {
  const posts = await fetchHashnodePosts();
  const out = { generatedAt: new Date().toISOString(), posts };
  await fs.mkdir('data', { recursive: true });
  await fs.writeFile('data/articles.json', JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote data/articles.json with', posts.length, 'posts');
}

if (require.main === module) {
  writeArticlesJSON().catch((e) => { console.error(e); process.exit(1); });
}
