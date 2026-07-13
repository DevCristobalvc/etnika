export function formatPrecio(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export const CATEGORIAS: Record<string, string> = {
  "collares-perlas": "Collares Cortos",
  "collares-largos": "Collares Largos",
  "collares-multicapa": "Collares Multicapa",
};

export function nombreCategoria(slug: string): string {
  return CATEGORIAS[slug] ?? slug.replace(/-/g, " ");
}

export const WHATSAPP_ERIKA = "https://wa.me/573148801409";
export const INSTAGRAM_URL = "https://www.instagram.com/etnika_modaydiseno/";

// Canonicaliza un número colombiano a "57XXXXXXXXXX" para usarlo como
// identificador único del cliente sin importar cómo lo escriba.
export function normalizarWhatsapp(raw: string): string {
  let d = (raw ?? "").replace(/\D/g, "");
  if (d.startsWith("0057")) d = d.slice(4);
  if (d.length === 10 && d.startsWith("3")) d = "57" + d;
  return d;
}
