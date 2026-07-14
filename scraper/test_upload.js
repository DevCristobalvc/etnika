const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });

  // Login
  await m.goto('http://localhost:3000/admin', { waitUntil: 'load' });
  await m.fill('input[name="usuario"]', 'Erika');
  await m.fill('input[name="clave"]', 'erika123');
  await m.click('button[type="submit"]');
  await m.waitForURL('**/admin/pedidos', { timeout: 15000 });

  // Ir a nuevo producto
  await m.goto('http://localhost:3000/admin/productos/nuevo', { waitUntil: 'load' });
  await m.waitForTimeout(1000);

  // Seleccionar imagen ancha (dispara el cropper)
  const fileInput = m.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(__dirname, 'test_img', 'ancha.jpg'));
  await m.waitForTimeout(1500);

  // Verificar que aparece el cropper
  const cropperVisible = await m.locator('text=Ajustar imagen').count();
  console.log(cropperVisible > 0 ? 'OK cropper aparece' : 'FAIL cropper no aparece');
  await m.screenshot({ path: 'scraper/review/vu_cropper.png' });

  // Usar zoom y confirmar
  await m.locator('input[type="range"]').fill('1.5');
  await m.waitForTimeout(500);
  await m.click('button:has-text("Usar esta imagen")');
  await m.waitForTimeout(2000);

  const cerrado = await m.locator('text=Ajustar imagen').count();
  console.log(cerrado === 0 ? 'OK cropper cerrado tras confirmar' : 'FAIL cropper sigue abierto');
  await m.screenshot({ path: 'scraper/review/vu_preview.png' });

  // Llenar el resto del formulario
  await m.fill('input[name="nombre"]', 'Producto Test Imagen');
  await m.fill('input[name="precio"]', '50000');
  await m.selectOption('select[name="categoria"]', { index: 1 });
  await m.click('button:has-text("Crear producto")');
  await m.waitForURL('**/admin/productos', { timeout: 20000 });
  await m.waitForTimeout(1000);

  const enLista = await m.locator('text=Producto Test Imagen').count();
  console.log(enLista > 0 ? 'OK producto creado con imagen' : 'FAIL producto no aparece');
  await m.screenshot({ path: 'scraper/review/vu_lista.png' });

  await browser.close();
})();
