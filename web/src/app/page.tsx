import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { obtenerConfig } from "@/lib/config";
import { nombreCategoria } from "@/lib/format";
import type { Producto } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  const [{ data }, config] = await Promise.all([
    supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("created_at", { ascending: true }),
    obtenerConfig(),
  ]);

  const productos = (data ?? []) as Producto[];
  const categorias = [...new Set(productos.map((p) => p.categoria))];
  const parrafos = (config.historia ?? "").split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      <Header onDark />

      {/* Hero — portada de la boutique */}
      <section className="relative min-h-svh flex items-end">
        <Image
          src="/portada.jpg"
          alt="Erika en la boutique Étnika"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_25%] md:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tinta/80 via-tinta/25 to-tinta/30" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 md:pb-28">
          <div className="max-w-xl animate-fade-up">
            <p className="text-[11px] tracking-[0.45em] uppercase text-marfil/80 mb-5">
              {config.tagline ?? "Accesorios y Marroquinería"}
            </p>
            <h1 className="font-display font-light text-6xl md:text-8xl tracking-[0.12em] uppercase leading-none text-marfil">
              Étnika
            </h1>
            <p className="mt-6 max-w-md text-sm md:text-base font-light leading-relaxed text-marfil/85">
              {config.frase_hero ??
                "Accesorios artesanales que cuentan historias y hacen brillar tu esencia."}
            </p>
            <Link
              href="#coleccion"
              className="inline-block mt-10 border border-marfil/80 px-10 py-4 text-[11px] tracking-[0.3em] uppercase text-marfil hover:bg-marfil hover:text-tinta transition-colors duration-300"
            >
              Ver colección
            </Link>
          </div>
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

      {/* Nosotras — historia de la marca */}
      <section id="nosotras" className="bg-crema">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 grid md:grid-cols-[1fr_2fr] gap-10 md:gap-20">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase text-piedra mb-3">
              La marca
            </p>
            <h2 className="font-display font-light text-4xl md:text-5xl">Nosotras</h2>
            <div className="mt-8 hidden md:block">
              <Image
                src="/logo.jpg"
                alt="Étnika Moda — Accesorios y Marroquinería"
                width={280}
                height={187}
                className="mix-blend-multiply"
              />
            </div>
          </div>
          <div className="space-y-6">
            {parrafos.length > 0 ? (
              parrafos.map((texto, i) =>
                i === 0 ? (
                  <p
                    key={i}
                    className="font-display italic font-light text-2xl md:text-3xl leading-snug text-tinta/85"
                  >
                    {texto}
                  </p>
                ) : (
                  <p key={i} className="text-sm md:text-base font-light leading-loose text-tinta/70">
                    {texto}
                  </p>
                )
              )
            ) : (
              <p className="font-display italic font-light text-2xl leading-snug text-tinta/85">
                Accesorios artesanales que cuentan historias y hacen brillar tu esencia.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer config={config} />
    </>
  );
}
