const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto('http://localhost:3000/coleccion', { waitUntil: 'networkidle' });
  await m.screenshot({ path: 'scraper/review/v5_coleccion.png' });
  await m.goto('http://localhost:3000/coleccion?categoria=aretes', { waitUntil: 'networkidle' });
  await m.screenshot({ path: 'scraper/review/v5_aretes.png' });
  const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await d.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await d.evaluate(() => document.getElementById('coleccion').scrollIntoView());
  await d.waitForTimeout(800);
  await d.screenshot({ path: 'scraper/review/v5_home_grid.png' });
  console.log('OK');
  await browser.close();
})();
