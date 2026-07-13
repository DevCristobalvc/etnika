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

export const WHATSAPP_ERIKA = "https://wa.me/573005412940";
export const INSTAGRAM_URL = "https://www.instagram.com/etnika_modaydiseno/";
