const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const USER_DATA = path.join(__dirname, 'ig_session');
const OUT = path.join(__dirname, '..', 'content', 'nuevos');
const soloTest = process.argv.includes('--test');

(async () => {
  const context = await chromium.launchPersistentContext(USER_DATA, {
    headless: false,
    viewport: { width: 900, height: 700 },
  });

  const capturas = JSON.parse(fs.readFileSync(path.join(OUT, '_capturas.json'), 'utf8'));
  const lote = soloTest ? capturas.slice(0, 3) : capturas;

  for (let i = 0; i < lote.length; i++) {
    const c = lote[i];
    try {
      const resp = await context.request.get(c.url, { timeout: 15000 });
      const html = await resp.text();
      const m =
        html.match(/<meta property="og:title" content="([^"]*)"/) ||
        html.match(/<meta name="description" content="([^"]*)"/);
      if (m) {
        const raw = m[1]
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&amp;/g, '&');
        // og:title formato: 'Usuario on Instagram: "caption..."' o con comillas españolas
        const cap = raw.match(/(?:: ["“«])([\s\S]*?)["”»]?$/);
        c.caption = (cap ? cap[1] : raw).slice(0, 500);
      }
      console.log(`${i + 1}/${lote.length} ${c.id}: [${(c.caption || '').slice(0, 70)}]`);
    } catch (e) {
      console.log(`${i + 1}/${lote.length} ${c.id}: ERROR ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 700));
  }

  if (!soloTest) {
    fs.writeFileSync(path.join(OUT, '_capturas.json'), JSON.stringify(capturas, null, 2), 'utf8');
    console.log('GUARDADO');
  }
  await context.close();
})();
