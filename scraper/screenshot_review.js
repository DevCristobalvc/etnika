const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  // Desktop
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await desktop.screenshot({ path: 'scraper/review/desktop_hero.png' });
  await desktop.evaluate(() => document.getElementById('coleccion').scrollIntoView());
  await desktop.waitForTimeout(800);
  await desktop.screenshot({ path: 'scraper/review/desktop_coleccion.png' });
  await desktop.evaluate(() => document.getElementById('nosotras').scrollIntoView());
  await desktop.waitForTimeout(800);
  await desktop.screenshot({ path: 'scraper/review/desktop_nosotras.png' });
  await desktop.goto('http://localhost:3000/producto/DaoQL85Orem', { waitUntil: 'networkidle' });
  await desktop.screenshot({ path: 'scraper/review/desktop_producto.png' });

  // Mobile (iPhone-ish)
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: 'scraper/review/movil_hero.png' });
  await mobile.goto('http://localhost:3000/producto/DaoQL85Orem', { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: 'scraper/review/movil_producto.png' });
  // Desplegar menú "Lo quiero"
  await mobile.click('text=Lo quiero');
  await mobile.waitForTimeout(500);
  await mobile.screenshot({ path: 'scraper/review/movil_loquiero.png' });

  // Admin móvil
  await mobile.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: 'scraper/review/movil_admin_login.png' });
  await mobile.fill('input[name="usuario"]', 'Erika');
  await mobile.fill('input[name="clave"]', 'erika123');
  await mobile.click('button[type="submit"]');
  await mobile.waitForURL('**/admin/pedidos', { timeout: 15000 });
  await mobile.waitForTimeout(1000);
  await mobile.screenshot({ path: 'scraper/review/movil_admin_pedidos.png' });
  await mobile.goto('http://localhost:3000/admin/productos', { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: 'scraper/review/movil_admin_productos.png' });
  await mobile.goto('http://localhost:3000/admin/ajustes', { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: 'scraper/review/movil_admin_ajustes.png' });

  await browser.close();
  console.log('OK');
})();
