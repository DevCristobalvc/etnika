"use client";

import Link from "next/link";
import { useTransition } from "react";
import { alternarProductoActivo, ajustarStock } from "@/app/admin/actions";

export default function ProductoAcciones({
  id,
  activo,
  stock,
}: {
  id: string;
  activo: boolean;
  stock: number | null;
}) {
  const [pendiente, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-end gap-2 shrink-0">
      <Link
        href={`/admin/productos/${id}`}
        className="text-[10px] tracking-[0.15em] uppercase underline underline-offset-4 text-tinta/70 hover:text-tinta"
      >
        Editar
      </Link>
      <button
        disabled={pendiente}
        onClick={() => startTransition(() => alternarProductoActivo(id, !activo))}
        className={`text-[10px] tracking-[0.15em] uppercase ${
          activo ? "text-piedra hover:text-tinta" : "text-arena hover:text-tinta"
        } disabled:opacity-50`}
      >
        {activo ? "Ocultar" : "Publicar"}
      </button>
      {stock !== null && (
        <div className="flex items-center border border-linea">
          <button
            disabled={pendiente || stock === 0}
            onClick={() => startTransition(() => ajustarStock(id, -1))}
            className="px-2.5 py-1 text-sm font-light hover:bg-crema transition-colors disabled:opacity-30"
            aria-label="Restar stock"
          >
            −
          </button>
          <span className="w-7 text-center text-xs">{stock}</span>
          <button
            disabled={pendiente}
            onClick={() => startTransition(() => ajustarStock(id, 1))}
            className="px-2.5 py-1 text-sm font-light hover:bg-crema transition-colors disabled:opacity-30"
            aria-label="Sumar stock"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
