import { supabaseAdmin } from "@/lib/supabase-admin";
import { verificarWebhook } from "@/lib/bold";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const firma = request.headers.get("x-bold-signature");

  if (!verificarWebhook(rawBody, firma)) {
    return new Response("Firma inválida", { status: 401 });
  }

  let evento: {
    type?: string;
    data?: {
      payment_id?: string;
      payment_method?: string;
      metadata?: { reference?: string };
    };
  };
  try {
    evento = JSON.parse(rawBody);
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }

  const pedidoId = evento.data?.metadata?.reference;
  const paymentId = evento.data?.payment_id ?? null;
  const metodo = evento.data?.payment_method ?? null;

  if (pedidoId) {
    if (evento.type === "SALE_APPROVED") {
      await supabaseAdmin
        .from("pedidos")
        .update({
          pago_estado: "pagado",
          bold_payment_id: paymentId,
          metodo_pago: metodo,
          estado: "en_preparacion",
        })
        .eq("id", pedidoId);
    } else if (evento.type === "SALE_REJECTED") {
      await supabaseAdmin
        .from("pedidos")
        .update({ pago_estado: "rechazado", bold_payment_id: paymentId })
        .eq("id", pedidoId);
    }
  }

  // Bold exige respuesta 200 en menos de 2 segundos.
  return new Response("ok", { status: 200 });
}
