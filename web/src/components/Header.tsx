import Image from "next/image";
import Link from "next/link";

export default function Header({
  solid = false,
  onDark = false,
}: {
  solid?: boolean;
  onDark?: boolean;
}) {
  const textoSuave = onDark ? "text-marfil/70 hover:text-marfil" : "text-tinta/70 hover:text-tinta";

  return (
    <header
      className={`${
        solid ? "relative bg-marfil border-b border-linea" : "absolute inset-x-0 top-0 z-20"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" aria-label="Étnika — Inicio">
          <Image
            src="/logo-full.png"
            alt="Étnika Moda — Accesorios y Marroquinería"
            width={112}
            height={70}
            priority
          />
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/#coleccion"
            className={`text-[11px] tracking-[0.25em] uppercase transition-colors ${textoSuave}`}
          >
            Colección
          </Link>
          <Link
            href="/#nosotras"
            className={`hidden sm:block text-[11px] tracking-[0.25em] uppercase transition-colors ${textoSuave}`}
          >
            Nosotras
          </Link>
          <Link
            href="/#contacto"
            className={`hidden sm:block text-[11px] tracking-[0.25em] uppercase transition-colors ${textoSuave}`}
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}
