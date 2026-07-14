const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto('http://localhost:3000/admin', { waitUntil: 'load' });
  await m.fill('input[name="usuario"]', 'Erika');
  await m.fill('input[name="clave"]', 'erika123');
  await m.click('button[type="submit"]');
  await m.waitForURL('**/admin/pedidos', { timeout: 15000 });
  await m.goto('http://localhost:3000/admin/ajustes', { waitUntil: 'load' });
  await m.waitForTimeout(1500);
  await m.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await m.waitForTimeout(800);
  await m.screenshot({ path: 'scraper/review/vc_colores.png' });
  console.log('OK');
  await b.close();
})();
