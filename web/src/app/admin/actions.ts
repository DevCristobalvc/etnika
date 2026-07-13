"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { EstadoPedido } from "@/lib/types";

const ADMIN_USER = "Erika";
const ADMIN_PASS = "erika123";

async function verificarSesion() {
  const store = await cookies();
  if (store.get("admin_session")?.value !== "1") {
    throw new Error("No autorizado");
  }
}

export async function login(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const usuario = formData.get("usuario");
  const clave = formData.get("clave");

  if (usuario !== ADMIN_USER || clave !== ADMIN_PASS) {
    return { error: "Credenciales incorrectas." };
  }

  const store = await cookies();
  store.set("admin_session", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin/pedidos");
}

export async function logout() {
  const store = await cookies();
  store.delete("admin_session");
  redirect("/admin");
}

// ---------- Pedidos ----------

export async function cambiarEstadoPedido(id: string, estado: EstadoPedido) {
  await verificarSesion();
  await supabaseAdmin.from("pedidos").update({ estado }).eq("id", id);
  revalidatePath("/admin/pedidos");
}

export async function eliminarPedido(id: string) {
  await verificarSesion();
  await supabaseAdmin.from("pedidos").delete().eq("id", id);
  revalidatePath("/admin/pedidos");
}

// ---------- Productos ----------

export async function guardarProducto(formData: FormData) {
  await verificarSesion();

  const id = (formData.get("id") as string) || null;
  const nombre = (formData.get("nombre") as string)?.trim();
  const descripcion = (formData.get("descripcion") as string)?.trim() || null;
  const precio = Number(formData.get("precio"));
  const categoria = (formData.get("categoria") as string)?.trim();
  const activo = formData.get("activo") === "on";
  const archivo = formData.get("imagen") as File | null;

  if (!nombre || !precio || !categoria) {
    return { error: "Nombre, precio y categoría son obligatorios." };
  }

  let imagenUrl = (formData.get("imagen_actual") as string) || null;

  if (archivo && archivo.size > 0) {
    const ext = archivo.name.split(".").pop() || "png";
    const ruta = `${categoria}/${Date.now()}.${ext}`;
    const { error: errUpload } = await supabaseAdmin.storage
      .from("productos")
      .upload(ruta, archivo, { contentType: archivo.type, upsert: true });
    if (errUpload) {
      return { error: "No se pudo subir la imagen." };
    }
    const { data: pub } = supabaseAdmin.storage.from("productos").getPublicUrl(ruta);
    imagenUrl = pub.publicUrl;
  }

  const registro = { nombre, descripcion, precio, categoria, activo, imagen: imagenUrl };

  if (id) {
    await supabaseAdmin.from("productos").update(registro).eq("id", id);
  } else {
    await supabaseAdmin.from("productos").insert(registro);
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
  redirect("/admin/productos");
}

export async function alternarProductoActivo(id: string, activo: boolean) {
  await verificarSesion();
  await supabaseAdmin.from("productos").update({ activo }).eq("id", id);
  revalidatePath("/admin/productos");
  revalidatePath("/");
}

export async function eliminarProducto(id: string) {
  await verificarSesion();
  await supabaseAdmin.from("pedidos").update({ producto_id: null }).eq("producto_id", id);
  await supabaseAdmin.from("productos").delete().eq("id", id);
  revalidatePath("/admin/productos");
  revalidatePath("/");
}

// ---------- Clientes ----------

export async function guardarNotasCliente(id: string, notas: string) {
  await verificarSesion();
  await supabaseAdmin.from("clientes").update({ notas }).eq("id", id);
  revalidatePath(`/admin/clientes/${id}`);
}

// ---------- Formulario ----------

export async function guardarPregunta(datos: {
  id?: string;
  label: string;
  tipo: string;
  obligatorio: boolean;
  orden: number;
  activo: boolean;
}) {
  await verificarSesion();
  const { id, ...resto } = datos;
  if (id) {
    await supabaseAdmin.from("formulario_preguntas").update(resto).eq("id", id);
  } else {
    await supabaseAdmin.from("formulario_preguntas").insert(resto);
  }
  revalidatePath("/admin/formulario");
}

export async function eliminarPregunta(id: string) {
  await verificarSesion();
  await supabaseAdmin.from("formulario_preguntas").delete().eq("id", id);
  revalidatePath("/admin/formulario");
}
