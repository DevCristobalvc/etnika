"use client";

import Link from "next/link";
import { useTransition } from "react";
import { alternarProductoActivo } from "@/app/admin/actions";

export default function ProductoAcciones({ id, activo }: { id: string; activo: boolean }) {
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
    </div>
  );
}
