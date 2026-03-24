# Mimins — Guía completa del proyecto

## ¿Qué es este proyecto?

Es una app web para gestionar el taller de uniformes escolares. Reemplaza anotar pedidos en papel o Excel. Tiene:

- Registro de clientes y sus colegios
- Catálogo de productos, tallas y precios por colegio
- Gestión de pedidos (con estados: Cotizado → Confirmado → En producción → Listo → Entregado)
- Pagos parciales y completos
- Dashboard con resumen
- Login para protegerla (solo la usan tú y ella)
- Dark mode

---

## El stack tecnológico — qué hace cada cosa

Imagina que en Python harías esto con **Flask + SQLAlchemy + Jinja2 + Bootstrap**. Acá el equivalente es:

| Python / clásico | Este proyecto | Rol |
|---|---|---|
| Flask | Next.js | Framework web (servidor + rutas) |
| SQLAlchemy | Prisma | ORM (habla con la BD) |
| SQLite | SQLite | Base de datos |
| Jinja2 | React + JSX | Motor de plantillas / UI |
| CSS/Bootstrap | Tailwind CSS + shadcn/ui | Estilos |
| `@app.route()` | `page.tsx` + Server Actions | Rutas y lógica de servidor |

### Next.js

No es solo un servidor web. Es un **framework fullstack** que vive a la mitad entre el cliente (el navegador) y el servidor. Tiene un concepto clave: **App Router** — la estructura de carpetas ES las rutas de la app.

```
src/app/clientes/page.tsx     →   URL: /clientes
src/app/pedidos/page.tsx      →   URL: /pedidos
src/app/pedidos/[id]/page.tsx →   URL: /pedidos/123
```

### React

Es la librería para construir la UI. En vez de HTML estático, escribes componentes — funciones TypeScript que retornan JSX (HTML mezclado con JavaScript).

```tsx
// Componente simple
function Saludo({ nombre }: { nombre: string }) {
  return <h1>Hola, {nombre}</h1>  // JSX: HTML + JS mezclado
}
```

### TypeScript

Es JavaScript con tipos. Como Python con `type hints`, pero obligatorio y más estricto. Si defines que algo es `number`, no puedes pasarle un `string`.

### Prisma

Es el ORM. Lees el esquema en `prisma/schema.prisma` — ahí defines los modelos (como las clases de SQLAlchemy). Prisma genera el cliente para consultar la BD.

```python
# Python SQLAlchemy
cliente = session.query(Cliente).filter_by(id=1).first()
```

```typescript
// Prisma TypeScript equivalente
const cliente = await prisma.cliente.findUnique({ where: { id: 1 } })
```

### Tailwind CSS

En vez de escribir CSS separado, pones clases directamente en el HTML:

```tsx
<div className="flex gap-4 text-blue-600 font-bold">...</div>
```

### shadcn/ui

Colección de componentes ya hechos (botones, diálogos, tablas). No es una librería que instalas como dependencia — los componentes se copian directamente a tu proyecto en `src/components/ui/`.

---

## La arquitectura — cómo fluye todo

Este es el modelo mental más importante. Cada sección de la app (clientes, pedidos, etc.) sigue el mismo patrón de 3 capas:

```
┌─────────────────────────────────────────────────┐
│  NAVEGADOR (browser)                            │
│  client.tsx — Estado UI, diálogos, interacción  │
└────────────────────┬────────────────────────────┘
                     │ "Server Action" (llamada al servidor)
┌────────────────────▼────────────────────────────┐
│  SERVIDOR (Node.js)                             │
│  page.tsx   — Carga datos iniciales             │
│  actions.ts — Toda la lógica: CRUD, validación  │
└────────────────────┬────────────────────────────┘
                     │ Prisma ORM
┌────────────────────▼────────────────────────────┐
│  BASE DE DATOS (SQLite)                         │
│  db/dev.db — Un solo archivo                    │
└─────────────────────────────────────────────────┘
```

### Ejemplo concreto: crear un cliente

1. El usuario llena el formulario en el navegador (`cliente-form.tsx`)
2. Presiona "Guardar" → se llama `createCliente(formData)` de `actions.ts`
3. `actions.ts` tiene `"use server"` — Next.js lo ejecuta en el servidor
4. Adentro, Prisma hace `prisma.cliente.create(...)` → escribe en la BD
5. `revalidatePath("/clientes")` le dice a Next.js que recargue los datos
6. La tabla se actualiza sola

---

## La diferencia entre Server y Client Components

Este es el concepto más confuso de Next.js y el más importante.

**Server Component** (`page.tsx` sin `"use client"`):
- Se ejecuta solo en el servidor
- Puede acceder directamente a la BD (con Prisma)
- No puede tener estado (`useState`) ni interactividad
- El HTML llega al navegador ya renderizado

**Client Component** (`client.tsx` con `"use client"`):
- Se ejecuta en el navegador
- Puede tener estado (`useState`, `useEffect`)
- NO puede acceder directamente a la BD
- Para datos, llama a Server Actions

**Por eso el patrón del proyecto es así:**

```
page.tsx (Server) → obtiene datos de BD → pasa datos a → client.tsx (Client) → UI interactiva
```

---

## Los archivos más importantes — cuáles leer y en qué orden

### Fase 1: Entiende los datos (el modelo)

1. **`prisma/schema.prisma`** — El corazón. Define todas las tablas y relaciones. Léelo primero.
2. **`src/lib/constants.ts`** — Los estados posibles de un pedido y sus colores.

### Fase 2: Entiende cómo se guardan y leen datos

