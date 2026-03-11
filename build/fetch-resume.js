/**
 * build/fetch-resume.js
 * Descarga https://resume.rafnixg.dev/resume.json y lo guarda en data/resume.json.
 */

const fs   = require('fs').promises;
const https = require('https');
const path  = require('path');

const RESUME_URL = 'https://resume.rafnixg.dev/resume.json';
const OUT        = path.resolve(__dirname, '../data/resume.json');

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end',  () => resolve(Buffer.concat(chunks).toString()));
    }).on('error', reject);
  });
}

async function main() {
  const raw  = await httpsGet(RESUME_URL);
  const data = JSON.parse(raw);

  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    throw new Error('resume.json no contiene proyectos o tiene formato inesperado');
  }

  await fs.writeFile(OUT, JSON.stringify(data, null, 2));
  console.log(`Wrote data/resume.json con ${data.projects.length} proyectos`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
