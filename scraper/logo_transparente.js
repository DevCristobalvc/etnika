const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const src = fs.readFileSync(
    path.join(__dirname, '..', 'web', 'public', 'logo-full.png')
  );
  const dataUrl = 'data:image/png;base64,' + src.toString('base64');

  const resultado = await page.evaluate(async (url) => {
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = url;
    });
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height);
    const px = d.data;
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i + 1], b = px[i + 2];
      const min = Math.min(r, g, b);
      // Blanco puro → transparente, con transición suave para evitar bordes duros
      if (min >= 245) {
        px[i + 3] = 0;
      } else if (min >= 215) {
        px[i + 3] = Math.round(255 * (245 - min) / 30);
      }
    }
    ctx.putImageData(d, 0, 0);
    return c.toDataURL('image/png');
  }, dataUrl);

  const b64 = resultado.split(',')[1];
  fs.writeFileSync(
    path.join(__dirname, '..', 'web', 'public', 'logo-full.png'),
    Buffer.from(b64, 'base64')
  );
  console.log('OK transparente');
  await browser.close();
})();
