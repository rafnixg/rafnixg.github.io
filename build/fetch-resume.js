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
    const options = new URL(url);
    const zlib = require('zlib');
    const reqOptions = {
      hostname: options.hostname,
      path: options.pathname + options.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://resume.rafnixg.dev/',
          'Connection': 'keep-alive',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="8"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
    };
    const req = https.get(reqOptions, (res) => {
      // Handle redirects; build absolute URL if needed
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = new URL(res.headers.location, url).toString();
        return httpsGet(loc).then(resolve).catch(reject);
      }

      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', async () => {
        let body = Buffer.concat(chunks);
        const enc = (res.headers['content-encoding'] || '').toLowerCase();
        try {
          if (enc.includes('br')) {
            body = await new Promise((res2, rej2) => zlib.brotliDecompress(body, (err, out) => err ? rej2(err) : res2(out)));
          } else if (enc.includes('gzip')) {
            body = await new Promise((res2, rej2) => zlib.gunzip(body, (err, out) => err ? rej2(err) : res2(out)));
          } else if (enc.includes('deflate')) {
            body = await new Promise((res2, rej2) => zlib.inflate(body, (err, out) => err ? rej2(err) : res2(out)));
          }
        } catch (de) {
          console.warn('decompression failed:', de && de.message ? de.message : de);
        }

        const text = body.toString();

        if (res.statusCode !== 200) {
          const err = new Error(`HTTP ${res.statusCode}`);
          err.statusCode = res.statusCode;
          err.headers = res.headers;
          err.bodySnippet = text.slice(0, 2048);
          return reject(err);
        }

        resolve(text);
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy(new Error('timeout')));
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithRetries(url, attempts = 3, backoff = 1000) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await httpsGet(url);
    } catch (err) {
      lastErr = err;
      console.warn(`fetch attempt ${i+1}/${attempts} failed: ${err.message}`);
      if (err.headers) console.warn('response headers:', JSON.stringify(err.headers));
      if (err.bodySnippet) console.warn('response body snippet:', err.bodySnippet.slice(0, 1024));
      if (i < attempts - 1) {
        const delay = backoff * Math.pow(2, i);
        console.warn(`retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  throw lastErr;
}

async function main() {
  let raw;
  try {
    raw = await fetchWithRetries(RESUME_URL);
  } catch (err) {
    // If the remote is unavailable but we already have a local copy, keep it and exit cleanly.
    try {
      await fs.access(OUT);
      console.warn(`Warning: could not fetch resume (${err.message}). Keeping existing data/resume.json.`);
      return;
    } catch {
      throw err;
    }
  }

  const data = JSON.parse(raw);

  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    throw new Error('resume.json no contiene proyectos o tiene formato inesperado');
  }

  await fs.writeFile(OUT, JSON.stringify(data, null, 2));
  console.log(`Wrote data/resume.json con ${data.projects.length} proyectos`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
