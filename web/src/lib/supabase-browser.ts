import { createBrowserClient } from "@supabase/ssr";

// Cliente para el navegador. Flujo implícito para que el enlace mágico
// funcione con la plantilla de correo por defecto de Supabase.
export function crearClienteBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { flowType: "implicit", detectSessionInUrl: true, persistSession: true } }
  );
}
