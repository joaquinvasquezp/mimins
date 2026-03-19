# Shadcn/ui - Componentes UI

## ¿Qué es Shadcn/ui?

Shadcn/ui es una colección de componentes UI (botones, tablas, formularios, modales, selects, etc.) construidos con Tailwind CSS. **No es una librería que instalas como dependencia**, sino que los componentes se copian directamente a tu proyecto. Esto significa que tienes control total sobre ellos: puedes modificarlos libremente.

**Diferencia con otras librerías UI:**
- **Bootstrap / Material UI** → instalas un paquete, usas sus componentes tal cual, difícil de personalizar
- **Shadcn/ui** → copias el código del componente a tu proyecto, lo usas, y si necesitas cambiarlo lo editas directamente

---

## Archivos y estructura

```
mimins/
├── components.json                ← Configuración de shadcn (estilos, rutas, aliases)
│
├── src/
│   ├── components/
│   │   └── ui/                    ← Componentes UI de shadcn (se agregan acá)
│   │       └── button.tsx         ← Componente Button (instalado por defecto)
│   │
│   ├── lib/
│   │   └── utils.ts              ← Función cn() para combinar clases CSS
│   │
│   └── app/
│       └── globals.css            ← Variables CSS de tema (colores, bordes, etc.)
```

### `components.json`

Configuración de shadcn. Define:
- **style:** `"base-nova"` — el estilo visual base de los componentes
- **rsc:** `true` — soporte para React Server Components (Next.js)
- **tsx:** `true` — usa TypeScript
- **iconLibrary:** `"lucide"` — librería de íconos (Lucide Icons)
- **aliases:** rutas para importar (`@/components`, `@/lib`, etc.)

Este archivo se genera al correr `npx shadcn@latest init` y rara vez se modifica.

### `src/components/ui/`

Acá viven los componentes de shadcn. Cada componente es un archivo `.tsx` independiente. Actualmente solo tenemos `button.tsx`. A medida que agreguemos componentes (table, input, dialog, select, etc.), aparecerán acá.

### `src/lib/utils.ts`

Contiene la función `cn()`:

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

`cn()` combina clases de Tailwind de forma inteligente. Resuelve conflictos entre clases (si pasas `bg-red-500` y `bg-blue-500`, se queda con la última). Todos los componentes de shadcn la usan.

**Ejemplo:**
```typescript
cn("bg-red-500 p-4", "bg-blue-500")
// Resultado: "p-4 bg-blue-500" (bg-blue gana sobre bg-red)

cn("p-4", isActive && "bg-primary text-white")
// Si isActive es true: "p-4 bg-primary text-white"
// Si isActive es false: "p-4"
```

### `src/app/globals.css`

Shadcn usa CSS variables para definir el tema. Acá se definen todos los colores, bordes y radios tanto para modo claro como oscuro:

```css
:root {
  --background: oklch(1 0 0);         /* Fondo claro */
  --foreground: oklch(0.145 0 0);     /* Texto oscuro */
  --primary: oklch(0.205 0 0);        /* Color principal */
  --destructive: oklch(0.577 ...);    /* Color de error/eliminar */
  --border: oklch(0.922 0 0);         /* Color de bordes */
  --radius: 0.625rem;                 /* Redondeo de esquinas */
  /* ... más variables */
}

.dark {
  --background: oklch(0.145 0 0);     /* Fondo oscuro */
  --foreground: oklch(0.985 0 0);     /* Texto claro */
  /* ... mismas variables con valores oscuros */
}
```

Para cambiar el tema del proyecto entero, solo se modifican estas variables.

---

## Anatomía de un componente: Button

```tsx
"use client"                    // ← Componente del lado del cliente (interactivo)

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// cva() define las variantes del componente
const buttonVariants = cva(
  "base-classes...",             // ← Clases que siempre aplican
  {
    variants: {
      variant: {                 // ← Variantes de estilo
        default: "bg-primary text-primary-foreground ...",
        outline: "border-border bg-background ...",
        secondary: "bg-secondary ...",
        ghost: "hover:bg-muted ...",
        destructive: "bg-destructive/10 text-destructive ...",
        link: "text-primary underline-offset-4 ...",
      },
      size: {                    // ← Variantes de tamaño
        default: "h-8 gap-1.5 px-2.5",
        xs: "h-6 ...",
        sm: "h-7 ...",
        lg: "h-9 ...",
        icon: "size-8",
      },
    },
    defaultVariants: {           // ← Valores por defecto
      variant: "default",
      size: "default",
    },
  }
)

function Button({ className, variant, size, ...props }) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Conceptos clave del componente

**`"use client"`** — Le dice a Next.js que este componente es interactivo (maneja clicks, estados, etc.) y debe ejecutarse en el navegador. Sin esta directiva, Next.js lo renderiza en el servidor.

**`cva()` (Class Variance Authority)** — Permite definir variantes de un componente de forma organizada. En vez de hacer `if/else` para cambiar clases según props, las defines declarativamente.

**`cn()`** — Combina las clases base del componente con las clases adicionales que le pases.

### Uso del Button

```tsx
// Botón por defecto
<Button>Guardar</Button>

