import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ProductoAcciones from "@/components/admin/ProductoAcciones";
import { formatPrecio, nombreCategoria } from "@/lib/format";
import type { Producto } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const { data } = await supabaseAdmin
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });

  const productos = (data ?? []) as Producto[];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-light text-3xl">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-tinta text-marfil px-5 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-carbon transition-colors"
        >
          Nuevo
        </Link>
      </div>

      <div className="space-y-3">
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
                {nombreCategoria(p.categoria)}
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
            <ProductoAcciones id={p.id} activo={p.activo} />
          </div>
        ))}
      </div>
    </>
  );
}
