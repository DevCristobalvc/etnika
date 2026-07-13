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
      <Header />

      {/* Hero — texto editorial y portada completa, sin recortes */}
      <section className="pt-32 md:pt-40">
        <div className="mx-auto max-w-6xl px-6 text-center animate-fade-up">
          <p className="text-[11px] tracking-[0.45em] uppercase text-piedra mb-5">
            {config.tagline ?? "Accesorios y Marroquinería"}
          </p>
          <h1 className="font-display font-light text-6xl md:text-8xl tracking-[0.12em] uppercase leading-none">
            Étnika
          </h1>
          <p className="mt-6 mx-auto max-w-md text-sm md:text-base font-light leading-relaxed text-tinta/70">
            {config.frase_hero ??
              "Accesorios artesanales que cuentan historias y hacen brillar tu esencia."}
          </p>
          <Link
            href="#coleccion"
            className="inline-block mt-10 border border-tinta px-10 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-tinta hover:text-marfil transition-colors duration-300"
          >
            Ver colección
          </Link>
        </div>

        <div className="mx-auto max-w-6xl px-6 mt-14 md:mt-20">
          {/* Contenedor con el mismo aspecto de la foto: se ve entera */}
          <div className="relative w-full aspect-[1080/719] bg-crema">
            <Image
              src="/portada.jpg"
              alt="Erika en la boutique Étnika"
              fill
              priority
              sizes="(min-width: 1152px) 1104px, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 text-center text-[10px] tracking-[0.3em] uppercase text-piedra">
            Nuestra boutique · {config.ciudad ?? "Cali, Colombia"}
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
