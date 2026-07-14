const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const fallos = [];
  const ok = (n) => console.log(`OK  ${n}`);
  const mal = (n, d) => { fallos.push(n); console.log(`FAIL ${n}: ${d}`); };

  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });

  // 1. Sin overflow horizontal en páginas públicas
  for (const ruta of ['/', '/coleccion', '/coleccion?categoria=aretes', '/producto/DaeEsVLuPmX']) {
    await m.goto(`http://localhost:3000${ruta}`, { waitUntil: 'networkidle' });
    const w = await m.evaluate(() => document.documentElement.scrollWidth);
    w <= 392 ? ok(`sin overflow ${ruta} (${w}px)`) : mal(`overflow ${ruta}`, `${w}px`);
  }

  // 2. Home: sin header, sin tagline duplicado, un solo botón de colección
  await m.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const headers = await m.locator('header').count();
  headers === 0 ? ok('home sin header') : mal('home header', `${headers} headers`);
  const botones = await m.locator('a:has-text("Ver colección"), a:has-text("Ver toda la colección")').count();
  console.log(`INFO botones coleccion en home: ${botones}`);
  await m.screenshot({ path: 'scraper/review/vf_home.png' });

  // 3. Colección responsive
  await m.goto('http://localhost:3000/coleccion', { waitUntil: 'load', timeout: 60000 });
  await m.waitForTimeout(2500);
  await m.screenshot({ path: 'scraper/review/vf_coleccion.png' });

  // 4. Header en producto muestra wordmark texto
  await m.goto('http://localhost:3000/producto/DaeEsVLuPmX', { waitUntil: 'load', timeout: 60000 });
  const wordmark = await m.locator('header a:has-text("Étnika")').count();
  wordmark > 0 ? ok('wordmark en header producto') : mal('wordmark', 'no está');
  const linkColeccion = await m.locator('header nav a:has-text("Colección")').count();
  linkColeccion === 0 ? ok('sin link Colección en header') : mal('link coleccion', 'sigue en header');

  // 5. Admin: colores en ajustes
  await m.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await m.fill('input[name="usuario"]', 'Erika');
  await m.fill('input[name="clave"]', 'erika123');
  await m.click('button[type="submit"]');
  await m.waitForURL('**/admin/pedidos', { timeout: 15000 });
  await m.goto('http://localhost:3000/admin/ajustes', { waitUntil: 'networkidle' });
  const colorInputs = await m.locator('input[type="color"]').count();
  colorInputs === 3 ? ok('3 selectores de color en ajustes') : mal('colores', `${colorInputs}`);
  await m.screenshot({ path: 'scraper/review/vf_ajustes_colores.png' });

  // 6. Cambiar color de fondo y verificar que aplica en el sitio
  await m.locator('input[type="color"]').first().fill('#f0ece2');
  await m.click('button:has-text("Guardar y publicar")');
  await m.waitForTimeout(2500);
  await m.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const fondo = await m.evaluate(() => getComputedStyle(document.body).backgroundColor);
  fondo === 'rgb(240, 236, 226)' ? ok(`color aplicado (${fondo})`) : mal('color', fondo);

  // Restaurar color original
  await m.goto('http://localhost:3000/admin/ajustes', { waitUntil: 'networkidle' });
  await m.locator('input[type="color"]').first().fill('#fbf9f5');
  await m.click('button:has-text("Guardar y publicar")');
  await m.waitForTimeout(2000);
  ok('color restaurado');

  console.log(fallos.length === 0 ? '\nTODO OK' : `\nFALLOS: ${fallos.join(', ')}`);
  await browser.close();
  process.exit(fallos.length ? 1 : 0);
})();
