"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/formulario", label: "Formulario" },
  { href: "/admin/ajustes", label: "Ajustes" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-marfil/95 backdrop-blur border-t border-linea">
      <div className="mx-auto max-w-3xl grid grid-cols-5">
        {items.map((item) => {
          const activo = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 py-4 text-[9px] tracking-[0.2em] uppercase transition-colors ${
                activo ? "text-tinta" : "text-piedra hover:text-tinta"
              }`}
            >
              <span
                className={`h-px w-6 transition-colors ${
                  activo ? "bg-tinta" : "bg-transparent"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
