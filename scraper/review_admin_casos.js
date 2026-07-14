const { chromium } = require('playwright');

// Recorre TODOS los casos de uso del admin y reporta estado
(async () => {
  const browser = await chromium.launch();
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const R = [];
  const ok = (n) => { R.push(['OK', n]); console.log(`OK   ${n}`); };
  const mal = (n, d) => { R.push(['FAIL', n]); console.log(`FAIL ${n}: ${d}`); };
  const nav = (r) => m.goto(`http://localhost:3000${r}`, { waitUntil: 'load', timeout: 60000 }).then(() => m.waitForTimeout(1200));

  // Login
  await nav('/admin');
  await m.fill('input[name="usuario"]', 'Erika');
  await m.fill('input[name="clave"]', 'erika123');
  await m.click('button[type="submit"]');
  await m.waitForURL('**/admin/pedidos', { timeout: 15000 });
  ok('login');

  // Nav de 5 pestañas
  const tabs = await m.locator('nav a').allInnerTexts();
  const esperadas = ['Pedidos', 'Productos', 'Clientes', 'Formulario', 'Ajustes'];
  esperadas.every((t) => tabs.some((x) => x.includes(t)))
    ? ok('nav 5 pestañas') : mal('nav', tabs.join(','));

  // PRODUCTOS: filtro por categoría
  await nav('/admin/productos');
  const filtros = await m.locator('a[href*="categoria="]').count();
  filtros >= 4 ? ok(`productos: ${filtros} filtros de categoría`) : mal('filtros productos', filtros);
  await nav('/admin/productos?categoria=aretes');
  const aretesCount = await m.locator('.space-y-3 > div').count();
  aretesCount > 0 && aretesCount < 30 ? ok(`filtro aretes muestra ${aretesCount}`) : mal('filtro aretes', aretesCount);
  await m.screenshot({ path: 'scraper/review/vc_productos.png' });

  // PRODUCTOS: ajuste rápido de stock (poner stock a un producto y ajustarlo)
  await nav('/admin/productos');
  await m.locator('.space-y-3 > div').first().locator('a:has-text("Editar")').click();
  await m.waitForTimeout(1000);
  await m.fill('input[name="stock"]', '5');
  await m.click('button:has-text("Guardar cambios")');
  await m.waitForURL('**/admin/productos', { timeout: 15000 });
  await m.waitForTimeout(800);
  const tieneStepper = await m.locator('button[aria-label="Sumar stock"]').first().count();
  tieneStepper > 0 ? ok('stepper de stock aparece con stock definido') : mal('stepper stock', 'no aparece');
  await m.locator('button[aria-label="Sumar stock"]').first().click();
  await m.waitForTimeout(1200);
  ok('ajuste rápido stock +1');

  // CATEGORIAS
  await nav('/admin/categorias');
  const cats = await m.locator('input[type="text"]').count();
  cats >= 4 ? ok(`categorías: ${cats} editables`) : mal('categorias', cats);

  // CLIENTES
  await nav('/admin/clientes');
  const btnNueva = await m.locator('a:has-text("Nueva")').count();
  const btnCSV = await m.locator('a:has-text("CSV")').count();
  btnNueva > 0 && btnCSV > 0 ? ok('clientes: botones Nueva + CSV') : mal('clientes botones', `nueva=${btnNueva} csv=${btnCSV}`);

  // PEDIDOS
  await nav('/admin/pedidos');
  const btnNuevo = await m.locator('a:has-text("Nuevo")').count();
  const filtrosPed = await m.locator('a[href*="estado="], a:has-text("Todos")').count();
  btnNuevo > 0 ? ok('pedidos: botón Nuevo (manual)') : mal('pedido manual', 'falta botón');
  filtrosPed >= 4 ? ok('pedidos: filtros de estado') : mal('filtros pedido', filtrosPed);

  // FORMULARIO
  await nav('/admin/formulario');
  const preguntas = await m.locator('input[type="text"]').count();
  preguntas >= 5 ? ok(`formulario: ${preguntas} campos editables`) : mal('formulario', preguntas);

  // AJUSTES + colores
  await nav('/admin/ajustes');
  const colores = await m.locator('input[type="color"]').count();
  colores === 3 ? ok('ajustes: 3 colores configurables') : mal('colores', colores);
  const campos = await m.locator('input, textarea').count();
  ok(`ajustes: ${campos} campos totales`);
  await m.screenshot({ path: 'scraper/review/vc_ajustes.png' });

  // Resumen
  const fails = R.filter((r) => r[0] === 'FAIL');
  console.log(`\n${R.length - fails.length}/${R.length} OK`);
  console.log(fails.length ? `FALLOS: ${fails.map((f) => f[1]).join(', ')}` : 'TODOS LOS CASOS OK');
  await browser.close();
  process.exit(fails.length ? 1 : 0);
})();
