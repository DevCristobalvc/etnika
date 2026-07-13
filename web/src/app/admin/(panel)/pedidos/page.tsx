import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import PedidoCard from "@/components/admin/PedidoCard";
import type { Pedido, EstadoPedido } from "@/lib/types";

export const dynamic = "force-dynamic";

const FILTROS: { valor: string; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: "pendiente", label: "Pendientes" },
  { valor: "en_preparacion", label: "En preparación" },
  { valor: "entregado", label: "Entregados" },
  { valor: "cancelado", label: "Cancelados" },
];

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const filtro = estado ?? "todos";

  let query = supabaseAdmin
    .from("pedidos")
    .select("*, cliente:clientes(*), producto:productos(*)")
    .order("created_at", { ascending: false });

  if (filtro !== "todos") {
    query = query.eq("estado", filtro as EstadoPedido);
  }

  const { data } = await query;
  const pedidos = (data ?? []) as Pedido[];

  return (
    <>
      <h1 className="font-display font-light text-3xl mb-6">Pedidos</h1>

      <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5">
        {FILTROS.map((f) => (
          <Link
            key={f.valor}
            href={f.valor === "todos" ? "/admin/pedidos" : `/admin/pedidos?estado=${f.valor}`}
            className={`shrink-0 px-4 py-2 text-[10px] tracking-[0.2em] uppercase border transition-colors ${
              filtro === f.valor
                ? "bg-tinta text-marfil border-tinta"
                : "border-linea text-piedra hover:border-tinta hover:text-tinta"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {pedidos.length === 0 ? (
        <div className="border border-linea bg-crema/40 px-6 py-16 text-center mt-4">
          <p className="font-display font-light text-xl text-tinta/60">
            No hay pedidos {filtro !== "todos" ? "en este estado" : "todavía"}
          </p>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          {pedidos.map((p) => (
            <PedidoCard key={p.id} pedido={p} />
          ))}
        </div>
      )}
    </>
  );
}
