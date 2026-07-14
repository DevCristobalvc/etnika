const { chromium } = require('playwright');

const SERVICE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6anBqZGJ1cGZlc2txZnZnaWJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzg5MzExOCwiZXhwIjoyMDk5NDY5MTE4fQ.vy70MtisfWVqZx-212JLpJcsdlqZO3yKaZSPahT31Z0';

async function generarActionLink(email) {
  const r = await fetch('https://fzjpjdbupfeskqfvgibw.supabase.co/auth/v1/admin/generate_link', {
    method: 'POST',
    headers: { Authorization: `Bearer ${SERVICE}`, apikey: SERVICE, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'magiclink', email, options: { redirect_to: 'https://etnikamoda.com/admin/callback' } }),
  });
  return (await r.json()).action_link;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  // 1. Obtener el hash con los tokens visitando el verify de Supabase
  const actionLink = await generarActionLink('erikavalenciac@hotmail.com');
  await page.goto(actionLink, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);
  const conHash = page.url();
  const hash = conHash.substring(conHash.indexOf('#'));
  console.log('Token en hash:', hash.includes('access_token') ? 'sí' : 'NO');

  // 2. Alimentar ese hash a MI callback en localhost
  await page.goto('http://localhost:3000/admin/callback' + hash, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(6000);
  const url = page.url().replace('http://localhost:3000', '');
  console.log('URL tras callback:', url.split('#')[0]);
  console.log(url.includes('/admin/pedidos') ? 'OK callback autenticó y entró al panel' : 'FAIL');
  await page.screenshot({ path: 'scraper/review/vm_callback.png' });

  // 3. Sesión persiste
  await page.goto('http://localhost:3000/admin/clientes', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  console.log(page.url().includes('/admin/clientes') ? 'OK sesión persiste' : 'FAIL sesión no persiste');

  await browser.close();
})();
