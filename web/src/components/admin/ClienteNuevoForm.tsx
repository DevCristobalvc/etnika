"use client";

import { useState, useTransition } from "react";
import { crearCliente } from "@/app/admin/actions";

export default function ClienteNuevoForm() {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [error, setError] = useState("");
  const [pendiente, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await crearCliente({ nombre, whatsapp, direccion, notas });
      if (res?.error) setError(res.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
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
          placeholder="300 000 0000"
          className="input-line"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
          Dirección (opcional)
        </label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="input-line"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
          Notas internas (opcional)
        </label>
        <textarea
          rows={2}
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="input-line resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pendiente}
        className="w-full bg-tinta text-marfil py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-carbon transition-colors disabled:opacity-50"
      >
        {pendiente ? "Guardando…" : "Crear clienta"}
      </button>
    </form>
  );
}
