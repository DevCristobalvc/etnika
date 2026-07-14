"use client";

import { useState, useTransition } from "react";
import { actualizarCliente, eliminarCliente } from "@/app/admin/actions";
import type { Cliente } from "@/lib/types";

export default function ClienteEditar({ cliente }: { cliente: Cliente }) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(cliente.nombre);
  const [whatsapp, setWhatsapp] = useState(cliente.whatsapp);
  const [direcciones, setDirecciones] = useState<string[]>(
    cliente.direcciones?.length ? cliente.direcciones : [""]
  );
  const [error, setError] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [pendiente, startTransition] = useTransition();

  const guardar = () => {
    setError("");
    startTransition(async () => {
      const res = await actualizarCliente(cliente.id, { nombre, whatsapp, direcciones });
      if (res?.error) {
        setError(res.error);
      } else {
        setEditando(false);
      }
    });
  };

  if (!editando) {
    return (
      <div className="mb-8">
        {cliente.direcciones?.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.25em] uppercase text-piedra mb-2">
              Direcciones
            </p>
            <ul className="space-y-1 text-sm font-light">
              {cliente.direcciones.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => setEditando(true)}
          className="text-[10px] tracking-[0.2em] uppercase underline underline-offset-4 text-piedra hover:text-tinta transition-colors"
        >
          Editar datos
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 border border-linea bg-white/60 px-5 py-6 space-y-6">
      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
          Nombre
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input-line"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
          WhatsApp
        </label>
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="input-line"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-2">
          Direcciones
        </label>
        <div className="space-y-3">
          {direcciones.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={d}
                onChange={(e) =>
                  setDirecciones((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))
                }
                className="input-line"
              />
              <button
                type="button"
                onClick={() => setDirecciones((prev) => prev.filter((_, j) => j !== i))}
                className="text-piedra hover:text-red-700 text-lg font-light shrink-0"
                aria-label="Quitar dirección"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDirecciones((prev) => [...prev, ""])}
          className="mt-3 text-[10px] tracking-[0.2em] uppercase underline underline-offset-4 text-piedra hover:text-tinta transition-colors"
        >
          Agregar dirección
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={guardar}
          disabled={pendiente}
          className="flex-1 bg-tinta text-marfil py-3.5 text-[10px] tracking-[0.25em] uppercase hover:bg-carbon transition-colors disabled:opacity-50"
        >
          {pendiente ? "Guardando…" : "Guardar"}
        </button>
        <button
          onClick={() => setEditando(false)}
          className="px-5 py-3.5 border border-linea text-[10px] tracking-[0.25em] uppercase text-piedra hover:border-tinta hover:text-tinta transition-colors"
        >
          Cancelar
        </button>
      </div>

      <div className="text-center pt-1">
        {confirmando ? (
          <span className="flex items-center justify-center gap-4">
            <button
              onClick={() => startTransition(() => eliminarCliente(cliente.id))}
              disabled={pendiente}
              className="text-[10px] tracking-[0.15em] uppercase text-red-700 underline underline-offset-4"
            >
              Confirmar eliminación
            </button>
            <button
              onClick={() => setConfirmando(false)}
              className="text-[10px] tracking-[0.15em] uppercase text-piedra"
            >
              Cancelar
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="text-[10px] tracking-[0.15em] uppercase text-piedra hover:text-red-700 transition-colors"
          >
            Eliminar clienta
          </button>
        )}
      </div>
    </div>
  );
}
