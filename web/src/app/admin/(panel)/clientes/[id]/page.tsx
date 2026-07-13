import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import NotasCliente from "@/components/admin/NotasCliente";
import { formatFecha, formatPrecio } from "@/lib/format";
import type { Cliente, Pedido } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: cliente }, { data: pedidos }] = await Promise.all([
    supabaseAdmin.from("clientes").select("*").eq("id", id).maybeSingle(),
    supabaseAdmin
      .from("pedidos")
      .select("*, producto:productos(*)")
      .eq("cliente_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!cliente) notFound();
  const c = cliente as Cliente;
  const historial = (pedidos ?? []) as Pedido[];
  const wa = c.whatsapp.replace(/[^\d]/g, "");

  return (
    <>
      <Link
        href="/admin/clientes"
        className="text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors"
      >
        ← Clientes
      </Link>

      <div className="mt-4 mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-light text-3xl leading-tight">{c.nombre}</h1>
          <p className="text-sm text-piedra mt-1">{c.whatsapp}</p>
        </div>
        <a
          href={`https://wa.me/${wa.startsWith("57") ? wa : "57" + wa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-tinta text-marfil px-5 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-carbon transition-colors"
        >
          WhatsApp
        </a>
      </div>

      {c.direcciones?.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.25em] uppercase text-piedra mb-2">
            Direcciones
          </p>
          <ul className="space-y-1 text-sm font-light">
            {c.direcciones.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-piedra mb-2">
          Notas internas
        </p>
        <NotasCliente clienteId={c.id} notasIniciales={c.notas ?? ""} />
      </div>

      <p className="text-[10px] tracking-[0.25em] uppercase text-piedra mb-3">
        Historial de pedidos
      </p>
      {historial.length === 0 ? (
        <p className="text-sm font-light text-tinta/60">Sin pedidos registrados.</p>
      ) : (
        <div className="space-y-3">
          {historial.map((p) => (
            <div key={p.id} className="border border-linea bg-white/60 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-sm truncate">
                  {p.producto?.nombre ?? "Producto eliminado"} × {p.cantidad}
                </p>
                <p className="text-xs text-piedra shrink-0">{formatFecha(p.created_at)}</p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-tinta/70">
                  {p.producto ? formatPrecio(p.producto.precio * p.cantidad) : "—"}
                </p>
                <p className="text-[9px] tracking-[0.15em] uppercase text-piedra">
                  {p.estado.replace("_", " ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
