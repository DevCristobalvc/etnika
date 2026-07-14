import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ProductoAcciones from "@/components/admin/ProductoAcciones";
import { formatPrecio, nombreCategoria } from "@/lib/format";
import type { Producto, Categoria } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const [{ data }, { data: cats }] = await Promise.all([
    supabaseAdmin.from("productos").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("categorias").select("*").order("orden", { ascending: true }),
  ]);

  const categorias = (cats ?? []) as Categoria[];
  const etiquetas = new Map(categorias.map((c) => [c.slug, c.nombre]));
  const todos = (data ?? []) as Producto[];
  const productos = categoria ? todos.filter((p) => p.categoria === categoria) : todos;

  return (
    <>
      <div className="flex items-center justify-between mb-5 gap-3">
        <h1 className="font-display font-light text-3xl">Productos</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/categorias"
            className="border border-linea px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase text-piedra hover:border-tinta hover:text-tinta transition-colors"
          >
            Categorías
          </Link>
          <Link
            href="/admin/productos/nuevo"
            className="bg-tinta text-marfil px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-carbon transition-colors"
          >
            Nuevo
          </Link>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5">
        <Link
          href="/admin/productos"
          className={`shrink-0 px-4 py-2 text-[10px] tracking-[0.2em] uppercase border transition-colors ${
            !categoria
              ? "bg-tinta text-marfil border-tinta"
              : "border-linea text-piedra hover:border-tinta hover:text-tinta"
          }`}
        >
          Todos <span className="opacity-60">{todos.length}</span>
        </Link>
        {categorias.map((c) => {
          const n = todos.filter((p) => p.categoria === c.slug).length;
          return (
            <Link
              key={c.slug}
              href={`/admin/productos?categoria=${c.slug}`}
              className={`shrink-0 px-4 py-2 text-[10px] tracking-[0.2em] uppercase border transition-colors ${
                categoria === c.slug
                  ? "bg-tinta text-marfil border-tinta"
                  : "border-linea text-piedra hover:border-tinta hover:text-tinta"
              }`}
            >
              {c.nombre} <span className="opacity-60">{n}</span>
            </Link>
          );
        })}
      </div>

      <div className="space-y-3 mt-2">
        {productos.map((p) => (
          <div
            key={p.id}
            className={`border border-linea bg-white/60 px-4 py-4 flex items-center gap-4 ${
              !p.activo ? "opacity-55" : ""
            }`}
          >
            <div className="relative h-16 w-16 shrink-0 bg-crema overflow-hidden">
              {p.imagen && (
                <Image src={p.imagen} alt="" fill sizes="64px" className="object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base leading-tight truncate">{p.nombre}</p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-piedra mt-1">
                {etiquetas.get(p.categoria) ?? nombreCategoria(p.categoria)}
              </p>
              <p className="text-xs text-tinta/70 mt-0.5">
                {formatPrecio(p.precio)}
                {p.stock !== null && (
                  <span
                    className={`ml-3 text-[10px] tracking-[0.1em] uppercase ${
                      p.stock === 0 ? "text-red-700" : "text-piedra"
                    }`}
                  >
                    {p.stock === 0 ? "Agotado" : `Stock: ${p.stock}`}
                  </span>
                )}
              </p>
            </div>
            <ProductoAcciones id={p.id} activo={p.activo} stock={p.stock} />
          </div>
        ))}
      </div>
    </>
  );
}
