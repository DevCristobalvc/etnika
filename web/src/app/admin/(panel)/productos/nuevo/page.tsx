import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ProductoForm from "@/components/admin/ProductoForm";
import type { Categoria } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const { data: cats } = await supabaseAdmin
    .from("categorias")
    .select("*")
    .order("orden", { ascending: true });

  return (
    <>
      <Link
        href="/admin/productos"
        className="text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors"
      >
        ← Productos
      </Link>
      <h1 className="font-display font-light text-3xl mt-4 mb-8">Nuevo producto</h1>
      <ProductoForm categorias={(cats ?? []) as Categoria[]} />
    </>
  );
}
