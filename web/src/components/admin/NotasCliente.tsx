"use client";

import { useState, useTransition } from "react";
import { guardarNotasCliente } from "@/app/admin/actions";

export default function NotasCliente({
  clienteId,
  notasIniciales,
}: {
  clienteId: string;
  notasIniciales: string;
}) {
  const [notas, setNotas] = useState(notasIniciales);
  const [guardado, setGuardado] = useState(false);
  const [pendiente, startTransition] = useTransition();

  return (
    <div>
      <textarea
        rows={3}
        value={notas}
        onChange={(e) => {
          setNotas(e.target.value);
          setGuardado(false);
        }}
        placeholder="Notas privadas sobre esta clienta…"
        className="input-line resize-none border border-linea px-3 py-3"
      />
      <button
        disabled={pendiente || guardado}
        onClick={() =>
          startTransition(async () => {
            await guardarNotasCliente(clienteId, notas);
            setGuardado(true);
          })
        }
        className="mt-2 text-[10px] tracking-[0.2em] uppercase underline underline-offset-4 text-piedra hover:text-tinta transition-colors disabled:opacity-50"
      >
        {pendiente ? "Guardando…" : guardado ? "Guardado" : "Guardar notas"}
      </button>
    </div>
  );
}
