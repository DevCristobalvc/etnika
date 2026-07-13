"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function AdminLogin() {
  const [estado, accion, pendiente] = useActionState(login, null);

  return (
    <main className="min-h-svh flex items-center justify-center bg-marfil px-6">
      <div className="w-full max-w-sm">
        <p className="text-center text-[10px] tracking-[0.4em] uppercase text-piedra mb-3">
          Panel privado
        </p>
        <h1 className="font-display text-4xl font-light tracking-[0.25em] uppercase text-center mb-14">
          Étnika
        </h1>

        <form action={accion} className="space-y-6">
          <input
            type="text"
            name="usuario"
            placeholder="Usuario"
            autoComplete="username"
            className="input-line"
          />
          <input
            type="password"
            name="clave"
            placeholder="Contraseña"
            autoComplete="current-password"
            className="input-line"
          />

          {estado?.error && (
            <p className="text-xs text-red-600 pt-1">{estado.error}</p>
          )}

          <button
            type="submit"
            disabled={pendiente}
            className="w-full mt-4 py-4 text-[11px] tracking-[0.3em] uppercase text-marfil bg-tinta hover:bg-carbon transition-colors disabled:opacity-50"
          >
            {pendiente ? "Verificando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
