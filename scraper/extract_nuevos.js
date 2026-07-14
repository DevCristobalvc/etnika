const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const USER_DATA = path.join(__dirname, 'ig_session');
const OUT = path.join(__dirname, '..', 'content', 'nuevos');
fs.mkdirSync(OUT, { recursive: true });

// Productos ya importados — no repetir
const EXISTENTES = new Set([
  'DaoQL85Orem', 'DaoQE1dxxDw', 'DaoP45kRQG6', 'DaoPuYpxQMr', 'DaoPXMjxR8n',
  'DaoPS0mRVC7', 'DaljvA-PqSQ', 'DalgSEzvqUM', 'DagDQmfxqZu', 'DagCrkAxZNc',
]);

(async () => {
  const context = await chromium.launchPersistentContext(USER_DATA, {
    headless: false,
    viewport: { width: 1280, height: 900 },
  });
  const page = context.pages()[0] || (await context.newPage());

  await page.goto('https://www.instagram.com/etnika_modaydiseno/', { waitUntil: 'load', timeout: 40000 }).catch(() => {});
  await page.waitForTimeout(5000);

  const logueado = await page.$('a[href="/direct/inbox/"]').catch(() => null);
  if (!logueado) {
    console.log('STATUS:sesion_expirada');
    await page.screenshot({ path: path.join(OUT, '_sesion.png') });
    await context.close();
    process.exit(2);
  }
  console.log('STATUS:sesion_ok');

  // Recolectar todos los links de posts (solo /p/, los /reel/ se descartan)
  const links = new Set();
  let sinCambio = 0;
  for (let i = 0; i < 25 && sinCambio < 4; i++) {
    const antes = links.size;
    const encontrados = await page.$$eval('a[href*="/p/"]', els => els.map(e => e.href));
    encontrados.forEach(h => {
      const m = h.match(/\/p\/([^/]+)\//);
      if (m) links.add(m[1]);
    });
    sinCambio = links.size === antes ? sinCambio + 1 : 0;
    await page.evaluate(() => window.scrollBy(0, 1200));
    await page.waitForTimeout(1600);
  }

  const nuevos = [...links].filter(id => !EXISTENTES.has(id));
  console.log(`TOTAL_ENCONTRADOS:${links.size} NUEVOS:${nuevos.length}`);

  const resultados = [];
  for (let i = 0; i < nuevos.length; i++) {
    const id = nuevos[i];
    const url = `https://www.instagram.com/etnika_modaydiseno/p/${id}/`;
    console.log(`PROCESANDO:${i + 1}/${nuevos.length} ${id}`);
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(3000);

      const caption = await page.$eval('h1', el => el.innerText).catch(() => '');
      const destino = path.join(OUT, `${id}.png`);
      let guardada = false;
      for (const sel of ['main img[srcset]', 'main img', 'article img', 'img[srcset]']) {
        const el = await page.$(sel).catch(() => null);
        if (el) {
          try {
            await el.screenshot({ path: destino });
            guardada = true;
            break;
          } catch {}
        }
      }
      resultados.push({ id, url, caption: (caption || '').slice(0, 500), imagen: guardada });
      console.log(`OK:${id} img=${guardada}`);
    } catch (e) {
      console.log(`ERROR:${id} ${e.message}`);
    }
  }

  fs.writeFileSync(path.join(OUT, '_capturas.json'), JSON.stringify(resultados, null, 2), 'utf8');
  console.log(`LISTO:${resultados.length}`);
  await context.close();
})();
