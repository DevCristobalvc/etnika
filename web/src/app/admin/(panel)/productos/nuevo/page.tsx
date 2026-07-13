import Link from "next/link";
import ProductoForm from "@/components/admin/ProductoForm";

export default function NuevoProductoPage() {
  return (
    <>
      <Link
        href="/admin/productos"
        className="text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors"
      >
        ← Productos
      </Link>
      <h1 className="font-display font-light text-3xl mt-4 mb-8">Nuevo producto</h1>
      <ProductoForm />
    </>
  );
}