3. **`src/lib/prisma.ts`** — Crea el cliente de BD (singleton para no abrir 100 conexiones).
4. **`src/app/clientes/actions.ts`** — Lee esto línea por línea. Tiene `getClientes`, `createCliente`, `updateCliente`, `deleteCliente`. Es el CRUD más simple.

### Fase 3: Entiende el flujo completo de una pantalla

5. **`src/app/clientes/page.tsx`** — 8 líneas. Llama a `getClientes()`, pasa los datos al client.
6. **`src/app/clientes/client.tsx`** — El estado UI: abre/cierra el diálogo de "Nuevo cliente".
7. **`src/components/clientes/clientes-table.tsx`** — La tabla visual con búsqueda y paginación.
8. **`src/components/clientes/cliente-form.tsx`** — El formulario de crear/editar.

### Fase 4: Entiende el layout global

9. **`src/app/layout.tsx`** — El "esqueleto" de toda la app (sidebar + main + tema).
10. **`src/components/sidebar.tsx`** — La navegación lateral.

### Fase 5: Casos más complejos

11. **`src/app/pedidos/actions.ts`** — El más complejo (items, pagos, totales).
12. **`src/app/pedidos/[id]/page.tsx`** y `client.tsx` — Página de detalle con muchas partes.

---

## La estructura de carpetas explicada

```
src/
├── app/               ← RUTAS (cada carpeta = una URL)
│   ├── layout.tsx     ← Layout global (sidebar, tema)
│   ├── page.tsx       ← Página de inicio (/)
│   ├── clientes/      ← Ruta /clientes
│   │   ├── actions.ts ← Lógica de servidor (CRUD)
│   │   ├── page.tsx   ← Carga datos (servidor)
│   │   ├── client.tsx ← UI interactiva (navegador)
│   │   └── [id]/      ← Ruta /clientes/123
│   └── ...
│
├── components/        ← COMPONENTES reutilizables
│   ├── ui/            ← Componentes genéricos (botones, inputs...)
│   ├── clientes/      ← Componentes específicos de clientes
│   ├── pedidos/       ← Componentes específicos de pedidos
│   └── sidebar.tsx    ← La barra lateral
│
├── lib/               ← UTILIDADES
│   ├── prisma.ts      ← Cliente de BD
│   ├── utils.ts       ← formatMonto, formatFecha, etc.
│   ├── constants.ts   ← Estados, colores
│   ├── session.ts     ← Lógica de autenticación JWT
│   └── use-table-search.ts ← Hook para buscar/paginar tablas
│
└── proxy.ts           ← Middleware de autenticación (protege rutas)

prisma/
├── schema.prisma      ← Definición de tablas y relaciones
└── seed.mjs           ← Script para poblar la BD con datos de prueba

db/
└── dev.db             ← La base de datos SQLite (un archivo)

docs/
└── *.md               ← Documentación del proyecto
```

---

## Ruta de aprendizaje recomendada

### Semana 1 — TypeScript

Entender la sintaxis base: tipos, interfaces, funciones con tipos. No necesitas un libro, con estos recursos basta:
- Leer el código del proyecto y preguntar "¿qué hace esto?"
- Enfocarte en entender los tipos que ves: `string`, `number`, `interface`, `type`

### Semana 2 — React básico

Conceptos clave: componentes, props, `useState`. El proyecto ya los usa, puedes leerlos directamente:
- `client.tsx` de clientes: ejemplo simple con un `useState` para abrir/cerrar un diálogo
- No necesitas aprender efectos (`useEffect`) todavía

### Semana 3 — Next.js App Router

Conceptos clave: Server Components vs Client Components, Server Actions, `revalidatePath`
- Leer `page.tsx` + `client.tsx` + `actions.ts` de clientes como unidad
- Entender el flujo: browser → action → BD → revalidate → re-render

### Semana 4 — Prisma

Leer `schema.prisma` completo y los queries en `actions.ts` de pedidos (el más complejo).

### Práctica recomendada

La mejor forma de aprender es **agregar una feature pequeña** al proyecto. Por ejemplo, agregar un campo "dirección" a Cliente. Esto involucra todo el flujo:

1. Modificar `schema.prisma` (agregar el campo)
2. Correr `npx prisma migrate dev` (actualiza la BD)
3. Actualizar `actions.ts` (leer/guardar el nuevo campo)
4. Actualizar el formulario en `cliente-form.tsx` (mostrar el input)

---

## Preguntas frecuentes

**¿Por qué hay dos archivos (`page.tsx` y `client.tsx`) para cada sección?**
Porque Next.js separa lo que corre en el servidor (consulta BD, no interactividad) de lo que corre en el browser (botones, diálogos, estado). Es una decisión de performance y arquitectura.

**¿Por qué `actions.ts` tiene `"use server"` arriba?**
Es una directiva de Next.js. Le dice al compilador "estas funciones solo se ejecutan en el servidor". El browser nunca ve ese código.

**¿Qué es `revalidatePath("/clientes")`?**
Le dice a Next.js "borra el cache de esta ruta y recarga los datos la próxima vez que alguien la visita". Es como un `cache.clear()`.

**¿Qué es `@/components/...` en los imports?**
El `@` es un alias para `src/`. Entonces `@/components/ui/button` = `src/components/ui/button`. Está configurado en `tsconfig.json`.

**¿Qué es un hook (`use-table-search.ts`)?**
En React, un "hook" es una función que empieza con `use` y puede tener estado interno. `use-table-search` encapsula la lógica de buscar, ordenar y paginar una tabla para no repetirla en cada sección.
