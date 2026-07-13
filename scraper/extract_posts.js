const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = path.join(__dirname, '..', 'content');
const USER_DATA = path.join(__dirname, 'ig_session');

const CATS = {
  'collares-perlas':    path.join(BASE, 'productos', 'collares-perlas'),
  'collares-multicapa': path.join(BASE, 'productos', 'collares-multicapa'),
  'collares-dorados':   path.join(BASE, 'productos', 'collares-dorados'),
  'collares-largos':    path.join(BASE, 'productos', 'collares-largos'),
  'pulseras':           path.join(BASE, 'productos', 'pulseras'),
  'aretes':             path.join(BASE, 'productos', 'aretes'),
  'sin-clasificar':     path.join(BASE, 'productos', 'sin-clasificar'),
};
Object.values(CATS).forEach(d => fs.mkdirSync(d, { recursive: true }));
fs.mkdirSync(path.join(__dirname, 'screenshots'), { recursive: true });

const classify = text => {
  const t = (text || '').toLowerCase();
  if (t.includes('pulsera') || t.includes('brazalete')) return 'pulseras';
  if (t.includes('arete') || t.includes('pendiente'))   return 'aretes';
  if (t.includes('dorad') || t.includes('gold'))        return 'collares-dorados';
  if (t.includes('multicapa') || t.includes('capas'))   return 'collares-multicapa';
  if (t.includes('largo') || t.includes('larga'))       return 'collares-largos';
  if (t.includes('perla') || t.includes('pearl'))       return 'collares-perlas';
  return 'collares-perlas';
};

const DEFAULT_PRICES = {
  'collares-perlas':    85000,
  'collares-multicapa': 95000,
  'collares-dorados':   90000,
  'collares-largos':    80000,
  'pulseras':           45000,
  'aretes':             35000,
  'sin-clasificar':     75000,
};

const catalog = [];

(async () => {
  const context = await chromium.launchPersistentContext(USER_DATA, {
    headless: false,
    args: ['--start-maximized'],
    viewport: null,
  });

  const page = context.pages()[0] || await context.newPage();

  // Ir al login
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'session_check.png') });

  // Detectar si ya está logueado: buscar el ícono de "Home" del nav (solo aparece autenticado)
  const alreadyLoggedIn = await page.$('a[href="/"] svg, a[href="/direct/inbox/"], nav a[href="/"]').catch(() => null);

  if (!alreadyLoggedIn) {
    console.log('STATUS:need_login — inicia sesión completa en el navegador (usuario + contraseña + código 2FA)');

    // Esperar hasta que aparezca el nav de usuario autenticado (máx 5 min)
    await page.waitForSelector(
      'a[href="/direct/inbox/"], svg[aria-label="Home"], a[href*="/direct/"]',
      { timeout: 300000 }
    ).catch(() => console.log('WARN:timeout_esperando_login'));

    await page.waitForTimeout(2000);
    console.log('STATUS:logged_in');
  } else {
    console.log('STATUS:session_restored');
  }

  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'after_login.png') });

  // Ir al perfil de Etnika
  await page.goto('https://www.instagram.com/etnika_modaydiseno/', { waitUntil: 'load', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'profile.png') });

  // Recolectar hasta 10 links de posts
  let postLinks = [];
  for (let i = 0; i < 6 && postLinks.length < 10; i++) {
    const links = await page.$$eval('a[href*="/p/"]', els =>
      [...new Set(els.map(e => e.href).filter(h => h.includes('/p/')))]
    );
    links.forEach(l => { if (!postLinks.includes(l)) postLinks.push(l); });
    console.log(`LINKS_SO_FAR:${postLinks.length}`);
    if (postLinks.length >= 10) break;
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(1800);
  }
  postLinks = postLinks.slice(0, 10);
  console.log(`TOTAL_POSTS:${postLinks.length}`);

  for (let idx = 0; idx < postLinks.length; idx++) {
    const url = postLinks[idx];
    console.log(`PROCESSING:${idx + 1}/${postLinks.length}`);

    try {
      await page.goto(url, { waitUntil: 'load', timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(3000);

      const caption = await page.$eval('h1', el => el.innerText).catch(() => '');
      const category = classify(caption);
      const postId = url.split('/p/')[1].replace(/\//g, '');
      const filename = `${String(idx + 1).padStart(3, '0')}_${postId}.png`;
      const destPath = path.join(CATS[category], filename);

      // Intentar varios selectores para la imagen del producto
      const selectors = [
        'article img[srcset]',
        'article img',
        'main img[srcset]',
        'main img',
        'img[srcset]',
      ];
      let saved = false;
      for (const sel of selectors) {
        const el = await page.$(sel).catch(() => null);
        if (el) {
          try {
            await el.screenshot({ path: destPath });
            console.log(`IMG_OK:${sel} → ${filename}`);
            saved = true;
            break;
          } catch (e) {
            continue;
          }
        }
      }
      if (!saved) {
        // Último recurso: screenshot del viewport completo
        await page.screenshot({ path: destPath, clip: { x: 0, y: 0, width: 800, height: 800 } });
        console.log(`IMG_VIEWPORT:${filename}`);
      }

      const nombre = caption.split('\n')[0].substring(0, 60) ||
        `${category.replace(/-/g, ' ')} ${idx + 1}`;

      catalog.push({
        id: postId,
        index: idx + 1,
        categoria: category,
        nombre: nombre,
        descripcion: caption.substring(0, 400) ||
          'Accesorio artesanal elaborado a mano con materiales cuidadosamente seleccionados.',
        precio: DEFAULT_PRICES[category],
        imagen: `productos/${category}/${filename}`,
        instagramUrl: url,
        activo: true,
      });

      console.log(`DONE:${idx + 1} cat=${category}`);
    } catch (err) {
      console.log(`ERROR:${idx + 1} ${err.message}`);
    }
  }

  fs.writeFileSync(path.join(BASE, 'catalogo.json'), JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`CATALOG_SAVED — ${catalog.length} productos`);

  await context.close();
})();
