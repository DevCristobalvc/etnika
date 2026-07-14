const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'content', 'nuevos');
const PUBLIC = path.join(__dirname, '..', 'web', 'public', 'productos');

const capturas = JSON.parse(fs.readFileSync(path.join(OUT, '_capturas.json'), 'utf8'));
const { seleccion } = JSON.parse(fs.readFileSync(path.join(__dirname, 'curaduria.json'), 'utf8'));

const PRECIOS = {
  'collares-perlas': 85000,
  'collares-largos': 80000,
  'collares-multicapa': 95000,
  aretes: 35000,
};

const DESC_DEFAULT = {
  'collares-perlas':
    'Collar artesanal elaborado a mano con materiales cuidadosamente seleccionados. Una pieza única que combina elegancia y autenticidad.',
  'collares-largos':
    'Collar largo artesanal que enmarca cualquier escote con carácter. Hecho a mano, pieza única.',
  'collares-multicapa':
    'Collar de múltiples capas elaborado artesanalmente. Volumen, textura y sofisticación en una sola pieza.',
  aretes:
    'Aretes artesanales hechos a mano. Ligeros, con carácter y llenos de detalle para elevar cualquier look.',
};

// Detectar captions genéricos (repetidos)
const freq = {};
capturas.forEach((c) => {
  const k = (c.caption || '').slice(0, 60);
  if (k) freq[k] = (freq[k] ?? 0) + 1;
});

const esc = (s) => String(s).replace(/'/g, "''");

function limpiarDescripcion(cap) {
  let t = cap
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}]/gu, '')
    .replace(/#[\wÀ-ÿ]+/g, '')
    .replace(/@[\w.]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (t.length > 340) {
    const corte = t.slice(0, 340);
    const punto = corte.lastIndexOf('. ');
    t = punto > 120 ? corte.slice(0, punto + 1) : corte.slice(0, corte.lastIndexOf(' ')) + '…';
  }
  return t;
}
const filas = [];
let copiadas = 0;

for (const sel of seleccion) {
  const c = capturas[sel.pos - 1];
  if (!c) {
    console.log(`AVISO pos ${sel.pos} fuera de rango`);
    continue;
  }
  const srcImg = path.join(OUT, `${c.id}.png`);
  if (!fs.existsSync(srcImg)) {
    console.log(`AVISO sin imagen: ${c.id}`);
    continue;
  }
  const dirCat = path.join(PUBLIC, sel.cat);
  fs.mkdirSync(dirCat, { recursive: true });
  fs.copyFileSync(srcImg, path.join(dirCat, `${c.id}.png`));
  copiadas++;

  const cap = (c.caption || '').trim();
  const generico = !cap || cap.length < 40 || (freq[cap.slice(0, 60)] ?? 0) > 3;
  const descripcion = generico ? DESC_DEFAULT[sel.cat] : limpiarDescripcion(cap);

  filas.push(
    `('${esc(c.id)}', '${esc(sel.nombre)}', '${esc(descripcion)}', ${PRECIOS[sel.cat]}, '${sel.cat}', '/productos/${sel.cat}/${c.id}.png', '${esc(c.url)}', true)`
  );
}

const sql = `insert into productos (id, nombre, descripcion, precio, categoria, imagen, instagram_url, activo) values\n${filas.join(',\n')}\non conflict (id) do nothing;`;
fs.writeFileSync(path.join(OUT, '_import.sql'), sql, 'utf8');
console.log(`IMAGENES_COPIADAS:${copiadas}`);
console.log(`SQL_FILAS:${filas.length}`);
