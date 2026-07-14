import { supabaseAdmin } from "@/lib/supabase-admin";
import EditorAjustes from "@/components/admin/EditorAjustes";

export const dynamic = "force-dynamic";

export type FilaConfig = {
  clave: string;
  valor: string;
  etiqueta: string;
  tipo: "text" | "textarea" | "tel" | "url" | "color";
  orden: number;
};

export default async function AjustesPage() {
  const { data } = await supabaseAdmin
    .from("configuracion")
    .select("*")
    .order("orden", { ascending: true });

  return (
    <>
      <h1 className="font-display font-light text-3xl mb-2">Ajustes del sitio</h1>
      <p className="text-sm font-light text-tinta/60 mb-8">
        Textos, contacto y direcciones que aparecen en la página. Los cambios se
        publican al guardar.
      </p>
      <EditorAjustes filas={(data ?? []) as FilaConfig[]} />
    </>
  );
}
