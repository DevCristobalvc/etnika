"use client";

import { useState, useTransition } from "react";
import { crearPedidoManual } from "@/app/admin/actions";
import { formatPrecio } from "@/lib/format";
import type { Producto, EstadoPedido } from "@/lib/types";

const ESTADOS: { valor: EstadoPedido; label: string }[] = [
  { valor: "pendiente", label: "Pendiente" },
  { valor: "en_preparacion", label: "En preparación" },
  { valor: "entregado", label: "Entregado" },
];

export default function PedidoManualForm({ productos }: { productos: Producto[] }) {
  const [productoId, setProductoId] = useState("");
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [ubicacion, setUbicacion] = useState("");
  const [notas, setNotas] = useState("");
  const [estado, setEstado] = useState<EstadoPedido>("pendiente");
  const [error, setError] = useState("");
  const [pendiente, startTransition] = useTransition();

  const producto = productos.find((p) => p.id === productoId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await crearPedidoManual({
        productoId,
        nombre,
        whatsapp,
        cantidad,
        ubicacion,
        notas,
        estado,
      });
      if (res?.error) setError(res.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-2">
          Producto
        </label>
        <select
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
          className="w-full bg-transparent border border-linea px-3 py-3.5 text-sm font-light focus:outline-none focus:border-tinta"
        >
          <option value="">Seleccionar producto…</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} — {formatPrecio(p.precio)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
          Nombre de la clienta
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

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-3">
            Cantidad
          </label>
          <div className="inline-flex items-center border border-linea">
            <button
              type="button"
              onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              className="px-5 py-3 text-lg font-light hover:bg-crema transition-colors"
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="w-12 text-center text-sm">{cantidad}</span>
            <button
              type="button"
              onClick={() => setCantidad((c) => c + 1)}
              className="px-5 py-3 text-lg font-light hover:bg-crema transition-colors"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-2">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoPedido)}
            className="w-full bg-transparent border border-linea px-3 py-3.5 text-sm font-light focus:outline-none focus:border-tinta"
          >
            {ESTADOS.map((s) => (
              <option key={s.valor} value={s.valor}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
          Dirección de entrega (opcional)
        </label>
        <input
          type="text"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="input-line"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
          Notas (opcional)
        </label>
        <textarea
          rows={2}
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="input-line resize-none"
        />
      </div>

      {producto && (
        <p className="text-sm font-light text-tinta/70">
          Total:{" "}
          <span className="text-tinta">{formatPrecio(producto.precio * cantidad)}</span>
        </p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pendiente}
        className="w-full bg-tinta text-marfil py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-carbon transition-colors disabled:opacity-50"
      >
        {pendiente ? "Guardando…" : "Registrar pedido"}
      </button>
    </form>
  );
}
