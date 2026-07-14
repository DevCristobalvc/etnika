"use client";

import { useEffect, useRef, useState } from "react";
import { datosPagoBold, type DatosPagoBold } from "@/app/actions";

export default function BotonBold({ pedidoId }: { pedidoId: string }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      const d: DatosPagoBold = await datosPagoBold(pedidoId);
      if (cancelado) return;
      if (!d.ok) {
        setError(d.error);
        setCargando(false);
        return;
      }
      // Inyecta el script del botón de Bold con la firma generada en servidor.
      const script = document.createElement("script");
      script.src = "https://checkout.bold.co/library/boldPaymentButton.js";
      script.setAttribute("data-bold-button", "dark-L");
      script.setAttribute("data-api-key", d.apiKey);
      script.setAttribute("data-order-id", d.orderId);
      script.setAttribute("data-amount", String(d.montoCentavos));
      script.setAttribute("data-currency", d.moneda);
      script.setAttribute("data-integrity-signature", d.firma);
      script.setAttribute("data-description", d.descripcion);
      script.setAttribute("data-redirection-url", d.urlRedireccion);
      contenedor.current?.appendChild(script);
      setCargando(false);
    })();
    return () => {
      cancelado = true;
    };
  }, [pedidoId]);

  return (
    <div>
      {cargando && (
        <p className="text-center text-[10px] tracking-[0.2em] uppercase text-piedra py-4">
          Preparando pago seguro…
        </p>
      )}
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
      <div ref={contenedor} className="flex justify-center" />
    </div>
  );
}
