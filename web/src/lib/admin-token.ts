// Token de sesión de admin firmado con HMAC-SHA256. Funciona en Node y en
// el runtime Edge del proxy (usa Web Crypto). La cookie no se puede
// falsificar sin la llave secreta del servidor.

function getSecret(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "etnika-fallback-secret";
}

async function hmac(mensaje: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const firma = await crypto.subtle.sign("HMAC", key, enc.encode(mensaje));
  return Array.from(new Uint8Array(firma))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Crea el valor de cookie: "<expiraMs>.<firma>"
export async function firmarSesionAdmin(diasValidez = 30): Promise<string> {
  const exp = Date.now() + diasValidez * 24 * 60 * 60 * 1000;
  const firma = await hmac(`admin:${exp}`);
  return `${exp}.${firma}`;
}

export async function verificarSesionAdmin(valor: string | undefined): Promise<boolean> {
  if (!valor) return false;
  const punto = valor.indexOf(".");
  if (punto < 0) return false;
  const exp = valor.slice(0, punto);
  const firma = valor.slice(punto + 1);
  if (!/^\d+$/.test(exp)) return false;
  if (Number(exp) < Date.now()) return false;

  const esperada = await hmac(`admin:${exp}`);
  if (esperada.length !== firma.length) return false;
  let diff = 0;
  for (let i = 0; i < esperada.length; i++) {
    diff |= esperada.charCodeAt(i) ^ firma.charCodeAt(i);
  }
  return diff === 0;
}
