const fs = require('fs').promises;

function stripCdata(text) {
  return text.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function getTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = getTag(itemXml, 'title');
    const link = getTag(itemXml, 'link');
    const description = getTag(itemXml, 'description');
    const pubDate = getTag(itemXml, 'pubDate');
    const guid = getTag(itemXml, 'guid');

    if (!title || !link) continue;

    const brief = description
      ? decodeHtmlEntities(stripHtml(stripCdata(description)))
      : '';
    const slug = link.replace(/.*\/([^/]+)\/?$/, '$1');

    items.push({
      id: guid || link,
      title: decodeHtmlEntities(stripCdata(title)),
      brief,
      slug,
      dateAdded: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      views: null,
      readTime: null,
      url: link,
    });
  }

  return items.slice(0, 6);
}

async function fetchHashnodePosts() {
  const rssUrl = 'https://blog.rafnixg.dev/rss.xml';

  try {
    const res = await fetch(rssUrl);

    if (!res.ok) {
      const text = await res.text().catch(() => '<no body>');
      console.error('RSS returned non-OK status:', res.status, text);
      throw new Error('Network response not ok');
    }

    const xml = await res.text();
    const posts = parseRSS(xml);

    if (posts.length === 0) {
      console.warn('RSS feed parsed but no posts found');
      throw new Error('No posts found in RSS feed');
    }

    return posts;
  } catch (err) {
    console.warn('Failed to fetch Hashnode posts via RSS, writing sample data:', err.message);
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
