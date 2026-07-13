"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { guardarProducto, eliminarProducto } from "@/app/admin/actions";
import { CATEGORIAS } from "@/lib/format";
import type { Producto } from "@/lib/types";

export default function ProductoForm({ producto }: { producto?: Producto }) {
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(producto?.imagen ?? null);
  const [confirmando, setConfirmando] = useState(false);
  const [pendiente, startTransition] = useTransition();

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      const res = await guardarProducto(formData);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <form action={handleSubmit} className="space-y-7">
      {producto && <input type="hidden" name="id" value={producto.id} />}
      {producto?.imagen && (
        <input type="hidden" name="imagen_actual" value={producto.imagen} />
      )}

      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-3">
          Imagen
        </label>
        <label className="block cursor-pointer">
          <div className="relative aspect-[4/5] max-w-[240px] bg-crema border border-linea overflow-hidden">
            {preview ? (
              <Image
                src={preview}
                alt=""
                fill
                sizes="240px"
                unoptimized={preview.startsWith("blob:")}
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.2em] uppercase text-piedra">
                Tocar para subir
              </span>
            )}
          </div>
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleArchivo}
            className="hidden"
          />
        </label>
        <p className="mt-2 text-[10px] text-piedra">
          Toca la imagen para cambiarla.
        </p>
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
          Nombre
        </label>
        <input
          type="text"
          name="nombre"
          defaultValue={producto?.nombre ?? ""}
          className="input-line"
          required
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          rows={3}
          defaultValue={producto?.descripcion ?? ""}
          className="input-line resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
            Precio (COP)
          </label>
          <input
            type="number"
            name="precio"
            min={0}
            step={1000}
            defaultValue={producto?.precio ?? ""}
            className="input-line"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.25em] uppercase text-piedra mb-1">
            Categoría
          </label>
          <input
            type="text"
            name="categoria"
            list="categorias"
            defaultValue={producto?.categoria ?? ""}
            className="input-line"
            required
          />
          <datalist id="categorias">
            {Object.keys(CATEGORIAS).map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm font-light">
        <input
          type="checkbox"
          name="activo"
          defaultChecked={producto?.activo ?? true}
          className="h-4 w-4 accent-[#1c1a17]"
        />
        Visible en la tienda
      </label>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pendiente}
        className="w-full bg-tinta text-marfil py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-carbon transition-colors disabled:opacity-50"
      >
        {pendiente ? "Guardando…" : producto ? "Guardar cambios" : "Crear producto"}
      </button>

      {producto && (
        <div className="text-center pt-2">
          {confirmando ? (
            <span className="flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={pendiente}
                onClick={() => startTransition(() => eliminarProducto(producto.id))}
                className="text-[10px] tracking-[0.15em] uppercase text-red-700 underline underline-offset-4"
              >
                Confirmar eliminación
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="text-[10px] tracking-[0.15em] uppercase text-piedra"
              >
                Cancelar
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="text-[10px] tracking-[0.15em] uppercase text-piedra hover:text-red-700 transition-colors"
            >
              Eliminar producto
            </button>
          )}
        </div>
      )}
    </form>
  );
}
