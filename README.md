# Mimins

Sistema de gestión de pedidos para una tienda de uniformes escolares. Permite registrar clientes, productos, precios por colegio/talla, y hacer seguimiento de pedidos con pagos parciales.

## Funcionalidades

- **Dashboard** con resumen de pedidos activos y métricas generales
- **Colegios** — CRUD completo con historial de pedidos y clientes
- **Clientes** — CRUD con teléfono chileno (+56), vinculados a un colegio
- **Productos** — catálogo de prendas (buzos, poleras, pantalones, etc.)
- **Tallas** — gestión de tallas disponibles
- **Precios** — tabla de precios por colegio + talla, con historial de cambios
- **Pedidos** — creación, edición de items, pagos parciales y cambio de estado rápido
- **Autenticación** — login con cookie JWT firmada (solo en producción)
- **Dark mode** — toggle en sidebar

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Lenguaje | TypeScript + React 19 |
| ORM | Prisma 7.5 + SQLite (better-sqlite3) |
| UI | shadcn/ui (base-nova) + Tailwind CSS v4 + Base UI |
| Auth | jose (JWT firmado, cookie HttpOnly) |
| Runtime | Node.js v24 LTS |

## Arquitectura

Cada entidad sigue el mismo patrón:

```
src/app/[entidad]/
  actions.ts   ← Server Actions ("use server")
  page.tsx     ← Server Component (force-dynamic)
  client.tsx   ← Client Component con estado UI

src/components/[entidad]/
  *-form.tsx   ← Formulario
  *-table.tsx  ← Tabla con búsqueda/paginación

src/components/ui/   ← Componentes compartidos
src/lib/             ← Prisma singleton, utils, constantes, hooks
```

## Desarrollo local

```bash
npm install
npx prisma migrate dev
npm run dev          # http://localhost:3001
```

Para poblar con datos de prueba:

```bash
node prisma/seed.mjs
```

> El servidor de desarrollo corre en el puerto **3001** con `--hostname 0.0.0.0` para acceso LAN.

## Variables de entorno

Crear un archivo `.env` en la raíz:

```env
DATABASE_PATH=db/dev.db

# Solo requerido en producción
AUTH_USER=
AUTH_PASSWORD=
SESSION_SECRET=
```

## Producción

El servidor de producción corre en un LXC (`mimins-prod`) gestionado con PM2.

**Deploy:**

```bash
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart mimins
```

La base de datos tiene backup diario automático vía crontab (3 AM) hacia `db/backups/`, con rotación de 30 copias máximo.

Ver `docs/setup-ambientes.md` para la configuración completa de ambientes.

## Estructura de la base de datos

```
Colegio ──< Cliente ──< Pedido ──< ItemPedido >── Producto
                                         │
                                    Talla + Precio (por colegio)
```

Un cliente pertenece siempre a un solo colegio. Al agregar items a un pedido, solo se muestran los productos y precios correspondientes al colegio del cliente.
