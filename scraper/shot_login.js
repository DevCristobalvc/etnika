const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await m.screenshot({ path: 'scraper/review/vm_login.png' });
  // Expandir contraseña
  await m.click('text=Entrar con contraseña');
  await m.waitForTimeout(500);
  await m.screenshot({ path: 'scraper/review/vm_login_pass.png' });
  console.log('OK');
  await b.close();
})();
