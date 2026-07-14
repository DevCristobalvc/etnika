import Image from "next/image";
import Link from "next/link";
import type { Producto } from "@/lib/types";
import { formatPrecio, nombreCategoria } from "@/lib/format";

export default function ProductCard({
  producto,
  destacado = false,
}: {
  producto: Producto;
  destacado?: boolean;
}) {
  return (
    <Link
      href={`/producto/${producto.id}`}
      className={`group block ${destacado ? "sm:col-span-2 sm:row-span-2" : ""}`}
    >
      <div className="relative overflow-hidden bg-crema aspect-[4/5]">
        {producto.imagen && (
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            sizes={destacado ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 50vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        {producto.stock === 0 && (
          <span className="absolute bottom-3 left-3 bg-tinta/85 text-marfil px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase">
            Agotado
          </span>
        )}
      </div>
      <div className="pt-4 pb-2">
        <p className="text-[10px] tracking-[0.25em] uppercase text-piedra">
          {nombreCategoria(producto.categoria)}
        </p>
        <h3 className="font-display text-lg mt-1 leading-snug">{producto.nombre}</h3>
        <p className="text-xs tracking-[0.15em] text-tinta/60 mt-1">
          {formatPrecio(producto.precio)}
        </p>
      </div>
    </Link>
  );
}
