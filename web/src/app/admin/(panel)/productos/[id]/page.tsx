import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ProductoForm from "@/components/admin/ProductoForm";
import type { Producto, Categoria } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ data }, { data: cats }] = await Promise.all([
    supabaseAdmin.from("productos").select("*").eq("id", id).maybeSingle(),
    supabaseAdmin.from("categorias").select("*").order("orden", { ascending: true }),
  ]);

  if (!data) notFound();

  return (
    <>
      <Link
        href="/admin/productos"
        className="text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors"
      >
        ← Productos
      </Link>
      <h1 className="font-display font-light text-3xl mt-4 mb-8">Editar producto</h1>
      <ProductoForm
        producto={data as Producto}
        categorias={(cats ?? []) as Categoria[]}
      />
    </>
  );
}
