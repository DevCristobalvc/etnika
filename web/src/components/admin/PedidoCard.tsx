"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { cambiarEstadoPedido, eliminarPedido, actualizarPedido } from "@/app/admin/actions";
import { formatPrecio, formatFecha } from "@/lib/format";
import type { Pedido, EstadoPedido } from "@/lib/types";

const ESTADOS: { valor: EstadoPedido; label: string; clase: string }[] = [
  { valor: "pendiente", label: "Pendiente", clase: "bg-[#f5e9d4] text-[#8a6d3b]" },
  { valor: "en_preparacion", label: "En preparación", clase: "bg-[#e3ebf3] text-[#3b5a7a]" },
  { valor: "entregado", label: "Entregado", clase: "bg-[#e5efe2] text-[#4a6d45]" },
  { valor: "cancelado", label: "Cancelado", clase: "bg-[#f3e3e3] text-[#8a4444]" },
];

export default function PedidoCard({ pedido }: { pedido: Pedido }) {
  const [abierto, setAbierto] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [cantidad, setCantidad] = useState(pedido.cantidad);
  const [ubicacion, setUbicacion] = useState(pedido.ubicacion_texto ?? "");
  const [notas, setNotas] = useState(pedido.notas ?? "");
  const [error, setError] = useState("");
  const [pendiente, startTransition] = useTransition();

  const estadoActual = ESTADOS.find((e) => e.valor === pedido.estado) ?? ESTADOS[0];
  const wa = pedido.cliente?.whatsapp?.replace(/[^\d]/g, "");

  const guardarEdicion = () => {
    setError("");
    startTransition(async () => {
      const res = await actualizarPedido(pedido.id, { cantidad, ubicacion, notas });
      if (res?.error) {
        setError(res.error);
      } else {
        setEditando(false);
      }
    });
  };

  return (
    <div className="border border-linea bg-white/60">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center gap-4"
      >
        {pedido.producto?.imagen && (
          <div className="relative h-14 w-14 shrink-0 bg-crema overflow-hidden">
            <Image
              src={pedido.producto.imagen}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-display text-base leading-tight truncate">
            {pedido.producto?.nombre ?? "Producto eliminado"}
          </p>
          <p className="text-xs text-piedra mt-0.5 truncate">
            {pedido.cliente?.nombre ?? "—"} · {formatFecha(pedido.created_at)}
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span
            className={`px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase ${estadoActual.clase}`}
          >
            {estadoActual.label}
          </span>
          {pedido.pago_estado === "pagado" && (
            <span className="px-2 py-1 text-[8px] tracking-[0.15em] uppercase bg-[#e5efe2] text-[#4a6d45]">
              Pagado{pedido.metodo_pago ? ` · ${pedido.metodo_pago}` : ""}
            </span>
          )}
          {pedido.pago_estado === "rechazado" && (
            <span className="px-2 py-1 text-[8px] tracking-[0.15em] uppercase bg-[#f3e3e3] text-[#8a4444]">
              Pago rechazado
            </span>
          )}
        </div>
      </button>

      {abierto && (
        <div className="border-t border-linea px-5 py-5 space-y-4 text-sm">
          {editando ? (
            <div className="space-y-4">
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-piedra mb-2">Cantidad</p>
                <div className="inline-flex items-center border border-linea">
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    className="px-4 py-2 text-lg font-light hover:bg-crema transition-colors"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm">{cantidad}</span>
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => c + 1)}
                    className="px-4 py-2 text-lg font-light hover:bg-crema transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-piedra mb-1">Entrega</p>
                <input
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="input-line"
                />
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-piedra mb-1">Notas</p>
                <textarea
                  rows={2}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="input-line resize-none"
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex items-center gap-3">
                <button
                  onClick={guardarEdicion}
                  disabled={pendiente}
                  className="flex-1 bg-tinta text-marfil py-3 text-[10px] tracking-[0.25em] uppercase hover:bg-carbon transition-colors disabled:opacity-50"
                >
                  {pendiente ? "Guardando…" : "Guardar"}
                </button>
                <button
                  onClick={() => setEditando(false)}
                  className="px-4 py-3 border border-linea text-[10px] tracking-[0.25em] uppercase text-piedra hover:border-tinta hover:text-tinta transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-piedra mb-1">Cantidad</p>
                  <p>{pedido.cantidad}</p>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-piedra mb-1">Total</p>
                  <p>
                    {pedido.producto
                      ? formatPrecio(pedido.producto.precio * pedido.cantidad)
                      : "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-piedra mb-1">Entrega</p>
                <p className="font-light">{pedido.ubicacion_texto ?? "—"}</p>
                {pedido.ubicacion_lat && pedido.ubicacion_lng && (
                  <a
                    href={`https://www.google.com/maps?q=${pedido.ubicacion_lat},${pedido.ubicacion_lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] tracking-[0.15em] uppercase underline underline-offset-4 text-piedra hover:text-tinta"
                  >
                    Ver en mapa
                  </a>
                )}
              </div>

              {pedido.notas && (
                <div>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-piedra mb-1">Notas</p>
                  <p className="font-light">{pedido.notas}</p>
                </div>
              )}
            </>
          )}

          {pedido.respuestas &&
            Object.entries(pedido.respuestas).map(([pregunta, respuesta]) => (
              <div key={pregunta}>
                <p className="text-[9px] tracking-[0.2em] uppercase text-piedra mb-1">
                  {pregunta}
                </p>
                <p className="font-light">{respuesta}</p>
              </div>
            ))}

          <div>
            <p className="text-[9px] tracking-[0.2em] uppercase text-piedra mb-2">Estado</p>
            <div className="flex flex-wrap gap-2">
              {ESTADOS.map((e) => (
                <button
                  key={e.valor}
                  disabled={pendiente || e.valor === pedido.estado}
                  onClick={() =>
                    startTransition(() => cambiarEstadoPedido(pedido.id, e.valor))
                  }
                  className={`px-3 py-2 text-[9px] tracking-[0.15em] uppercase border transition-colors ${
                    e.valor === pedido.estado
                      ? "bg-tinta text-marfil border-tinta"
                      : "border-linea text-piedra hover:border-tinta hover:text-tinta"
                  } disabled:opacity-60`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-linea">
            {wa ? (
              <a
                href={`https://wa.me/${wa.startsWith("57") ? wa : "57" + wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-tinta text-marfil px-5 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-carbon transition-colors"
              >
                WhatsApp
              </a>
            ) : (
              <span />
            )}

            {confirmando ? (
              <span className="flex items-center gap-3">
                <button
                  onClick={() => startTransition(() => eliminarPedido(pedido.id))}
                  disabled={pendiente}
                  className="text-[10px] tracking-[0.15em] uppercase text-red-700 underline underline-offset-4"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmando(false)}
                  className="text-[10px] tracking-[0.15em] uppercase text-piedra"
                >
                  Cancelar
                </button>
              </span>
            ) : (
              <span className="flex items-center gap-5">
                {!editando && (
                  <button
                    onClick={() => setEditando(true)}
                    className="text-[10px] tracking-[0.15em] uppercase text-piedra hover:text-tinta transition-colors underline underline-offset-4"
                  >
                    Editar
                  </button>
                )}
                <button
                  onClick={() => setConfirmando(true)}
                  className="text-[10px] tracking-[0.15em] uppercase text-piedra hover:text-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
