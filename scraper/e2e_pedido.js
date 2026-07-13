const { chromium } = require('playwright');

async function hacerPedido(page, producto, nombre, telefono, direccion) {
  await page.goto(`http://localhost:3000/producto/${producto}`, { waitUntil: 'networkidle' });
  await page.click('text=Lo quiero');
  await page.click('text=Hacer pedido');
  const inputs = page.locator('form input, form textarea');
  // Orden: Nombre (text), WhatsApp (tel), Ubicación (map→text), Notas (textarea)
  await page.fill('form input[type="text"] >> nth=0', nombre);
  await page.fill('form input[type="tel"]', telefono);
  await page.fill('form input[placeholder*="Dirección"]', direccion);
  // Preguntas adicionales de texto (ej. "Medio de pago" creada desde el admin)
  const textos = page.locator('form input[type="text"]');
  const n = await textos.count();
  for (let i = 2; i < n; i++) {
    await textos.nth(i).fill('Efectivo');
  }
  await page.click('button:has-text("Confirmar pedido")');
  await page.waitForSelector('text=Pedido recibido', { timeout: 15000 });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  // Pedido 1: teléfono formato local
  await hacerPedido(page, 'DaoQL85Orem', 'Prueba Cliente', '300 111 2233', 'Cra 10 # 20-30, Cali');
  console.log('Pedido 1 OK (tel local)');

  // Pedido 2: mismo teléfono con +57 → NO debe crear cliente nuevo
  await hacerPedido(page, 'DaoPXMjxR8n', 'Prueba Cliente', '+57 300 111 2233', 'Cra 10 # 20-30, Cali');
  console.log('Pedido 2 OK (tel con +57)');

  // Admin: verificar pedidos y cliente único
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.fill('input[name="usuario"]', 'Erika');
  await page.fill('input[name="clave"]', 'erika123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/pedidos', { timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scraper/review/e2e_admin_pedidos.png' });

  const tarjetas = await page.locator('text=Prueba Cliente').count();
  console.log(`Pedidos visibles del cliente de prueba: ${tarjetas}`);

  await page.goto('http://localhost:3000/admin/clientes', { waitUntil: 'networkidle' });
  const clientes = await page.locator('text=Prueba Cliente').count();
  console.log(`Clientes "Prueba Cliente" (debe ser 1): ${clientes}`);
  await page.screenshot({ path: 'scraper/review/e2e_admin_clientes.png' });

  // CSV export (con cookie de sesión del contexto)
  const resp = await page.request.get('http://localhost:3000/admin/pedidos/export');
  const csv = await resp.text();
  console.log(`CSV pedidos: status ${resp.status()}, líneas ${csv.split('\n').length}`);
  console.log(csv.split('\n').slice(0, 3).join('\n'));

  await browser.close();
})();