// Botón de eliminar (rojo)
<Button variant="destructive">Eliminar</Button>

// Botón outline grande
<Button variant="outline" size="lg">Cancelar</Button>

// Botón con clase extra
<Button className="w-full">Botón ancho completo</Button>
```

---

## Cómo agregar nuevos componentes

Se agregan con el CLI de shadcn. **No se crean manualmente.**

```bash
# Agregar un componente específico
npx shadcn@latest add input
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add select

# Agregar varios a la vez
npx shadcn@latest add input label textarea select

# Ver todos los componentes disponibles
npx shadcn@latest add
```

Cada comando descarga el componente a `src/components/ui/` y si necesita dependencias adicionales las instala automáticamente.

### Componentes que usaremos en el proyecto

| Componente   | Para qué lo usaremos                                    |
| ------------ | ------------------------------------------------------- |
| `button`     | Acciones: guardar, eliminar, cancelar, cambiar estado   |
| `input`      | Campos de texto: nombre, teléfono, correo               |
| `label`      | Etiquetas de formulario                                 |
| `textarea`   | Campo de detalle/especificaciones de prendas            |
| `select`     | Seleccionar colegio, producto, talla, método de pago    |
| `table`      | Listar pedidos, clientes, productos, precios            |
| `dialog`     | Modales para crear/editar registros                     |
| `badge`      | Mostrar estados del pedido (COTIZADO, LISTO, etc.)      |
| `card`       | Contenedores de información (resumen de pedido, etc.)   |
| `toast`      | Notificaciones: "Pedido guardado", "Error al guardar"   |

---

## Tailwind CSS - Lo básico

Shadcn/ui está construido sobre Tailwind. Tailwind usa clases utilitarias en vez de CSS tradicional:

### CSS tradicional vs Tailwind

```html
<!-- CSS tradicional -->
<div class="card">
  <h1 class="card-title">Hola</h1>
</div>
<style>
  .card { background: white; padding: 16px; border-radius: 8px; }
  .card-title { font-size: 20px; font-weight: bold; }
</style>

<!-- Tailwind -->
<div className="bg-white p-4 rounded-lg">
  <h1 className="text-xl font-bold">Hola</h1>
</div>
```

### Clases más comunes

| Clase            | Qué hace                  | CSS equivalente              |
| ---------------- | ------------------------- | ---------------------------- |
| `p-4`            | Padding 16px              | `padding: 1rem`             |
| `px-4`           | Padding horizontal 16px   | `padding-left/right: 1rem`  |
| `m-2`            | Margin 8px                | `margin: 0.5rem`            |
| `mt-4`           | Margin top 16px           | `margin-top: 1rem`          |
| `w-full`         | Ancho 100%                | `width: 100%`               |
| `h-10`           | Alto 40px                 | `height: 2.5rem`            |
| `text-sm`        | Texto pequeño             | `font-size: 0.875rem`       |
| `text-lg`        | Texto grande              | `font-size: 1.125rem`       |
| `font-bold`      | Negrita                   | `font-weight: 700`          |
| `bg-primary`     | Fondo color primario      | `background-color: var(--primary)` |
| `text-white`     | Texto blanco              | `color: white`              |
| `rounded-lg`     | Bordes redondeados        | `border-radius: 0.5rem`     |
| `border`         | Borde de 1px              | `border: 1px solid`         |
| `flex`           | Display flex              | `display: flex`              |
| `gap-4`          | Espacio entre items flex  | `gap: 1rem`                 |
| `grid`           | Display grid              | `display: grid`              |
| `hidden`         | Ocultar                   | `display: none`              |
| `hover:bg-muted` | Fondo al pasar el mouse   | `:hover { background: ... }` |

### Responsive

Tailwind usa prefijos para breakpoints:

```html
<!-- Columna en mobile, fila en desktop -->
<div className="flex flex-col md:flex-row">

<!-- Texto pequeño en mobile, grande en desktop -->
<h1 className="text-lg md:text-2xl">
```

| Prefijo | Breakpoint | Dispositivo          |
| ------- | ---------- | -------------------- |
| (nada)  | 0px+       | Mobile (por defecto) |
| `sm:`   | 640px+     | Mobile grande        |
| `md:`   | 768px+     | Tablet               |
| `lg:`   | 1024px+    | Desktop              |
| `xl:`   | 1280px+    | Desktop grande       |

---

## Lucide Icons

Shadcn usa Lucide como librería de íconos. Son íconos SVG limpios y consistentes.

```tsx
import { Plus, Trash2, Pencil, Search } from "lucide-react"

// Uso
<Button>
  <Plus /> Nuevo pedido
</Button>

<Button variant="destructive" size="icon">
  <Trash2 />
</Button>
```

Se instala automáticamente con shadcn. Para buscar íconos disponibles: https://lucide.dev/icons/

---

## Comandos de referencia rápida

| Comando                          | Qué hace                                           |
| -------------------------------- | -------------------------------------------------- |
| `npx shadcn@latest add [comp]`  | Agrega un componente a `src/components/ui/`        |
| `npx shadcn@latest add`         | Lista todos los componentes disponibles             |
| `npx shadcn@latest diff`        | Muestra diferencias entre tus componentes y los originales |
