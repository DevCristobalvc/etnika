const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/coleccion', { waitUntil: 'networkidle' });

  const medidas = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const grid = document.querySelector('main .grid');
    const carta = grid?.children[0];
    const img = carta?.querySelector('img');
    return {
      viewport: window.innerWidth,
      docScrollW: doc.scrollWidth,
      bodyScrollW: body.scrollWidth,
      gridW: grid?.getBoundingClientRect().width,
      gridCols: grid ? getComputedStyle(grid).gridTemplateColumns : null,
      cartaW: carta?.getBoundingClientRect().width,
      imgW: img?.getBoundingClientRect().width,
      imgNatural: img ? `${img.naturalWidth}x${img.naturalHeight}` : null,
      overflowCulprits: [...document.querySelectorAll('*')]
        .filter((el) => el.getBoundingClientRect().width > window.innerWidth + 2)
        .slice(0, 8)
        .map((el) => `${el.tagName}.${String(el.className).slice(0, 60)} w=${Math.round(el.getBoundingClientRect().width)}`),
    };
  });
  console.log(JSON.stringify(medidas, null, 1));
  await browser.close();
})();
