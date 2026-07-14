"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { entrarConMagicLink } from "../actions";

export default function AdminCallback() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    // El token de Supabase llega en el hash de la URL (#access_token=...).
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const errDesc = params.get("error_description");

    if (errDesc) {
      setError("El enlace no es válido o ya venció.");
      return;
    }
    if (!accessToken) {
      setError("El enlace no es válido o ya venció.");
      return;
    }

    (async () => {
      const res = await entrarConMagicLink(accessToken);
      if (res?.error) {
        setError(res.error);
      } else {
        // Limpia el token de la URL y entra al panel.
        window.history.replaceState(null, "", "/admin/callback");
        router.replace("/admin/pedidos");
      }
    })();
  }, [router]);

  return (
    <main className="min-h-svh flex items-center justify-center bg-marfil px-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-light tracking-[0.25em] uppercase mb-4">
          Étnika
        </h1>
        {error ? (
          <>
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <a
              href="/admin"
              className="text-[10px] tracking-[0.2em] uppercase text-piedra hover:text-tinta transition-colors"
            >
              Volver a intentar
            </a>
          </>
        ) : (
          <p className="text-[11px] tracking-[0.3em] uppercase text-piedra">
            Verificando tu acceso…
          </p>
        )}
      </div>
    </main>
  );
}
