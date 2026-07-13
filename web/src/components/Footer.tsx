import type { ConfigSitio } from "@/lib/config";
import { waLink } from "@/lib/config";

function formatoWhatsapp(num: string): string {
  const limpio = num.replace(/[^\d]/g, "");
  const local = limpio.startsWith("57") ? limpio.slice(2) : limpio;
  return `+57 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}

function handleInstagram(url: string): string {
  const m = url.match(/instagram\.com\/([^/?]+)/);
  return m ? `@${m[1]}` : url;
}

export default function Footer({ config = {} }: { config?: ConfigSitio }) {
  const whatsapp = config.whatsapp ?? "573148801409";
  const instagram = config.instagram ?? "https://www.instagram.com/etnika_modaydiseno/";
  const ciudad = config.ciudad ?? "Cali, Colombia";

  return (
    <footer id="contacto" className="bg-tinta text-marfil mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-display text-4xl md:text-5xl tracking-[0.3em] uppercase font-light">
          Étnika
        </p>
        <p className="mt-3 text-[11px] tracking-[0.35em] uppercase text-marfil/50">
          {config.tagline ?? "Accesorios y Marroquinería"}
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-3 text-sm font-light">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-marfil/40 mb-4">
              Pedidos
            </p>
            <a
              href={waLink(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-marfil/80 hover:text-marfil transition-colors"
            >
              WhatsApp {formatoWhatsapp(whatsapp)}
            </a>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-marfil/40 mb-4">
              Síguenos
            </p>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-marfil/80 hover:text-marfil transition-colors"
            >
              {handleInstagram(instagram)}
            </a>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-marfil/40 mb-4">
              Encuéntranos
            </p>
            <p className="text-marfil/80">{ciudad}</p>
            {config.direccion_punto_venta && (
              <p className="text-marfil/60 mt-2 text-xs leading-relaxed">
                Punto de venta: {config.direccion_punto_venta}
              </p>
            )}
            {config.direccion_taller && (
              <p className="text-marfil/60 mt-1 text-xs leading-relaxed">
                Taller: {config.direccion_taller}
              </p>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-marfil/10 flex items-center justify-between">
          <p className="text-[10px] tracking-[0.2em] uppercase text-marfil/30">
            © {new Date().getFullYear()} Etnika Moda y Diseño
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-marfil/30">
            Hecho a mano
          </p>
        </div>
      </div>
    </footer>
  );
}
