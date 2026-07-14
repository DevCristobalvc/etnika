import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { obtenerConfig, waLink } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function PagoResultadoPage({
  params,
}: {
  params: Promise<{ pedidoId: string }>;
}) {
  const { pedidoId } = await params;

  const [{ data: pedido }, config] = await Promise.all([
    supabaseAdmin
      .from("pedidos")
      .select("pago_estado, producto:productos(nombre)")
      .eq("id", pedidoId)
      .maybeSingle(),
    obtenerConfig(),
  ]);

  const estado = pedido?.pago_estado ?? "no_pagado";
  const pagado = estado === "pagado";
  const rechazado = estado === "rechazado";

  return (
    <>
      <Header solid />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          {pagado ? (
            <>
              <p className="text-[11px] tracking-[0.4em] uppercase text-piedra mb-4">
                Pago confirmado
              </p>
              <h1 className="font-display font-light text-4xl md:text-5xl">
                ¡Gracias por tu compra!
              </h1>
              <p className="mt-6 text-sm font-light text-tinta/70 leading-relaxed">
                Tu pago fue procesado con éxito. Erika ya está preparando tu
                pedido y te contactará por WhatsApp para coordinar la entrega.
              </p>
            </>
          ) : rechazado ? (
            <>
              <p className="text-[11px] tracking-[0.4em] uppercase text-piedra mb-4">
                Pago no completado
              </p>
              <h1 className="font-display font-light text-4xl md:text-5xl">
                El pago no se procesó
              </h1>
              <p className="mt-6 text-sm font-light text-tinta/70 leading-relaxed">
                No te preocupes, no se hizo ningún cobro. Puedes intentar de
                nuevo o escribirle a Erika para coordinar tu pedido.
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] tracking-[0.4em] uppercase text-piedra mb-4">
                Procesando
              </p>
              <h1 className="font-display font-light text-4xl md:text-5xl">
                Estamos confirmando tu pago
              </h1>
              <p className="mt-6 text-sm font-light text-tinta/70 leading-relaxed">
                En unos segundos verás la confirmación. Si ya pagaste, tu pedido
                quedó registrado y Erika te contactará.
              </p>
            </>
          )}

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/coleccion"
              className="border border-tinta px-8 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-tinta hover:text-marfil transition-colors"
            >
              Seguir viendo
            </Link>
            <a
              href={waLink(config.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-tinta text-marfil px-8 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-carbon transition-colors"
            >
              Escribir a Erika
            </a>
          </div>
        </div>
      </main>
      <Footer config={config} />
    </>
  );
}
