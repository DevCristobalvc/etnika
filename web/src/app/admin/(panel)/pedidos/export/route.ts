import { supabaseAdmin } from "@/lib/supabase-admin";
import { aCSV, respuestaCSV, sesionAdminValida } from "@/lib/csv";
import type { Pedido } from "@/lib/types";

export async function GET() {
  if (!(await sesionAdminValida())) {
    return new Response("No autorizado", { status: 401 });
  }

  const { data } = await supabaseAdmin
    .from("pedidos")
    .select("*, cliente:clientes(*), producto:productos(*)")
    .order("created_at", { ascending: false });

  const pedidos = (data ?? []) as Pedido[];

  const csv = aCSV(
    [
      "Fecha",
      "Estado",
      "Cliente",
      "WhatsApp",
      "Producto",
      "Cantidad",
      "Precio unitario",
      "Total",
      "Ubicación",
      "Notas",
      "Respuestas adicionales",
    ],
    pedidos.map((p) => [
      new Date(p.created_at).toLocaleString("es-CO"),
      p.estado.replace("_", " "),
      p.cliente?.nombre ?? "",
      p.cliente?.whatsapp ?? "",
      p.producto?.nombre ?? "",
      p.cantidad,
      p.producto?.precio ?? "",
      p.producto ? p.producto.precio * p.cantidad : "",
      p.ubicacion_texto ?? "",
      p.notas ?? "",
      Object.entries(p.respuestas ?? {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | "),
    ])
  );

  const hoy = new Date().toISOString().slice(0, 10);
  return respuestaCSV(csv, `etnika-pedidos-${hoy}.csv`);
}
