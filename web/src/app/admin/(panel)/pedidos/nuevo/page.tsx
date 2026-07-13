import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import PedidoManualForm from "@/components/admin/PedidoManualForm";
import type { Producto } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NuevoPedidoPage() {
  const { data } = await supabaseAdmin
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("nombre", { ascending: true });

  return (
    <>
      <Link
        href="/admin/pedidos"
        className="text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors"
      >
        ← Pedidos
      </Link>
      <h1 className="font-display font-light text-3xl mt-4 mb-2">Pedido manual</h1>
      <p className="text-sm font-light text-tinta/60 mb-8">
        Para ventas presenciales o por teléfono. El cliente se crea o actualiza
        automáticamente con su número de WhatsApp.
      </p>
      <PedidoManualForm productos={(data ?? []) as Producto[]} />
    </>
  );
}
