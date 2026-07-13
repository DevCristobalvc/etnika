import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompraAcciones from "@/components/CompraAcciones";
import { supabase } from "@/lib/supabase";
import { obtenerConfig, waLink } from "@/lib/config";
import { formatPrecio, nombreCategoria } from "@/lib/format";
import type { Producto, PreguntaFormulario } from "@/lib/types";

export const revalidate = 60;

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: producto }, { data: preguntas }, config] = await Promise.all([
    supabase.from("productos").select("*").eq("id", id).eq("activo", true).maybeSingle(),
    supabase
      .from("formulario_preguntas")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true }),
    obtenerConfig(),
  ]);

  if (!producto) notFound();
  const p = producto as Producto;

  const whatsappUrl = waLink(
    config.whatsapp,
    `Hola Erika, me interesa el ${p.nombre} (${formatPrecio(p.precio)}).`
  );

  return (
    <>
      <Header solid />

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <nav className="mb-10 text-[11px] tracking-[0.25em] uppercase text-piedra">
          <Link href="/" className="hover:text-tinta transition-colors">
            Inicio
          </Link>
          <span className="mx-3 text-linea">/</span>
          <Link href="/#coleccion" className="hover:text-tinta transition-colors">
            Colección
          </Link>
          <span className="mx-3 text-linea">/</span>
          <span className="text-tinta/70">{p.nombre}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div className="relative aspect-[4/5] bg-crema md:sticky md:top-10 self-start w-full">
            {p.imagen && (
              <Image
                src={p.imagen}
                alt={p.nombre}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>

          <div>
            <p className="text-[11px] tracking-[0.35em] uppercase text-piedra">
              {nombreCategoria(p.categoria)}
            </p>
            <h1 className="font-display font-light text-4xl md:text-5xl mt-3 leading-tight">
              {p.nombre}
            </h1>
            <p className="mt-4 text-lg tracking-[0.1em] text-tinta/80">
              {formatPrecio(p.precio)}
            </p>

            {p.descripcion && (
              <p className="mt-8 text-sm font-light leading-loose text-tinta/70 max-w-md">
                {p.descripcion}
              </p>
            )}

            <div className="mt-8 flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-piedra">
              <span className="h-px w-8 bg-linea" />
              Hecho a mano · Pieza única
            </div>

            <div className="mt-12 border-t border-linea pt-10">
              <CompraAcciones
                productoId={p.id}
                preguntas={(preguntas ?? []) as PreguntaFormulario[]}
                whatsappUrl={whatsappUrl}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer config={config} />
    </>
  );
}
