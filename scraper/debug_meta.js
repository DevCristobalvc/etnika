const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const USER_DATA = path.join(__dirname, 'ig_session');

(async () => {
  const context = await chromium.launchPersistentContext(USER_DATA, {
    headless: false,
    viewport: { width: 900, height: 700 },
  });
  const resp = await context.request.get(
    'https://www.instagram.com/etnika_modaydiseno/p/DaeFNI7unRc/',
    { timeout: 20000 }
  );
  const html = await resp.text();
  console.log('STATUS:', resp.status(), 'LEN:', html.length);
  const metas = html.match(/<meta[^>]*(og:title|og:description|"description")[^>]*>/g) || [];
  metas.slice(0, 5).forEach((m) => console.log('META:', m.slice(0, 300)));
  fs.writeFileSync(path.join(__dirname, 'debug_post.html'), html.slice(0, 200000), 'utf8');
  await context.close();
})();
