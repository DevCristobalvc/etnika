import Link from "next/link";

export default function Header({ solid = false }: { solid?: boolean }) {
  return (
    <header
      className={`${
        solid ? "relative bg-marfil border-b border-linea" : "absolute inset-x-0 top-0 z-20"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl tracking-[0.35em] uppercase text-tinta"
        >
          Étnika
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/#coleccion"
            className="text-[11px] tracking-[0.25em] uppercase text-tinta/70 hover:text-tinta transition-colors"
          >
            Colección
          </Link>
          <Link
            href="/#contacto"
            className="hidden sm:block text-[11px] tracking-[0.25em] uppercase text-tinta/70 hover:text-tinta transition-colors"
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}
