const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  // Página de resultado (pedido ya pagado en la prueba)
  await m.goto('http://localhost:3000/pago/1baf1142-1f80-4c72-b64b-90b0b5cf4b6b', { waitUntil: 'networkidle' });
  await m.screenshot({ path: 'scraper/review/vb_pago_ok.png' });
  const confirmado = await m.locator('text=Pago confirmado').count();
  console.log(confirmado > 0 ? 'OK pagina muestra pago confirmado' : 'FAIL');
  await b.close();
})();
