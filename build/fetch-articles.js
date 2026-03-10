const fs = require('fs').promises;

async function fetchHashnodePosts() {
  const endpoint = 'https://gql.hashnode.com';
  const query = `
    query {
      user(username: "rafnixg") {
        publications(first: 1) {
          edges {
            node {
              posts(first: 6) {
                edges {
                      node {
                        id
                        title
                        brief
                        slug
                        publishedAt
                        views
                        readTimeInMinutes
                      }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '<no body>');
      console.error('Hashnode returned non-OK status:', res.status, text);
      throw new Error('Network response not ok');
    }

    const json = await res.json();
    if (json.errors) {
      console.error('Hashnode GraphQL returned errors:', JSON.stringify(json.errors, null, 2));
    }

    const edges = json.data?.user?.publications?.edges || [];
    const posts =
      edges[0]?.node?.posts?.edges?.map((edge) => ({
        id: edge.node.id,
        title: edge.node.title,
        brief: edge.node.brief,
        slug: edge.node.slug,
        dateAdded: edge.node.publishedAt,
        views: edge.node.views || null,
        readTime: edge.node.readTimeInMinutes ? `${edge.node.readTimeInMinutes} min` : null,
        url: `https://blog.rafnixg.dev/${edge.node.slug}`,
      })) || [];

    return posts;
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
