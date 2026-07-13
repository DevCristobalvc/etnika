"use client";

import { useState, useTransition } from "react";
import { crearPedido } from "@/app/actions";
import { WHATSAPP_ERIKA } from "@/lib/format";
import type { PreguntaFormulario } from "@/lib/types";

export default function PedidoForm({
  productoId,
  preguntas,
  whatsappUrl,
}: {
  productoId: string;
  preguntas: PreguntaFormulario[];
  whatsappUrl?: string;
}) {
  const [valores, setValores] = useState<Record<string, string>>({});
  const [cantidad, setCantidad] = useState(1);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoEstado, setGeoEstado] = useState<"idle" | "buscando" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [pendiente, startTransition] = useTransition();

  const setValor = (id: string, v: string) =>
    setValores((prev) => ({ ...prev, [id]: v }));

  const usarUbicacion = () => {
    if (!navigator.geolocation) {
      setGeoEstado("error");
      return;
    }
    setGeoEstado("buscando");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoEstado("ok");
      },
      () => setGeoEstado("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // La primera pregunta de cada tipo estándar alimenta el campo fijo;
    // el resto se guarda como respuestas adicionales visibles en el admin.
    const usadas = new Set<string>();
    const primeraPorTipo = (tipo: string) => {
      const q = preguntas.find((p) => p.tipo === tipo);
      if (!q) return "";
      usadas.add(q.id);
      return valores[q.id] ?? "";
    };

    const nombre = primeraPorTipo("text");
    const whatsapp = primeraPorTipo("tel");
    const ubicacion = primeraPorTipo("map");
    const notas = primeraPorTipo("textarea");

    for (const q of preguntas) {
      if (q.obligatorio && q.tipo !== "number" && !(valores[q.id] ?? "").trim()) {
        setError(`El campo "${q.label}" es obligatorio.`);
        return;
      }
    }

    const extras: Record<string, string> = {};
    preguntas.forEach((q) => {
      if (!usadas.has(q.id) && q.tipo !== "number" && valores[q.id]) {
        extras[q.label] = valores[q.id];
      }
    });

    startTransition(async () => {
      const res = await crearPedido(productoId, {
        nombre,
        whatsapp,
        ubicacion,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        cantidad,
        notas,
        respuestas: extras,
      });
      if (res.ok) {
        setExito(true);
      } else {
        setError(res.error);
      }
    });
  };

  if (exito) {
    return (
      <div className="border border-linea bg-crema/50 px-8 py-12 text-center">
        <p className="font-display font-light text-3xl">Pedido recibido</p>
        <p className="mt-4 text-sm font-light text-tinta/70 leading-relaxed max-w-xs mx-auto">
          Erika revisará tu pedido y te contactará por WhatsApp para coordinar
          la entrega.
        </p>
        <a
          href={whatsappUrl ?? WHATSAPP_ERIKA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 bg-tinta text-marfil px-10 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-carbon transition-colors"
        >
          Escribir a Erika
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {preguntas.map((q) => {
        if (q.tipo === "number") {
          return (
            <div key={q.id}>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-3">
                {q.label}
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
          );
        }

        if (q.tipo === "map") {
          return (
            <div key={q.id}>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
                {q.label}
                {q.obligatorio && <span className="text-arena ml-1">·</span>}
              </label>
              <input
                type="text"
                className="input-line"
                placeholder="Dirección de entrega (barrio, ciudad)"
                value={valores[q.id] ?? ""}
                onChange={(e) => setValor(q.id, e.target.value)}
              />
              <button
                type="button"
                onClick={usarUbicacion}
                className="mt-3 text-[10px] tracking-[0.2em] uppercase text-piedra underline underline-offset-4 hover:text-tinta transition-colors"
              >
                {geoEstado === "buscando"
                  ? "Obteniendo ubicación…"
                  : geoEstado === "ok"
                    ? "Ubicación GPS guardada"
                    : "Compartir mi ubicación exacta"}
              </button>
            </div>
          );
        }

        if (q.tipo === "textarea") {
          return (
            <div key={q.id}>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
                {q.label}
                {q.obligatorio && <span className="text-arena ml-1">·</span>}
              </label>
              <textarea
                rows={2}
                className="input-line resize-none"
                value={valores[q.id] ?? ""}
                onChange={(e) => setValor(q.id, e.target.value)}
              />
            </div>
          );
        }

        return (
          <div key={q.id}>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
              {q.label}
              {q.obligatorio && <span className="text-arena ml-1">·</span>}
            </label>
            <input
              type={q.tipo}
              className="input-line"
              placeholder={q.tipo === "tel" ? "+57 300 000 0000" : ""}
              value={valores[q.id] ?? ""}
              onChange={(e) => setValor(q.id, e.target.value)}
            />
          </div>
        );
      })}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pendiente}
        className="w-full bg-tinta text-marfil py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-carbon transition-colors disabled:opacity-50"
      >
        {pendiente ? "Enviando…" : "Confirmar pedido"}
      </button>
    </form>
  );
}
