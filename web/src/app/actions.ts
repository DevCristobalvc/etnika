"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export type ResultadoPedido =
  | { ok: true; pedidoId: string }
  | { ok: false; error: string };

export async function crearPedido(
  productoId: string,
  datos: {
    nombre: string;
    whatsapp: string;
    ubicacion: string;
    lat?: number | null;
    lng?: number | null;
    cantidad: number;
    notas?: string;
    respuestas?: Record<string, string>;
  }
): Promise<ResultadoPedido> {
  const nombre = datos.nombre?.trim();
  const whatsapp = datos.whatsapp?.replace(/[^\d+]/g, "");

  if (!nombre || !whatsapp || !datos.ubicacion?.trim()) {
    return { ok: false, error: "Completa los campos obligatorios." };
  }
  if (!datos.cantidad || datos.cantidad < 1) {
    return { ok: false, error: "La cantidad debe ser al menos 1." };
  }

  // Buscar o crear cliente por WhatsApp
  const { data: existente } = await supabaseAdmin
    .from("clientes")
    .select("id, direcciones")
    .eq("whatsapp", whatsapp)
    .maybeSingle();

  let clienteId: string;
  if (existente) {
    clienteId = existente.id;
    const direcciones: string[] = existente.direcciones ?? [];
    if (!direcciones.includes(datos.ubicacion)) {
      direcciones.push(datos.ubicacion);
    }
    await supabaseAdmin
      .from("clientes")
      .update({ nombre, direcciones })
      .eq("id", clienteId);
  } else {
    const { data: nuevo, error } = await supabaseAdmin
      .from("clientes")
      .insert({ nombre, whatsapp, direcciones: [datos.ubicacion] })
      .select("id")
      .single();
    if (error || !nuevo) {
      return { ok: false, error: "No se pudo registrar el cliente." };
    }
    clienteId = nuevo.id;
  }

  const { data: pedido, error: errPedido } = await supabaseAdmin
    .from("pedidos")
    .insert({
      cliente_id: clienteId,
      producto_id: productoId,
      cantidad: datos.cantidad,
      ubicacion_texto: datos.ubicacion,
      ubicacion_lat: datos.lat ?? null,
      ubicacion_lng: datos.lng ?? null,
      notas: datos.notas || null,
      respuestas: datos.respuestas ?? {},
    })
    .select("id")
    .single();

  if (errPedido || !pedido) {
    return { ok: false, error: "No se pudo guardar el pedido. Intenta de nuevo." };
  }

  return { ok: true, pedidoId: pedido.id };
}
