import "server-only";
import { createHash, createHmac } from "crypto";

export const BOLD_IDENTITY_KEY = process.env.NEXT_PUBLIC_BOLD_IDENTITY_KEY ?? "";
const BOLD_SECRET = process.env.BOLD_SECRET_KEY ?? "";
// Bold firma los webhooks con la llave secreta (o una específica si se
// configura una distinta en el panel de Bold).
const BOLD_WEBHOOK_SECRET = process.env.BOLD_WEBHOOK_SECRET || BOLD_SECRET;

export const BOLD_MONEDA = "COP";

// Firma de integridad: SHA256("{orderId}{montoEnCentavos}{divisa}{llaveSecreta}")
// El monto va en centavos sin decimales. Se calcula SOLO en el servidor.
export function firmaIntegridad(orderId: string, montoCentavos: number): string {
  const cadena = `${orderId}${montoCentavos}${BOLD_MONEDA}${BOLD_SECRET}`;
  return createHash("sha256").update(cadena).digest("hex");
}

// COP no usa decimales, pero Bold pide el monto en centavos (x100).
export function aCentavos(pesos: number): number {
  return Math.round(pesos * 100);
}

// Verifica la autenticidad del webhook: HMAC-SHA256 de base64(body) con la
// llave secreta, comparado contra el header x-bold-signature.
export function verificarWebhook(rawBody: string, firmaHeader: string | null): boolean {
  if (!firmaHeader) return false;
  const base64Body = Buffer.from(rawBody, "utf8").toString("base64");
  const esperada = createHmac("sha256", BOLD_WEBHOOK_SECRET)
    .update(base64Body)
    .digest("hex");
  // Comparación de tiempo constante
  if (esperada.length !== firmaHeader.length) return false;
  let diff = 0;
  for (let i = 0; i < esperada.length; i++) {
    diff |= esperada.charCodeAt(i) ^ firmaHeader.charCodeAt(i);
  }
  return diff === 0;
}
