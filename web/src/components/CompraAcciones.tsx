"use client";

import { useState } from "react";
import PedidoForm from "./PedidoForm";
import type { PreguntaFormulario } from "@/lib/types";

export default function CompraAcciones({
  productoId,
  preguntas,
  whatsappUrl,
}: {
  productoId: string;
  preguntas: PreguntaFormulario[];
  whatsappUrl: string;
}) {
  const [paso, setPaso] = useState<"inicial" | "menu" | "formulario">("inicial");

  if (paso === "inicial") {
    return (
      <button
        onClick={() => setPaso("menu")}
        className="w-full bg-tinta text-marfil py-5 text-[12px] tracking-[0.35em] uppercase hover:bg-carbon transition-colors"
      >
        Lo quiero
      </button>
    );
  }

  if (paso === "menu") {
    return (
      <div className="animate-fade-up space-y-4">
        <button
          onClick={() => setPaso("formulario")}
          className="w-full bg-tinta text-marfil py-5 text-[11px] tracking-[0.3em] uppercase hover:bg-carbon transition-colors"
        >
          Hacer pedido
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center border border-tinta py-5 text-[11px] tracking-[0.3em] uppercase hover:bg-tinta hover:text-marfil transition-colors duration-300"
        >
          Contactar a Erika
        </a>
        <button
          onClick={() => setPaso("inicial")}
          className="block mx-auto text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors pt-1"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[11px] tracking-[0.35em] uppercase text-piedra">
          Realizar pedido
        </h2>
        <button
          onClick={() => setPaso("menu")}
          className="text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors"
        >
          Volver
        </button>
      </div>
      <PedidoForm productoId={productoId} preguntas={preguntas} />
    </div>
  );
}
