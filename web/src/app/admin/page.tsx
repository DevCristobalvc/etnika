"use client";

import { useState, useActionState } from "react";
import { crearClienteBrowser } from "@/lib/supabase-browser";
import { login } from "./actions";

export default function AdminLogin() {
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [verClave, setVerClave] = useState(false);
  const [estadoClave, accionClave, pendienteClave] = useActionState(login, null);

  const enviarEnlace = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    const supabase = crearClienteBrowser();
    const origen = window.location.origin;
    const { error: err } = await supabase.auth.signInWithOtp({
      email: correo.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${origen}/admin/callback`,
      },
    });
    setCargando(false);
    if (err) {
      setError("No pudimos enviar el enlace. Verifica el correo.");
    } else {
      setEnviado(true);
    }
  };

  return (
    <main className="min-h-svh flex items-center justify-center bg-marfil px-6">
      <div className="w-full max-w-sm">
        <p className="text-center text-[10px] tracking-[0.4em] uppercase text-piedra mb-3">
          Panel privado
        </p>
        <h1 className="font-display text-4xl font-light tracking-[0.25em] uppercase text-center mb-14">
          Étnika
        </h1>

        {enviado ? (
          <div className="text-center">
            <p className="font-display font-light text-2xl mb-3">Revisa tu correo</p>
            <p className="text-sm font-light text-tinta/70 leading-relaxed">
              Te enviamos un enlace de acceso a<br />
              <span className="text-tinta">{correo}</span>. Ábrelo desde este
              dispositivo para entrar.
            </p>
            <button
              onClick={() => setEnviado(false)}
              className="mt-8 text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors"
            >
              Usar otro correo
            </button>
          </div>
        ) : (
          <form onSubmit={enviarEnlace} className="space-y-6">
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Tu correo"
              autoComplete="email"
              required
              className="input-line"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={cargando}
              className="w-full py-4 text-[11px] tracking-[0.3em] uppercase text-marfil bg-tinta hover:bg-carbon transition-colors disabled:opacity-50"
            >
              {cargando ? "Enviando…" : "Enviar enlace de acceso"}
            </button>
          </form>
        )}

        <div className="mt-10 pt-6 border-t border-linea text-center">
          {verClave ? (
            <form action={accionClave} className="space-y-4 text-left">
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
              {estadoClave?.error && (
                <p className="text-xs text-red-600">{estadoClave.error}</p>
              )}
              <button
                type="submit"
                disabled={pendienteClave}
                className="w-full py-3.5 text-[10px] tracking-[0.25em] uppercase border border-tinta hover:bg-tinta hover:text-marfil transition-colors disabled:opacity-50"
              >
                {pendienteClave ? "Verificando…" : "Entrar"}
              </button>
            </form>
          ) : (
            <button
              onClick={() => setVerClave(true)}
              className="text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors"
            >
              Entrar con contraseña
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
