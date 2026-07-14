import Link from "next/link";
import ClienteNuevoForm from "@/components/admin/ClienteNuevoForm";

export default function NuevoClientePage() {
  return (
    <>
      <Link
        href="/admin/clientes"
        className="text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors"
      >
        ← Clientes
      </Link>
      <h1 className="font-display font-light text-3xl mt-4 mb-2">Nueva clienta</h1>
      <p className="text-sm font-light text-tinta/60 mb-8">
        El número de WhatsApp es el identificador único de cada clienta.
      </p>
      <ClienteNuevoForm />
    </>
  );
}
