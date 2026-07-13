"use client";

import { useState, useTransition } from "react";
import { guardarConfiguracion } from "@/app/admin/actions";
import type { FilaConfig } from "@/app/admin/(panel)/ajustes/page";

export default function EditorAjustes({ filas }: { filas: FilaConfig[] }) {
  const [valores, setValores] = useState<Record<string, string>>(
    Object.fromEntries(filas.map((f) => [f.clave, f.valor]))
  );
  const [tocado, setTocado] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [pendiente, startTransition] = useTransition();

  const setValor = (clave: string, v: string) => {
    setValores((prev) => ({ ...prev, [clave]: v }));
    setTocado(true);
    setGuardado(false);
  };

  const guardar = () =>
    startTransition(async () => {
      await guardarConfiguracion(valores);
      setTocado(false);
      setGuardado(true);
    });

  return (
    <div className="space-y-7">
      {filas.map((f) => (
        <div key={f.clave}>
          <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
            {f.etiqueta}
          </label>
          {f.tipo === "textarea" ? (
            <textarea
              rows={f.clave === "historia" ? 10 : 3}
              value={valores[f.clave] ?? ""}
              onChange={(e) => setValor(f.clave, e.target.value)}
              className="input-line resize-none border border-linea px-3 py-3 text-sm leading-relaxed"
            />
          ) : (
            <input
              type={f.tipo}
              value={valores[f.clave] ?? ""}
              onChange={(e) => setValor(f.clave, e.target.value)}
              className="input-line"
            />
          )}
        </div>
      ))}

      <div className="sticky bottom-24 pt-2">
        <button
          onClick={guardar}
          disabled={pendiente || !tocado}
          className="w-full bg-tinta text-marfil py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-carbon transition-colors disabled:opacity-50 shadow-lg"
        >
          {pendiente ? "Publicando…" : guardado ? "Cambios publicados" : "Guardar y publicar"}
        </button>
      </div>
    </div>
  );
}
