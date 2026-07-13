const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('console', (m) => console.log('CONSOLE:', m.text()));
  page.on('response', (r) => {
    if (r.status() >= 400) console.log('HTTP', r.status(), r.url());
  });

  await page.goto('http://localhost:3000/producto/DaoQL85Orem', { waitUntil: 'networkidle' });
  await page.click('text=Lo quiero');
  await page.click('text=Hacer pedido');
  await page.waitForTimeout(500);

  const campos = await page.locator('form input, form textarea').evaluateAll((els) =>
    els.map((e) => `${e.tagName}:${e.type ?? ''}:${e.placeholder ?? ''}`)
  );
  console.log('CAMPOS:', JSON.stringify(campos, null, 1));

  await page.fill('form input[type="text"] >> nth=0', 'Prueba Cliente');
  await page.fill('form input[type="tel"]', '300 111 2233');
  await page.fill('form input[placeholder*="Dirección"]', 'Cra 10 # 20-30, Cali');
  await page.click('button:has-text("Confirmar pedido")');
  await page.waitForTimeout(6000);

  const cuerpo = await page.locator('main').innerText();
  console.log('TEXTO TRAS SUBMIT:', cuerpo.slice(0, 800));
  await page.screenshot({ path: 'scraper/review/debug_submit.png' });
  await browser.close();
})();
