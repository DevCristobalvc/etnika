const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

const shot = async (page, name) => {
  const p = path.join(DIR, name);
  await page.screenshot({ path: p, fullPage: false });
  console.log('SHOT:' + name);
};

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // Ir directo al login
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  await shot(page, '00_login.png');

  console.log('STATUS:login_page_open');
  console.log('ACTION: Inicia sesion en ESTE navegador (el que acabo de abrir)');

  // Esperar hasta que el usuario haya logueado — URL cambia a instagram.com
  await page.waitForURL(url => !url.toString().includes('/accounts/login'), { timeout: 180000 });
  console.log('STATUS:logged_in_confirmed');

  await page.waitForTimeout(3000);
  await shot(page, '01_home.png');

  // Ir al perfil de Etnika
  await page.goto('https://www.instagram.com/etnika_modaydiseno/', { waitUntil: 'load', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(4000);
  await shot(page, '02_profile_top.png');

  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(2000);
  await shot(page, '03_grid_1.png');

  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(2000);
  await shot(page, '04_grid_2.png');

  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(2000);
  await shot(page, '05_grid_3.png');

  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(2000);
  await shot(page, '06_grid_4.png');

  console.log('STATUS:profile_captured — avisa para abrir posts individuales');

  // Quedarse abierto para navegación adicional
  await page.waitForTimeout(600000);
  await browser.close();
})();
