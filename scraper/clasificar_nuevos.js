const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'content', 'nuevos');
const capturas = JSON.parse(fs.readFileSync(path.join(OUT, '_capturas.json'), 'utf8'));

const limpiar = (s) =>
  (s || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2728}\u{2764}]/gu, '')
    .replace(/#\w+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

function clasificar(caption) {
  const t = (caption || '').toLowerCase();
  const esProducto =
    /collar|pulsera|brazalete|arete|candonga|bolso|cartera|billetera|ma?rroquiner|accesorio|pieza|juego|set|gargantilla|manilla/.test(t);
  if (!esProducto) return null;

  if (/pulsera|brazalete|manilla/.test(t)) return 'pulseras';
  if (/arete|candonga|topo/.test(t)) return 'aretes';
  if (/bolso|cartera|billetera|marroquiner/.test(t)) return 'bolsos';
  if (/multicapa|capas|tres vueltas|3 vueltas/.test(t)) return 'collares-multicapa';
  if (/largo|larga|sautoir/.test(t)) return 'collares-largos';
  if (/collar|gargantilla|juego|set|pieza|accesorio/.test(t)) return 'collares-perlas';
  return 'collares-perlas';
}

const PRECIOS = {
  'collares-perlas': 85000,
  'collares-largos': 80000,
  'collares-multicapa': 95000,
  pulseras: 45000,
  aretes: 35000,
  bolsos: 150000,
};

const candidatos = [];
const descartados = [];

for (const c of capturas) {
  if (!c.imagen) {
    descartados.push({ id: c.id, motivo: 'sin imagen' });
    continue;
  }
  const cat = clasificar(c.caption);
  if (!cat) {
    descartados.push({ id: c.id, motivo: 'no parece producto', caption: limpiar(c.caption).slice(0, 80) });
    continue;
  }
  const primera = limpiar((c.caption || '').split('\n')[0]).slice(0, 60);
  candidatos.push({
    id: c.id,
    categoria: cat,
    nombre: primera || null,
    caption: limpiar(c.caption).slice(0, 300),
    url: c.url,
  });
}

const porCat = {};
candidatos.forEach((c) => {
  porCat[c.categoria] = (porCat[c.categoria] ?? 0) + 1;
});

fs.writeFileSync(path.join(OUT, '_candidatos.json'), JSON.stringify(candidatos, null, 2), 'utf8');
fs.writeFileSync(path.join(OUT, '_descartados.json'), JSON.stringify(descartados, null, 2), 'utf8');
console.log('CANDIDATOS:', candidatos.length);
console.log('POR CATEGORIA:', JSON.stringify(porCat));
console.log('DESCARTADOS:', descartados.length);
