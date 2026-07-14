const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await d.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await d.screenshot({ path: 'scraper/review/v4_desktop_hero.png' });
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await m.screenshot({ path: 'scraper/review/v4_movil_hero.png' });
  console.log('OK');
  await browser.close();
})();
