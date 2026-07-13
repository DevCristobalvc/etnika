import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header solid />
      <main className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-piedra mb-4">
            Página no encontrada
          </p>
          <h1 className="font-display font-light text-5xl md:text-6xl">
            Esta pieza no existe
          </h1>
          <p className="mt-6 text-sm font-light text-tinta/60 max-w-sm mx-auto leading-relaxed">
            Puede que el producto ya no esté disponible o que el enlace haya
            cambiado.
          </p>
          <Link
            href="/#coleccion"
            className="inline-block mt-10 border border-tinta px-10 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-tinta hover:text-marfil transition-colors duration-300"
          >
            Ver la colección
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
