import Link from "next/link";
import { WHATSAPP_ERIKA, INSTAGRAM_URL } from "@/lib/format";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-tinta text-marfil mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-display text-4xl md:text-5xl tracking-[0.3em] uppercase font-light">
          Étnika
        </p>
        <p className="mt-4 max-w-md text-sm font-light text-marfil/60 leading-relaxed">
          Accesorios artesanales hechos a mano en Colombia. Cada pieza es única,
          como la mujer que la lleva.
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-3 text-sm font-light">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-marfil/40 mb-4">
              Pedidos
            </p>
            <a
              href={WHATSAPP_ERIKA}
              target="_blank"
              rel="noopener noreferrer"
              className="text-marfil/80 hover:text-marfil transition-colors"
            >
              WhatsApp +57 300 541 2940
            </a>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-marfil/40 mb-4">
              Síguenos
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-marfil/80 hover:text-marfil transition-colors"
            >
              @etnika_modaydiseno
            </a>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-marfil/40 mb-4">
              Taller
            </p>
            <p className="text-marfil/80">Cali, Colombia</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-marfil/10 flex items-center justify-between">
          <p className="text-[10px] tracking-[0.2em] uppercase text-marfil/30">
            © {new Date().getFullYear()} Etnika Moda y Diseño
          </p>
          <Link
            href="/#"
            className="text-[10px] tracking-[0.2em] uppercase text-marfil/30 hover:text-marfil/60 transition-colors"
          >
            Hecho a mano
          </Link>
        </div>
      </div>
    </footer>
  );
}
