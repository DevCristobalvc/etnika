import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type ClienteConPedidos = {
  id: string;
  nombre: string;
  whatsapp: string;
  created_at: string;
  pedidos: { count: number }[];
};

export default async function ClientesPage() {
  const { data } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, whatsapp, created_at, pedidos(count)")
    .order("created_at", { ascending: false });

  const clientes = (data ?? []) as ClienteConPedidos[];

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="font-display font-light text-3xl">Clientes</h1>
        <div className="flex items-center gap-2">
          {clientes.length > 0 && (
            <a
              href="/admin/clientes/export"
              className="border border-linea px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase text-piedra hover:border-tinta hover:text-tinta transition-colors"
            >
              CSV
            </a>
          )}
          <Link
            href="/admin/clientes/nuevo"
            className="bg-tinta text-marfil px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-carbon transition-colors"
          >
            Nueva
          </Link>
        </div>
      </div>

      {clientes.length === 0 ? (
        <div className="border border-linea bg-crema/40 px-6 py-16 text-center">
          <p className="font-display font-light text-xl text-tinta/60">
            Aún no hay clientes registrados
          </p>
          <p className="text-xs text-piedra mt-2">
            Se crean automáticamente con cada pedido.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {clientes.map((c) => (
            <Link
              key={c.id}
              href={`/admin/clientes/${c.id}`}
              className="block border border-linea bg-white/60 px-5 py-4 hover:border-tinta transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display text-base leading-tight truncate">{c.nombre}</p>
                  <p className="text-xs text-piedra mt-1">{c.whatsapp}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm">{c.pedidos?.[0]?.count ?? 0}</p>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-piedra">
                    pedidos
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
