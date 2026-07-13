const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await desktop.screenshot({ path: 'scraper/review/v2_desktop_hero.png' });
  await desktop.evaluate(() => window.scrollBy(0, 700));
  await desktop.waitForTimeout(600);
  await desktop.screenshot({ path: 'scraper/review/v2_desktop_portada.png' });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: 'scraper/review/v2_movil_hero.png' });

  // Pedido manual en admin
  await mobile.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await mobile.fill('input[name="usuario"]', 'Erika');
  await mobile.fill('input[name="clave"]', 'erika123');
  await mobile.click('button[type="submit"]');
  await mobile.waitForURL('**/admin/pedidos', { timeout: 15000 });
  await mobile.goto('http://localhost:3000/admin/pedidos/nuevo', { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: 'scraper/review/v2_movil_pedido_manual.png' });

  // Crear un pedido manual de prueba
  await mobile.selectOption('select >> nth=0', { index: 1 });
  await mobile.fill('input[type="text"] >> nth=0', 'Venta Presencial Test');
  await mobile.fill('input[type="tel"]', '314 880 1409');
  await mobile.selectOption('select >> nth=1', 'entregado');
  await mobile.click('button:has-text("Registrar pedido")');
  await mobile.waitForURL('**/admin/pedidos', { timeout: 15000 });
  await mobile.waitForTimeout(1000);
  await mobile.screenshot({ path: 'scraper/review/v2_movil_pedidos_lista.png' });
  console.log('OK');

  await browser.close();
})();
