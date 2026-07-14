const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.fill('input[name="usuario"]', 'Erika');
  await page.fill('input[name="clave"]', 'erika123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/pedidos', { timeout: 15000 });

  // Crear categoría "Pulseras"
  await page.goto('http://localhost:3000/admin/categorias', { waitUntil: 'networkidle' });
  await page.fill('input[placeholder*="Pulseras"]', 'Pulseras Étnicas');
  await page.click('button:has-text("Crear categoría")');
  await page.waitForTimeout(2000);
  const creada = await page.locator('text=pulseras-etnicas').count();
  console.log(creada > 0 ? 'OK categoria creada (slug pulseras-etnicas)' : 'FAIL crear categoria');
  await page.screenshot({ path: 'scraper/review/v4_categorias.png' });

  // Verificar que aparece en el select del formulario de producto
  await page.goto('http://localhost:3000/admin/productos/nuevo', { waitUntil: 'networkidle' });
  const opcion = await page.locator('select option:has-text("Pulseras Étnicas")').count();
  console.log(opcion > 0 ? 'OK select en producto' : 'FAIL select producto');

  // Eliminar la categoría de prueba (sin productos → debe permitir)
  await page.goto('http://localhost:3000/admin/categorias', { waitUntil: 'networkidle' });
  const fila = page.locator('div.border', { hasText: 'pulseras-etnicas' });
  await fila.locator('button:has-text("Eliminar")').click();
  await fila.locator('button:has-text("Confirmar")').click();
  await page.waitForTimeout(2000);
  const borrada = await page.locator('text=pulseras-etnicas').count();
  console.log(borrada === 0 ? 'OK categoria eliminada' : 'FAIL eliminar');

  // Intentar eliminar una con productos → debe rechazar
  const filaOcupada = page.locator('div.border', { hasText: 'collares-perlas' });
  await filaOcupada.locator('button:has-text("Eliminar")').click();
  await filaOcupada.locator('button:has-text("Confirmar")').click();
  await page.waitForTimeout(2000);
  const rechazo = await page.locator('text=Muévelos primero').count();
  console.log(rechazo > 0 ? 'OK rechaza eliminar con productos' : 'FAIL proteccion');

  await browser.close();
})();
