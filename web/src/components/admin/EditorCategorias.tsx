"use client";

import { useState, useTransition } from "react";
import {
  crearCategoria,
  renombrarCategoria,
  eliminarCategoria,
} from "@/app/admin/actions";
import type { Categoria } from "@/lib/types";

function FilaCategoria({
  categoria,
  productos,
}: {
  categoria: Categoria;
  productos: number;
}) {
  const [nombre, setNombre] = useState(categoria.nombre);
  const [tocado, setTocado] = useState(false);
  const [error, setError] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [pendiente, startTransition] = useTransition();

  return (
    <div className="border border-linea bg-white/60 px-4 py-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[9px] tracking-[0.2em] uppercase text-piedra">
          {productos} producto{productos === 1 ? "" : "s"} · {categoria.slug}
        </span>
        {confirmando ? (
          <span className="flex items-center gap-3">
            <button
              onClick={() =>
                startTransition(async () => {
                  const res = await eliminarCategoria(categoria.slug);
                  if (res?.error) {
                    setError(res.error);
                    setConfirmando(false);
                  }
                })
              }
              disabled={pendiente}
              className="text-[9px] tracking-[0.15em] uppercase text-red-700 underline underline-offset-4"
            >
              Confirmar
            </button>
            <button
              onClick={() => setConfirmando(false)}
              className="text-[9px] tracking-[0.15em] uppercase text-piedra"
            >
              Cancelar
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="text-[9px] tracking-[0.15em] uppercase text-piedra hover:text-red-700 transition-colors"
          >
            Eliminar
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setTocado(true);
          }}
          className="input-line"
        />
        {tocado && (
          <button
            onClick={() =>
              startTransition(async () => {
                const res = await renombrarCategoria(categoria.slug, nombre);
                if (res?.error) setError(res.error);
                else setTocado(false);
              })
            }
            disabled={pendiente}
            className="shrink-0 bg-tinta text-marfil px-4 py-2 text-[9px] tracking-[0.2em] uppercase hover:bg-carbon transition-colors disabled:opacity-50"
          >
            {pendiente ? "…" : "Guardar"}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}

export default function EditorCategorias({
  categorias,
  conteos,
}: {
  categorias: Categoria[];
  conteos: Record<string, number>;
}) {
  const [nueva, setNueva] = useState("");
  const [error, setError] = useState("");
  const [pendiente, startTransition] = useTransition();

  const agregar = () => {
    setError("");
    startTransition(async () => {
      const res = await crearCategoria(nueva);
      if (res?.error) setError(res.error);
      else setNueva("");
    });
  };

  return (
    <div className="space-y-3">
      {categorias.map((c) => (
        <FilaCategoria key={c.slug} categoria={c} productos={conteos[c.slug] ?? 0} />
      ))}

      <div className="border border-dashed border-linea px-4 py-5 mt-6">
        <p className="text-[10px] tracking-[0.25em] uppercase text-piedra mb-3">
          Nueva categoría
        </p>
        <input
          type="text"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          placeholder="Ej: Pulseras, Aretes, Bolsos…"
          className="input-line"
        />
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        <button
          onClick={agregar}
          disabled={pendiente || !nueva.trim()}
          className="mt-4 bg-tinta text-marfil px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-carbon transition-colors disabled:opacity-40"
        >
          {pendiente ? "Creando…" : "Crear categoría"}
        </button>
      </div>
    </div>
  );
}
