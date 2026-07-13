import "server-only";
import { cookies } from "next/headers";

// Separador ";" y BOM para que Excel en español lo abra directo.
export function aCSV(columnas: string[], filas: (string | number)[][]): string {
  const escapar = (v: string | number) => {
    const s = String(v ?? "");
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lineas = [columnas.map(escapar).join(";")];
  filas.forEach((f) => lineas.push(f.map(escapar).join(";")));
  return "﻿" + lineas.join("\r\n");
}

export function respuestaCSV(contenido: string, nombreArchivo: string): Response {
  return new Response(contenido, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    },
  });
}

export async function sesionAdminValida(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "1";
}
