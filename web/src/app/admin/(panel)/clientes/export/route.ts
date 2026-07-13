import { supabaseAdmin } from "@/lib/supabase-admin";
import { aCSV, respuestaCSV, sesionAdminValida } from "@/lib/csv";

type ClienteExport = {
  nombre: string;
  whatsapp: string;
  direcciones: string[];
  notas: string | null;
  created_at: string;
  pedidos: { count: number }[];
};

export async function GET() {
  if (!(await sesionAdminValida())) {
    return new Response("No autorizado", { status: 401 });
  }

  const { data } = await supabaseAdmin
    .from("clientes")
    .select("nombre, whatsapp, direcciones, notas, created_at, pedidos(count)")
    .order("created_at", { ascending: false });

  const clientes = (data ?? []) as ClienteExport[];

  const csv = aCSV(
    ["Nombre", "WhatsApp", "Pedidos", "Direcciones", "Notas", "Registrado"],
    clientes.map((c) => [
      c.nombre,
      c.whatsapp,
      c.pedidos?.[0]?.count ?? 0,
      (c.direcciones ?? []).join(" | "),
      c.notas ?? "",
      new Date(c.created_at).toLocaleDateString("es-CO"),
    ])
  );

  const hoy = new Date().toISOString().slice(0, 10);
  return respuestaCSV(csv, `etnika-clientes-${hoy}.csv`);
}
