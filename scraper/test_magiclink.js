const { chromium } = require('playwright');

const SERVICE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6anBqZGJ1cGZlc2txZnZnaWJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzg5MzExOCwiZXhwIjoyMDk5NDY5MTE4fQ.vy70MtisfWVqZx-212JLpJcsdlqZO3yKaZSPahT31Z0';

async function generarEnlace(email) {
  const r = await fetch('https://fzjpjdbupfeskqfvgibw.supabase.co/auth/v1/admin/generate_link', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE}`,
      apikey: SERVICE,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'magiclink',
      email,
      options: { redirect_to: 'http://localhost:3000/admin/callback' },
    }),
  });
  const d = await r.json();
  return d.action_link;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('console', (m) => { if (m.type() === 'error') console.log('PAGE ERR:', m.text().slice(0, 100)); });

  // 1. Generar enlace mágico para Erika y abrirlo
  const enlace = await generarEnlace('erikavalenciac@hotmail.com');
  console.log('Enlace generado:', enlace ? 'sí' : 'NO');
  await page.goto(enlace, { waitUntil: 'load', timeout: 30000 });
  // Esperar a que el callback procese y redirija
  await page.waitForTimeout(6000);
  const url1 = page.url();
  console.log('URL tras enlace:', url1.replace('http://localhost:3000', ''));
  const enPanel = url1.includes('/admin/pedidos');
  console.log(enPanel ? 'OK entró al panel con enlace mágico' : 'FAIL no llegó al panel');
  await page.screenshot({ path: 'scraper/review/vm_panel.png' });

  // 2. Verificar que la sesión persiste (recargar una ruta protegida)
  await page.goto('http://localhost:3000/admin/productos', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const enProductos = page.url().includes('/admin/productos');
  console.log(enProductos ? 'OK sesión persiste en rutas protegidas' : 'FAIL sesión no persiste');

  // 3. Verificar que sin sesión, una ruta protegida redirige al login
  const anon = await browser.newContext();
  const p2 = await anon.newPage();
  await p2.goto('http://localhost:3000/admin/pedidos', { waitUntil: 'load' });
  await p2.waitForTimeout(1000);
  const redirigido = p2.url().endsWith('/admin');
  console.log(redirigido ? 'OK sin sesión redirige a login' : `FAIL quedó en ${p2.url()}`);

  await browser.close();
})();
