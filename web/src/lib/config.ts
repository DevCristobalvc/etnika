import { supabase } from "./supabase";

export type ConfigSitio = Record<string, string>;

export async function obtenerConfig(): Promise<ConfigSitio> {
  const { data } = await supabase.from("configuracion").select("clave, valor");
  const cfg: ConfigSitio = {};
  (data ?? []).forEach((r: { clave: string; valor: string }) => {
    cfg[r.clave] = r.valor;
  });
  return cfg;
}

export function waLink(whatsapp: string | undefined, texto?: string): string {
  const num = (whatsapp || "573148801409").replace(/[^\d]/g, "");
  const conPais = num.startsWith("57") ? num : `57${num}`;
  const base = `https://wa.me/${conPais}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}
