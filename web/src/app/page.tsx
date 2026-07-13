import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { nombreCategoria } from "@/lib/format";
import type { Producto } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("created_at", { ascending: true });

  const productos = (data ?? []) as Producto[];
  const heroImg = productos.find((p) => p.categoria === "collares-multicapa") ?? productos[0];
  const categorias = [...new Set(productos.map((p) => p.categoria))];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative min-h-svh grid md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 md:px-16 pt-32 pb-16 md:py-0 bg-marfil">
          <div className="animate-fade-up">
            <p className="text-[11px] tracking-[0.4em] uppercase text-piedra mb-6">
              Moda y Diseño
            </p>
            <h1 className="font-display font-light text-6xl md:text-7xl lg:text-8xl tracking-[0.12em] uppercase leading-none">
              Étnika
            </h1>
            <p className="mt-8 max-w-sm text-sm font-light leading-relaxed text-tinta/70">
              Accesorios artesanales hechos a mano en Colombia. Piezas únicas en
              semillas naturales, para mujeres que no pasan desapercibidas.
            </p>
            <Link
              href="#coleccion"
              className="inline-block mt-12 border border-tinta px-10 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-tinta hover:text-marfil transition-colors duration-300"
            >
              Ver colección
            </Link>
          </div>
        </div>
        <div className="relative min-h-[55svh] md:min-h-svh bg-crema">
          {heroImg?.imagen && (
            <Image
              src={heroImg.imagen}
              alt={heroImg.nombre}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
      </section>

      {/* Manifiesto */}
      <section className="bg-crema">
        <div className="mx-auto max-w-3xl px-6 py-24 md:py-32 text-center">
          <p className="font-display italic font-light text-2xl md:text-4xl leading-snug text-tinta/80">
            “Cada collar nace de las manos, no de las máquinas. Lo artesanal no
            se repite: se lleva.”
          </p>
        </div>
      </section>

      {/* Colección */}
      <section id="coleccion" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase text-piedra mb-3">
              Colección actual
            </p>
            <h2 className="font-display font-light text-4xl md:text-5xl">
              La colección
            </h2>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {categorias.map((c) => (
              <span
                key={c}
                className="text-[11px] tracking-[0.25em] uppercase text-tinta/50"
              >
                {nombreCategoria(c)}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-12">
          {productos.map((p, i) => (
            <ProductCard key={p.id} producto={p} destacado={i === 0} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
