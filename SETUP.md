# Étnika — Guía de implementación con Supabase

## Credenciales necesarias

Para conectar el backend, necesitas dos valores de tu proyecto Supabase:

1. Ve a [supabase.com](https://supabase.com) → tu proyecto → **Settings** → **API**
2. Copia:
   - `Project URL` → va en `NEXT_PUBLIC_SUPABASE_URL`
   - `anon / public key` → va en `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Agrégalos en `web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

---

## Base de datos — Tablas a crear

Ejecuta este SQL en **Supabase → SQL Editor**:

```sql
-- Clientes
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  whatsapp text not null unique,
  direcciones jsonb default '[]',
  notas text,
  created_at timestamptz default now()
);

-- Productos
create table productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric not null,
  categoria text not null,
  imagen text,
  instagram_url text,
  activo boolean default true,
  created_at timestamptz default now()
);

-- Pedidos
create table pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id),
  producto_id uuid references productos(id),
  cantidad integer not null default 1,
  ubicacion_texto text,
  ubicacion_lat numeric,
  ubicacion_lng numeric,
  notas text,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'en_preparacion', 'entregado', 'cancelado')),
  created_at timestamptz default now()
);

-- Preguntas del formulario de compra (configurables por Erika)
create table formulario_preguntas (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  tipo text not null default 'text'
    check (tipo in ('text', 'tel', 'number', 'textarea', 'map')),
  obligatorio boolean default true,
  orden integer default 0,
  activo boolean default true
);

-- Preguntas por defecto
insert into formulario_preguntas (label, tipo, obligatorio, orden) values
  ('Nombre completo', 'text', true, 1),
  ('WhatsApp', 'tel', true, 2),
  ('Ubicación de entrega', 'map', true, 3),
  ('Cantidad', 'number', true, 4),
  ('Notas adicionales', 'textarea', false, 5);
```

---

## Row Level Security (RLS)

```sql
-- Activar RLS
alter table clientes enable row level security;
alter table productos enable row level security;
alter table pedidos enable row level security;
alter table formulario_preguntas enable row level security;

-- Productos: lectura pública
create policy "Productos visibles para todos"
  on productos for select using (activo = true);

-- Preguntas del formulario: lectura pública
create policy "Preguntas visibles para todos"
  on formulario_preguntas for select using (activo = true);

-- Pedidos: inserción pública (clientes pueden crear), lectura solo admin
create policy "Clientes pueden crear pedidos"
  on pedidos for insert with check (true);

-- Clientes: inserción pública, lectura solo admin
create policy "Clientes pueden crearse"
  on clientes for insert with check (true);
```

---

## Storage — Imágenes de productos

1. Ve a **Supabase → Storage** → New bucket → nombre: `productos`
2. Marca como **public**
3. Sube las imágenes de `content/productos/` a las carpetas correspondientes

O usa el script de carga automática (ver `scripts/upload-images.js`).

---

## Variables de entorno en Vercel

Una vez con las credenciales:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

O agrégalas directamente en el dashboard de Vercel → tu proyecto → Settings → Environment Variables.

---

## Instalación del cliente Supabase

```bash
cd web
npm install @supabase/supabase-js @supabase/ssr
```

---

## Autenticación del admin

**Primera iteración**: login hardcoded (Erika / erika123). No requiere Supabase Auth.

**Segunda iteración**: usar Supabase Auth con email/password:
- Crear usuario en Supabase → Authentication → Users
- Email: el de Erika
- Proteger rutas `/admin/*` con middleware que valida la sesión

---

## Módulos del admin a implementar

| Ruta | Módulo | Estado |
|---|---|---|
| `/admin` | Login | Implementado (hardcoded) |
| `/admin/pedidos` | Ver y gestionar pedidos | Pendiente Supabase |
| `/admin/clientes` | Ver perfiles de clientes | Pendiente Supabase |
| `/admin/productos` | CRUD de productos | Pendiente Supabase |
| `/admin/productos/nuevo` | Crear producto con imagen | Pendiente Supabase |
| `/admin/formulario` | Editar preguntas del formulario de compra | Pendiente Supabase |

---

## WhatsApp de Erika

Link directo configurado: `https://wa.me/573005412940`

Aparece en:
- Botón "Hablar con Erika" en producto
- Footer del sitio
