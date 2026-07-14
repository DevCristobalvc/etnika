const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'content', 'nuevos');
const SHEETS = path.join(__dirname, 'review', 'sheets');
fs.mkdirSync(SHEETS, { recursive: true });

(async () => {
  const capturas = JSON.parse(fs.readFileSync(path.join(OUT, '_capturas.json'), 'utf8'));
  const conImagen = capturas.filter((c) => c.imagen && fs.existsSync(path.join(OUT, `${c.id}.png`)));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1500, height: 1300 } });

  const porHoja = 20;
  const hojas = Math.ceil(conImagen.length / porHoja);

  for (let h = 0; h < hojas; h++) {
    const grupo = conImagen.slice(h * porHoja, (h + 1) * porHoja);
    const celdas = grupo
      .map((c, i) => {
        const b64 = fs.readFileSync(path.join(OUT, `${c.id}.png`)).toString('base64');
        return `<div style="position:relative">
          <img src="data:image/png;base64,${b64}" style="width:290px;height:290px;object-fit:cover;display:block"/>
          <span style="position:absolute;top:2px;left:2px;background:#000c;color:#fff;font:bold 15px monospace;padding:2px 6px">${h * porHoja + i + 1}</span>
          <span style="position:absolute;bottom:2px;left:2px;background:#000c;color:#fff;font:11px monospace;padding:1px 4px">${c.id}</span>
        </div>`;
      })
      .join('');
    await page.setContent(
      `<body style="margin:0;background:#fff"><div style="display:grid;grid-template-columns:repeat(5,290px);gap:4px">${celdas}</div></body>`
    );
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SHEETS, `hoja_${String(h + 1).padStart(2, '0')}.png`), fullPage: true });
    console.log(`hoja_${h + 1} (${grupo.length} imgs)`);
  }

  console.log('SHEETS_OK', hojas);
  await browser.close();
})();
