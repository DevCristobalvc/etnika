import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { obtenerConfig } from "@/lib/config";
import type { Producto, Categoria } from "@/lib/types";

export const revalidate = 60;

export default async function ColeccionPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const [{ data }, { data: cats }, config] = await Promise.all([
    supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("created_at", { ascending: false }),
    supabase.from("categorias").select("*").order("orden", { ascending: true }),
    obtenerConfig(),
  ]);

  const categorias = (cats ?? []) as Categoria[];
  const etiquetas = new Map(categorias.map((c) => [c.slug, c.nombre]));
  const todos = (data ?? []) as Producto[];
  const productos = categoria ? todos.filter((p) => p.categoria === categoria) : todos;

  return (
    <>
      <Header solid />

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16 min-h-[60svh]">
        <p className="text-[11px] tracking-[0.4em] uppercase text-piedra mb-3">
          {productos.length} pieza{productos.length === 1 ? "" : "s"}
        </p>
        <h1 className="font-display font-light text-4xl md:text-5xl mb-10">
          La colección
        </h1>

        <div className="flex gap-2 overflow-x-auto pb-6 -mx-6 px-6">
          <Link
            href="/coleccion"
            className={`shrink-0 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase border transition-colors ${
              !categoria
                ? "bg-tinta text-marfil border-tinta"
                : "border-linea text-piedra hover:border-tinta hover:text-tinta"
            }`}
          >
            Todas
          </Link>
          {categorias.map((c) => (
            <Link
              key={c.slug}
              href={`/coleccion?categoria=${c.slug}`}
              className={`shrink-0 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase border transition-colors ${
                categoria === c.slug
                  ? "bg-tinta text-marfil border-tinta"
                  : "border-linea text-piedra hover:border-tinta hover:text-tinta"
              }`}
            >
              {c.nombre}
            </Link>
          ))}
        </div>

        {productos.length === 0 ? (
          <p className="py-20 text-center font-display font-light text-xl text-tinta/60">
            No hay piezas en esta categoría todavía.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-10 mt-4">
            {productos.map((p) => (
              <ProductCard
                key={p.id}
                producto={p}
                categoriaNombre={etiquetas.get(p.categoria)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer config={config} />
    </>
  );
}
