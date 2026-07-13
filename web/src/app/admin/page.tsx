"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Erika" && password === "erika123") {
      document.cookie = "admin_session=1; path=/";
      router.push("/admin/pedidos");
    } else {
      setError("Credenciales incorrectas.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="w-full max-w-sm px-8">
        <h1
          className="text-3xl font-light tracking-[0.25em] text-[#1a1a1a] uppercase mb-10 text-center"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Étnika
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b border-[#c8bfb0] bg-transparent py-3 text-sm text-[#1a1a1a] placeholder-[#a89f96] focus:outline-none focus:border-[#1a1a1a] transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-[#c8bfb0] bg-transparent py-3 text-sm text-[#1a1a1a] placeholder-[#a89f96] focus:outline-none focus:border-[#1a1a1a] transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 pt-1">{error}</p>
          )}

          <button
            type="submit"
            className="w-full mt-6 py-3 text-xs tracking-[0.2em] uppercase text-[#FAF8F5] bg-[#1a1a1a] hover:bg-[#333] transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </main>
  );
}
