"use client";

import { useState, useTransition } from "react";
import { guardarPregunta, eliminarPregunta } from "@/app/admin/actions";
import type { PreguntaFormulario } from "@/lib/types";

const TIPOS: { valor: string; label: string }[] = [
  { valor: "text", label: "Texto" },
  { valor: "tel", label: "Teléfono" },
  { valor: "number", label: "Cantidad" },
  { valor: "textarea", label: "Texto largo" },
  { valor: "map", label: "Ubicación" },
];

function FilaPregunta({ pregunta }: { pregunta: PreguntaFormulario }) {
  const [label, setLabel] = useState(pregunta.label);
  const [obligatorio, setObligatorio] = useState(pregunta.obligatorio);
  const [activo, setActivo] = useState(pregunta.activo);
  const [tocado, setTocado] = useState(false);
  const [pendiente, startTransition] = useTransition();

  const guardar = () =>
    startTransition(async () => {
      await guardarPregunta({
        id: pregunta.id,
        label,
        tipo: pregunta.tipo,
        obligatorio,
        orden: pregunta.orden,
        activo,
      });
      setTocado(false);
    });

  return (
    <div className={`border border-linea bg-white/60 px-4 py-4 ${!activo ? "opacity-55" : ""}`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[9px] tracking-[0.2em] uppercase text-piedra">
          {TIPOS.find((t) => t.valor === pregunta.tipo)?.label ?? pregunta.tipo}
        </span>
        <button
          onClick={() => startTransition(() => eliminarPregunta(pregunta.id))}
          disabled={pendiente}
          className="text-[9px] tracking-[0.15em] uppercase text-piedra hover:text-red-700 transition-colors"
        >
          Eliminar
        </button>
      </div>

      <input
        type="text"
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
          setTocado(true);
        }}
        className="input-line"
      />

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-5 text-xs font-light">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={obligatorio}
              onChange={(e) => {
                setObligatorio(e.target.checked);
                setTocado(true);
              }}
              className="h-3.5 w-3.5 accent-[#1c1a17]"
            />
            Obligatoria
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => {
                setActivo(e.target.checked);
                setTocado(true);
              }}
              className="h-3.5 w-3.5 accent-[#1c1a17]"
            />
            Visible
          </label>
        </div>

        {tocado && (
          <button
            onClick={guardar}
            disabled={pendiente}
            className="bg-tinta text-marfil px-4 py-2 text-[9px] tracking-[0.2em] uppercase hover:bg-carbon transition-colors disabled:opacity-50"
          >
            {pendiente ? "…" : "Guardar"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function EditorFormulario({ preguntas }: { preguntas: PreguntaFormulario[] }) {
  const [nuevaLabel, setNuevaLabel] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("text");
  const [pendiente, startTransition] = useTransition();

  const agregar = () => {
    if (!nuevaLabel.trim()) return;
    startTransition(async () => {
      await guardarPregunta({
        label: nuevaLabel.trim(),
        tipo: nuevoTipo,
        obligatorio: false,
        orden: preguntas.length + 1,
        activo: true,
      });
      setNuevaLabel("");
    });
  };

  return (
    <div className="space-y-3">
      {preguntas.map((p) => (
        <FilaPregunta key={p.id} pregunta={p} />
      ))}

      <div className="border border-dashed border-linea px-4 py-5 mt-6">
        <p className="text-[10px] tracking-[0.25em] uppercase text-piedra mb-3">
          Agregar pregunta
        </p>
        <input
          type="text"
          value={nuevaLabel}
          onChange={(e) => setNuevaLabel(e.target.value)}
          placeholder="Texto de la pregunta"
          className="input-line"
        />
        <div className="flex items-center justify-between mt-4">
          <select
            value={nuevoTipo}
            onChange={(e) => setNuevoTipo(e.target.value)}
            className="bg-transparent border border-linea px-3 py-2 text-xs font-light focus:outline-none focus:border-tinta"
          >
            {TIPOS.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            onClick={agregar}
            disabled={pendiente || !nuevaLabel.trim()}
            className="bg-tinta text-marfil px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-carbon transition-colors disabled:opacity-40"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
