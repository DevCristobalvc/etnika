import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import EditorCategorias from "@/components/admin/EditorCategorias";
import type { Categoria } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const [{ data: cats }, { data: prods }] = await Promise.all([
    supabaseAdmin.from("categorias").select("*").order("orden", { ascending: true }),
    supabaseAdmin.from("productos").select("categoria"),
  ]);

  const conteos: Record<string, number> = {};
  (prods ?? []).forEach((p: { categoria: string }) => {
    conteos[p.categoria] = (conteos[p.categoria] ?? 0) + 1;
  });

  return (
    <>
      <Link
        href="/admin/productos"
        className="text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors"
      >
        ← Productos
      </Link>
      <h1 className="font-display font-light text-3xl mt-4 mb-2">Categorías</h1>
      <p className="text-sm font-light text-tinta/60 mb-8">
        Organiza la colección. Una categoría solo puede eliminarse si no tiene
        productos.
      </p>
      <EditorCategorias categorias={(cats ?? []) as Categoria[]} conteos={conteos} />
    </>
  );
}
