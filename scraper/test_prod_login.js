const { chromium } = require('playwright');
const SERVICE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6anBqZGJ1cGZlc2txZnZnaWJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzg5MzExOCwiZXhwIjoyMDk5NDY5MTE4fQ.vy70MtisfWVqZx-212JLpJcsdlqZO3yKaZSPahT31Z0';

(async () => {
  const r = await fetch('https://fzjpjdbupfeskqfvgibw.supabase.co/auth/v1/admin/generate_link', {
    method: 'POST',
    headers: { Authorization: `Bearer ${SERVICE}`, apikey: SERVICE, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'magiclink', email: 'erikavalenciac@hotmail.com', redirect_to: 'https://etnikamoda.com/admin/callback' }),
  });
  const actionLink = (await r.json()).action_link;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('console', (m) => console.log('CONSOLE:', m.type(), m.text().slice(0, 160)));
  page.on('requestfailed', (r) => console.log('REQ FAIL:', r.url().slice(0, 80), r.failure()?.errorText));

  // Abrir el enlace mágico real (como haría Erika desde su correo)
  await page.goto(actionLink, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(15000);
  const url = page.url();
  console.log('URL final:', url.split('#')[0].replace('https://etnikamoda.com', ''));
  console.log(url.includes('/admin/pedidos') ? 'OK login producción entró al panel' : 'FAIL');
  await page.screenshot({ path: 'scraper/review/vm_prod.png' });

  // Sin sesión → redirige a login
  const anon = await (await browser.newContext()).newPage();
  await anon.goto('https://etnikamoda.com/admin/productos', { waitUntil: 'load' });
  await anon.waitForTimeout(1500);
  console.log(anon.url().endsWith('/admin') ? 'OK protección de rutas en prod' : `FAIL ${anon.url()}`);

  await browser.close();
})();
