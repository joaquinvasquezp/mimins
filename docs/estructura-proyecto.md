# Estructura del Proyecto

## Vista general

```
mimins/
├── docs/                      ← Documentación del proyecto
│   ├── modelo-negocio.md      ← Modelo de datos y flujo del negocio
│   ├── stack-tecnologico.md   ← Tecnologías usadas y para qué sirve cada una
│   └── estructura-proyecto.md ← Este archivo
│
├── prisma/                    ← (pendiente) Definición de la base de datos
│   ├── schema.prisma          ← Modelos: Cliente, Pedido, Producto, etc.
│   └── migrations/            ← Historial de cambios en la BD
│
├── public/                    ← Archivos estáticos (imágenes, íconos)
│   ├── file.svg               ← Íconos de ejemplo de Next.js (se pueden borrar)
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/                       ← Código fuente principal
│   └── app/                   ← App Router de Next.js (páginas y API)
│       ├── layout.tsx         ← Layout raíz (envuelve todas las páginas)
│       ├── page.tsx           ← Página principal (ruta /)
│       ├── globals.css        ← Estilos globales (Tailwind base)
│       └── favicon.ico        ← Ícono de la pestaña del navegador
│
├── .gitignore                 ← Archivos que git ignora (node_modules, .next, etc.)
├── .next/                     ← Build generado por Next.js (no se commitea)
├── eslint.config.mjs          ← Configuración del linter
├── LICENSE                    ← Licencia MIT
├── next.config.ts             ← Configuración de Next.js
├── next-env.d.ts              ← Tipos auto-generados por Next.js (no tocar)
├── node_modules/              ← Dependencias instaladas (no se commitea)
├── package.json               ← Dependencias y scripts del proyecto
├── package-lock.json          ← Versiones exactas de dependencias (se commitea)
├── postcss.config.mjs         ← Configuración de PostCSS (necesario para Tailwind)
├── README.md                  ← README del repo
└── tsconfig.json              ← Configuración de TypeScript
```

## Estructura futura (a medida que crezca)

```
src/
├── app/                       ← Páginas y API routes
│   ├── layout.tsx             ← Layout raíz
│   ├── page.tsx               ← Dashboard / página principal
│   ├── globals.css
│   │
│   ├── clientes/              ← Ruta /clientes
│   │   └── page.tsx           ← Lista de clientes
│   │
│   ├── pedidos/               ← Ruta /pedidos
│   │   ├── page.tsx           ← Lista de pedidos
│   │   ├── nuevo/
│   │   │   └── page.tsx       ← Crear nuevo pedido/cotización
│   │   └── [id]/
│   │       └── page.tsx       ← Detalle de un pedido (ruta dinámica)
│   │
│   ├── productos/             ← Ruta /productos
│   │   └── page.tsx           ← Catálogo con precios por colegio/talla
│   │
│   └── api/                   ← API Routes (backend)
│       ├── clientes/
│       │   └── route.ts       ← GET, POST /api/clientes
│       ├── pedidos/
│       │   └── route.ts       ← GET, POST /api/pedidos
│       └── productos/
│           └── route.ts       ← GET, POST /api/productos
│
├── components/                ← Componentes reutilizables
│   ├── ui/                    ← Componentes base (shadcn: Button, Input, Table, etc.)
│   ├── forms/                 ← Formularios (FormCliente, FormPedido, etc.)
│   └── layout/                ← Componentes de layout (Sidebar, Header, etc.)
│
└── lib/                       ← Utilidades y configuración
    ├── prisma.ts              ← Instancia del cliente Prisma
    └── utils.ts               ← Funciones auxiliares
```

---

## Cómo funciona el routing en Next.js (App Router)

El routing es automático basado en la estructura de carpetas dentro de `src/app/`:

| Carpeta                     | URL resultante     | Qué muestra                  |
| --------------------------- | ------------------ | ---------------------------- |
| `src/app/page.tsx`          | `/`                | Página principal / Dashboard |
| `src/app/clientes/page.tsx` | `/clientes`        | Lista de clientes            |
| `src/app/pedidos/page.tsx`  | `/pedidos`         | Lista de pedidos             |
| `src/app/pedidos/nuevo/page.tsx` | `/pedidos/nuevo` | Formulario nuevo pedido  |
| `src/app/pedidos/[id]/page.tsx`  | `/pedidos/123`   | Detalle del pedido 123   |

> **`[id]`** es una ruta dinámica. El valor entre corchetes se captura como parámetro. Es como `<int:id>` en Flask o `<int:pk>` en Django.

---

## Archivos clave explicados

### `src/app/layout.tsx`
El layout raíz. Envuelve TODAS las páginas. Acá va la estructura común: sidebar, header, navegación. Se renderiza una sola vez y las páginas hijas cambian dentro.

### `src/app/page.tsx`
La página de la ruta `/`. Será el dashboard principal.

### `src/app/globals.css`
Estilos globales. Importa Tailwind y define estilos base que aplican a todo el proyecto.

### `package.json`
Define el proyecto: nombre, versión, scripts disponibles y dependencias.

**Scripts disponibles:**
```bash
npm run dev    # Inicia servidor de desarrollo (http://localhost:3000)
npm run build  # Genera build de producción
npm run start  # Corre el build de producción
npm run lint   # Ejecuta el linter (revisa calidad del código)
```

### `tsconfig.json`
Configuración de TypeScript. Define cómo se compila el código, qué tan estrictos son los tipos, y aliases de importación (`@/*` apunta a `src/*`).

### `prisma/schema.prisma` (pendiente)
Donde se definirán los modelos de la base de datos. Cada modelo se traduce a una tabla en SQLite.
