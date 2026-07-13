import { supabaseAdmin } from "@/lib/supabase-admin";
import EditorFormulario from "@/components/admin/EditorFormulario";
import type { PreguntaFormulario } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function FormularioPage() {
  const { data } = await supabaseAdmin
    .from("formulario_preguntas")
    .select("*")
    .order("orden", { ascending: true });

  return (
    <>
      <h1 className="font-display font-light text-3xl mb-2">Formulario de compra</h1>
      <p className="text-sm font-light text-tinta/60 mb-8">
        Estas son las preguntas que responden las clientas al hacer un pedido.
      </p>
      <EditorFormulario preguntas={(data ?? []) as PreguntaFormulario[]} />
    </>
  );
}
