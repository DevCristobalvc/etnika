export type Producto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoria: string;
  imagen: string | null;
  instagram_url: string | null;
  activo: boolean;
  stock: number | null;
  created_at: string;
};

export type Cliente = {
  id: string;
  nombre: string;
  whatsapp: string;
  direcciones: string[];
  notas: string | null;
  created_at: string;
};

export type EstadoPedido = "pendiente" | "en_preparacion" | "entregado" | "cancelado";

export type Pedido = {
  id: string;
  cliente_id: string | null;
  producto_id: string | null;
  cantidad: number;
  ubicacion_texto: string | null;
  ubicacion_lat: number | null;
  ubicacion_lng: number | null;
  notas: string | null;
  respuestas: Record<string, string>;
  estado: EstadoPedido;
  pago_estado: "no_pagado" | "pagado" | "rechazado";
  metodo_pago: string | null;
  created_at: string;
  cliente?: Cliente | null;
  producto?: Producto | null;
};

export type Categoria = {
  slug: string;
  nombre: string;
  orden: number;
};

export type PreguntaFormulario = {
  id: string;
  label: string;
  tipo: "text" | "tel" | "number" | "textarea" | "map";
  obligatorio: boolean;
  orden: number;
  activo: boolean;
};
