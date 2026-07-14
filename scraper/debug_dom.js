const { chromium } = require('playwright');
const path = require('path');

const USER_DATA = path.join(__dirname, 'ig_session');

(async () => {
  const context = await chromium.launchPersistentContext(USER_DATA, {
    headless: false,
    viewport: { width: 1100, height: 800 },
  });
  const page = context.pages()[0] || (await context.newPage());
  await page.goto('https://www.instagram.com/etnika_modaydiseno/p/DaeFNI7unRc/', {
    waitUntil: 'load',
    timeout: 30000,
  }).catch(() => {});
  await page.waitForTimeout(5000);

  console.log('TITLE:', await page.title());

  const h1 = await page.$$eval('h1', els => els.map(e => e.innerText.slice(0, 100)));
  console.log('H1:', JSON.stringify(h1));

  const spans = await page.$$eval('span[dir="auto"]', els =>
    els.map(e => e.innerText).filter(t => t && t.length > 30).slice(0, 5)
  );
  console.log('SPANS:', JSON.stringify(spans.map(s => s.slice(0, 120))));

  await page.screenshot({ path: path.join(__dirname, 'debug_dom.png') });
  await context.close();
})();
