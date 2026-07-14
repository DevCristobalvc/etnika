const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const fallos = [];
  const ok = (nombre) => console.log(`OK  ${nombre}`);
  const mal = (nombre, detalle) => { fallos.push(nombre); console.log(`FAIL ${nombre}: ${detalle}`); };

  // 1. Home: logo en header y aviso de stock
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const logo = await page.locator('header img[src*="emblema"]').count();
  logo > 0 ? ok('logo en header') : mal('logo en header', 'no aparece');
  await page.screenshot({ path: 'scraper/review/v3_header.png' });

  // 2. Producto con stock 2 → aviso "Solo quedan 2"
  await page.goto('http://localhost:3000/producto/DaoQL85Orem', { waitUntil: 'networkidle' });
  const aviso = await page.locator('text=Solo quedan 2 unidades').count();
  aviso > 0 ? ok('aviso stock bajo') : mal('aviso stock bajo', 'no aparece');

  // 3. Pedido web de 2 unidades → agota el stock
  await page.click('text=Lo quiero');
  await page.click('text=Hacer pedido');
  await page.fill('form input[type="text"] >> nth=0', 'Validacion Total');
  await page.fill('form input[type="tel"]', '311 222 3344');
  await page.fill('form input[placeholder*="Dirección"]', 'Calle Falsa 123, Cali');
  const textos = page.locator('form input[type="text"]');
  const n = await textos.count();
  for (let i = 2; i < n; i++) await textos.nth(i).fill('Efectivo');
  // aumentar cantidad a 2
  await page.click('button[aria-label="Aumentar cantidad"]');
  await page.click('button:has-text("Confirmar pedido")');
  try {
    await page.waitForSelector('text=Pedido recibido', { timeout: 15000 });
    ok('pedido web de 2 unidades');
  } catch {
    mal('pedido web', await page.locator('form').innerText().catch(() => '?'));
  }

  // 4. Producto ahora agotado
  await page.goto('http://localhost:3000/producto/DaoQL85Orem', { waitUntil: 'networkidle' });
  const agotado = await page.locator('text=Pieza agotada').count();
  agotado > 0 ? ok('producto agotado tras compra') : mal('agotado', 'no se muestra');
  await page.screenshot({ path: 'scraper/review/v3_agotado.png' });

  // 5. Login admin
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.fill('input[name="usuario"]', 'Erika');
  await page.fill('input[name="clave"]', 'erika123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/pedidos', { timeout: 15000 });
  ok('login admin');

  // 6. Editar pedido: cambiar cantidad a 1
  await page.click('text=Collar Semillas Rojo');
  await page.waitForTimeout(400);
  await page.click('button:has-text("Editar")');
  await page.click('button[aria-label="Disminuir cantidad"]');
  await page.fill('textarea', 'Editado desde validación');
  await page.click('button:has-text("Guardar")');
  await page.waitForTimeout(1500);
  const cant = await page.locator('text=Editado desde validación').count();
  cant > 0 ? ok('editar pedido') : mal('editar pedido', 'nota no visible tras guardar');
  await page.screenshot({ path: 'scraper/review/v3_pedido_editado.png' });

  // 7. Crear clienta manual
  await page.goto('http://localhost:3000/admin/clientes/nuevo', { waitUntil: 'networkidle' });
  await page.fill('input[type="text"] >> nth=0', 'Clienta Manual Test');
  await page.fill('input[type="tel"]', '320 555 6677');
  await page.fill('input[type="text"] >> nth=1', 'Av Siempre Viva 742');
  await page.click('button:has-text("Crear clienta")');
  await page.waitForURL('**/admin/clientes', { timeout: 15000 });
  const creada = await page.locator('text=Clienta Manual Test').count();
  creada > 0 ? ok('crear clienta') : mal('crear clienta', 'no aparece en lista');

  // 8. Duplicado rechazado
  await page.goto('http://localhost:3000/admin/clientes/nuevo', { waitUntil: 'networkidle' });
  await page.fill('input[type="text"] >> nth=0', 'Duplicada');
  await page.fill('input[type="tel"]', '+57 320 555 6677');
  await page.click('button:has-text("Crear clienta")');
  await page.waitForTimeout(2000);
  const dup = await page.locator('text=Ya existe una clienta').count();
  dup > 0 ? ok('duplicado por telefono rechazado') : mal('duplicado', 'no valido whatsapp normalizado');

  // 9. Editar clienta
  await page.goto('http://localhost:3000/admin/clientes', { waitUntil: 'networkidle' });
  await page.click('text=Clienta Manual Test');
  await page.waitForTimeout(600);
  await page.click('text=Editar datos');
  await page.fill('input[type="text"] >> nth=0', 'Clienta Editada Test');
  await page.click('button:has-text("Guardar")');
  await page.waitForTimeout(1500);
  const editada = await page.locator('text=Clienta Editada Test').count();
  editada > 0 ? ok('editar clienta') : mal('editar clienta', 'nombre no cambio');
  await page.screenshot({ path: 'scraper/review/v3_clienta.png' });

  // 10. Stock visible en admin productos
  await page.goto('http://localhost:3000/admin/productos', { waitUntil: 'networkidle' });
  const stockAdmin = await page.locator('text=Agotado').count();
  stockAdmin > 0 ? ok('stock agotado visible en admin') : mal('stock admin', 'no visible');
  await page.screenshot({ path: 'scraper/review/v3_admin_productos.png' });

  console.log(fallos.length === 0 ? '\nTODO OK' : `\nFALLOS: ${fallos.join(', ')}`);
  await browser.close();
  process.exit(fallos.length === 0 ? 0 : 1);
})();
