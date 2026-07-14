const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const USER_DATA = path.join(__dirname, 'ig_session');
const OUT = path.join(__dirname, '..', 'content', 'nuevos');

function limpiarCaption(texto) {
  return (texto || '')
    .split('\n')
    .filter((l) => {
      const t = l.trim();
      if (!t) return false;
      if (t === 'etnika_modaydiseno') return false;
      if (/^\d+\s*(sem|h|d|min|a)$/.test(t)) return false;
      if (/^(Ver traducción|Editado)$/.test(t)) return false;
      return true;
    })
    .join(' ')
    .trim();
}

(async () => {
  const context = await chromium.launchPersistentContext(USER_DATA, {
    headless: false,
    viewport: { width: 1100, height: 800 },
  });
  const page = context.pages()[0] || (await context.newPage());

  const capturas = JSON.parse(fs.readFileSync(path.join(OUT, '_capturas.json'), 'utf8'));

  for (let i = 0; i < capturas.length; i++) {
    const c = capturas[i];
    if (c.caption && c.caption.length > 10) continue;
    try {
      await page.goto(c.url, { waitUntil: 'load', timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(2500);
      const spans = await page.$$eval('span[dir="auto"]', (els) =>
        els.map((e) => e.innerText).filter((t) => t && t.length > 30)
      );
      const bruto = spans.find((s) => s.includes('etnika_modaydiseno')) || spans[0] || '';
      c.caption = limpiarCaption(bruto).slice(0, 500);
      console.log(`${i + 1}/${capturas.length} ${c.id}: [${c.caption.slice(0, 60)}]`);
    } catch (e) {
      console.log(`${i + 1}/${capturas.length} ${c.id}: ERROR`);
    }
    // Guardar progreso cada 20
    if (i % 20 === 19) {
      fs.writeFileSync(path.join(OUT, '_capturas.json'), JSON.stringify(capturas, null, 2), 'utf8');
    }
  }

  fs.writeFileSync(path.join(OUT, '_capturas.json'), JSON.stringify(capturas, null, 2), 'utf8');
  console.log('CAPTIONS_LISTOS');
  await context.close();
})();
