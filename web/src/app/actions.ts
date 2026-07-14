"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { normalizarWhatsapp } from "@/lib/format";
import {
  BOLD_IDENTITY_KEY,
  BOLD_MONEDA,
  aCentavos,
  firmaIntegridad,
} from "@/lib/bold";

export type DatosPagoBold =
  | {
      ok: true;
      orderId: string;
      montoCentavos: number;
      moneda: string;
      firma: string;
      apiKey: string;
      descripcion: string;
      urlRedireccion: string;
    }
  | { ok: false; error: string };

export async function datosPagoBold(pedidoId: string): Promise<DatosPagoBold> {
  const { data: pedido } = await supabaseAdmin
    .from("pedidos")
    .select("id, cantidad, producto:productos(nombre, precio)")
    .eq("id", pedidoId)
    .maybeSingle();

  const productoRaw = (pedido?.producto ?? null) as unknown;
  const producto = (
    Array.isArray(productoRaw) ? productoRaw[0] : productoRaw
  ) as { nombre: string; precio: number } | null;
  if (!pedido || !producto) {
    return { ok: false, error: "No se encontró el pedido." };
  }
  if (!BOLD_IDENTITY_KEY) {
    return { ok: false, error: "Pagos en línea no disponibles por ahora." };
  }

  const total = producto.precio * pedido.cantidad;
  const montoCentavos = aCentavos(total);
  const firma = firmaIntegridad(pedido.id, montoCentavos);

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://etnikamoda.com";

  return {
    ok: true,
    orderId: pedido.id,
    montoCentavos,
    moneda: BOLD_MONEDA,
    firma,
    apiKey: BOLD_IDENTITY_KEY,
    descripcion: `${producto.nombre} x${pedido.cantidad}`.slice(0, 100),
    urlRedireccion: `${base}/pago/${pedido.id}`,
  };
}

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
  const whatsapp = normalizarWhatsapp(datos.whatsapp);

  if (!nombre || !datos.ubicacion?.trim()) {
    return { ok: false, error: "Completa los campos obligatorios." };
  }
  if (whatsapp.length < 12) {
    return { ok: false, error: "Revisa el número de WhatsApp (10 dígitos)." };
  }
  if (!datos.cantidad || datos.cantidad < 1) {
    return { ok: false, error: "La cantidad debe ser al menos 1." };
  }

  // Control de stock: null = sin límite
  const { data: prod } = await supabaseAdmin
    .from("productos")
    .select("stock")
    .eq("id", productoId)
    .maybeSingle();

  if (prod && prod.stock !== null) {
    if (prod.stock === 0) {
      return { ok: false, error: "Esta pieza está agotada." };
    }
    if (datos.cantidad > prod.stock) {
      return {
        ok: false,
        error: `Solo ${prod.stock === 1 ? "queda 1 unidad" : `quedan ${prod.stock} unidades`} disponibles.`,
      };
    }
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

  if (prod && prod.stock !== null) {
    await supabaseAdmin
      .from("productos")
      .update({ stock: Math.max(0, prod.stock - datos.cantidad) })
      .eq("id", productoId);
  }

  return { ok: true, pedidoId: pedido.id };
}
