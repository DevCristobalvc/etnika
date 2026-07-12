# Etnika — Plataforma de Catálogo y Gestión de Pedidos

## Visión General

Etnika Moda y Diseño es una marca de accesorios para mujer. La plataforma digital tiene dos propósitos distintos: mostrar y vender los productos al público general, y darle a Erika (la dueña) una herramienta de administración completa para gestionar pedidos, clientes e inventario desde un solo lugar.

La primera iteración prioriza funcionalidad sobre integración externa: los pedidos llegan a un dashboard interno antes de conectar con Google Sheets o WhatsApp de forma automatizada.

---

## Filosofía de Diseño

- **Estética**: Minimalista, sobria, elegante. Orientada a un público de clase media-alta.
- **Paleta**: Neutros. Blanco roto, negro, gris cálido, toques en crema o dorado muy sutil. Sin colores saturados.
- **Tipografía**: Serif delgado para títulos (Cormorant Garamond o similar). Sans-serif limpio para cuerpo (Inter o DM Sans).
- **Sin emojis**. Sin iconografía recargada. Espaciado generoso.
- **Imágenes**: Protagonistas absolutas. Todo el contenido visual sale del Instagram de Etnika (@etnika_modaydiseno).
- **Texto**: Mínimo. Cada palabra debe ganar su espacio.
- **Mobile-first**: La mayoría de las compradoras llegan desde el celular.

---

## Estructura del Sitio — Área Pública

### 1. Página Principal

- Hero: imagen de producto o lookbook a pantalla completa con el logo centrado.
- Debajo del hero: acceso rápido a categorías de accesorios (rejilla o carrusel limpio).
- Sin texto de "bienvenida". La imagen habla.

### 2. Catálogo por Categorías

Categorías iniciales (ajustables según inventario real):
- Aretes
- Collares
- Pulseras
- Anillos
- Bolsos / Carteras
- Accesorios para cabello

Cada categoría muestra una rejilla de productos: imagen cuadrada o vertical, nombre del producto, precio.

### 3. Vista de Producto

Al hacer clic en un producto:
- Imagen principal (posibilidad de galería si hay varias fotos).
- Nombre y descripción corta (materiales, colores disponibles).
- Precio.
- Botón de acción: **"Quiero este"** o **"Pedir"**.

### 4. Formulario de Compra

Se abre como modal o página dedicada al presionar el botón de compra. Campos:

| Campo | Tipo |
|---|---|
| Nombre completo | Texto |
| Número de WhatsApp | Teléfono (con prefijo de país) |
| Ubicación de entrega | Selector en mapa (Google Maps / Mapbox) con posibilidad de escribir dirección manual |
| Cantidad | Numérico (mínimo 1) |
| Notas adicionales | Texto libre opcional |

Al confirmar, el pedido se guarda en la base de datos interna y aparece en el dashboard de Erika.

**Iteración futura**: además de guardarlo, enviar notificación automática por WhatsApp Business API o correo.

### 5. Sección de Contacto y Ubicación (pie de página)

- Teléfono / WhatsApp de contacto directo.
- Ubicación del punto de venta (dirección por definir).
- Ubicación de la fábrica / taller (dirección por definir).
- Enlace al Instagram.
- Mapa embebido con ambas ubicaciones marcadas.
- Sin redes sociales adicionales por ahora.

---

## Área de Administración — Dashboard de Erika

Acceso desde `/admin` o desde un enlace discreto en el pie de página. Requiere autenticación.

### Autenticación

- Login con correo y contraseña (credenciales de Erika).
- Sin registro público. Solo el administrador accede.
- Sesión persistente con opción de cerrar sesión.

### Módulos del Dashboard

#### A. Pedidos

Vista principal de administración. Tabla con:

| Campo visible | Descripción |
|---|---|
| ID del pedido | Generado automáticamente |
| Fecha y hora | Registro del momento del pedido |
| Cliente | Nombre |
| Producto | Nombre del accesorio |
| Cantidad | |
| Ubicación | Dirección o punto en mapa |
| WhatsApp | Enlace directo para abrir conversación |
| Estado | Pendiente / En preparación / Entregado / Cancelado |

Acciones por pedido:
- Cambiar estado (botón o dropdown).
- Ver detalle completo.
- Crear pedido manual (para ventas presenciales o telefónicas).
- Eliminar pedido (con confirmación).

Filtros disponibles:
- Por estado.
- Por fecha.
- Por cliente.
- Por producto.

#### B. Clientes

Cada vez que alguien realiza una compra, se crea automáticamente un perfil de cliente (o se actualiza si el número de WhatsApp ya existe).

Vista de clientes: tabla con nombre, WhatsApp, número de pedidos, última compra.

Perfil individual del cliente:
- Datos de contacto (editables por Erika).
- Historial completo de pedidos.
- Notas internas (campo privado, solo visible en el admin).
- Dirección(es) de entrega registradas.

#### C. Productos (Inventario básico)

- Lista de productos con imagen, categoría, precio y estado (activo / inactivo).
- Crear, editar o desactivar productos.
- Subir imágenes directamente desde el panel.
- Definir categorías.
- Campo de stock opcional (si Erika quiere llevar control de unidades).

**Iteración futura**: alertas de stock bajo, variantes por color o talla.

#### D. Estadísticas (Vista simple — iteración futura)

- Total de pedidos por período.
- Productos más vendidos.
- Clientes frecuentes.

---

## Flujo de Datos — Primera Iteración

```
Cliente hace pedido (formulario web)
         ↓
Pedido se guarda en base de datos interna (Supabase o similar)
         ↓
Aparece en dashboard de Erika en tiempo real
         ↓
Erika gestiona el pedido desde el panel
```

**Segunda iteración (planificada)**:
```
Pedido guardado
         ↓
Registro automático en Google Sheets
         ↓
Notificación a Erika por WhatsApp
```

---

## Stack Tecnológico Propuesto

| Capa | Tecnología |
|---|---|
| Frontend | Next.js (App Router) |
| Estilos | Tailwind CSS |
| Componentes UI | shadcn/ui (minimalista, accesible) |
| Base de datos | Supabase (PostgreSQL + Auth + Storage) |
| Autenticación | Supabase Auth (para el admin) |
| Imágenes | Supabase Storage o Cloudinary |
| Mapa | Google Maps API o Mapbox GL |
| Deploy | Vercel |

---

## Contenido — Primera Fase

Todo el contenido visual de la primera versión sale del Instagram @etnika_modaydiseno:
- Fotos de productos.
- Logo.
- Imágenes de campaña o lookbook.

Erika deberá proveer:
- Listado de productos con nombre, descripción y precio.
- Categorías definitivas.
- Dirección del punto de venta.
- Dirección de la fábrica/taller.
- Número de WhatsApp de contacto.
- Credenciales para el acceso al admin.

---

## Lo que NO entra en la primera iteración

- Pasarela de pago en línea (Stripe, PayU, etc.).
- Sistema de envíos automatizado.
- Reseñas o comentarios de clientes.
- Blog o contenido editorial.
- Múltiples administradores con roles diferenciados.
- App móvil nativa.

---

## Nomenclatura y Branding

- Nombre oficial: **Etnika Moda y Diseño**
- Nombre corto para dominio/código: **etnika**
- Instagram: [@etnika_modaydiseno](https://www.instagram.com/etnika_modaydiseno/)
- Dominio sugerido: `etnika.co` o `etnikamodas.com` (por definir)
