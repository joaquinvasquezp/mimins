# Prisma - ORM del Proyecto

## ¿Qué es Prisma?

Prisma es el ORM (Object-Relational Mapping) del proyecto. Hace lo mismo que SQLAlchemy o Django ORM en Python: te permite interactuar con la base de datos usando código TypeScript en vez de escribir SQL a mano.

**Diferencia clave con Python ORMs:** En Django/SQLAlchemy defines modelos en archivos `.py`. En Prisma defines modelos en un archivo propio (`schema.prisma`) con su propia sintaxis, y Prisma genera un cliente TypeScript tipado automáticamente.

---

## Archivos y carpetas de Prisma

```
mimins/
├── prisma/
│   ├── schema.prisma          ← Definición de modelos (la fuente de verdad)
│   ├── dev.db                 ← La base de datos SQLite (un archivo)
│   └── migrations/            ← Historial de cambios en la BD
│       └── 20260319025332_init/
│           └── migration.sql  ← SQL generado por la migración
│
├── prisma.config.ts           ← Configuración de Prisma (ruta del schema, BD, etc.)
├── .env                       ← Variables de entorno (DATABASE_URL)
│
└── src/generated/prisma/      ← Cliente tipado auto-generado (no tocar)
```

### `prisma/schema.prisma`
La fuente de verdad de tu base de datos. Acá defines todos los modelos, relaciones, constraints. Cuando cambias este archivo y corres una migración, Prisma actualiza la BD para que coincida.

### `prisma/dev.db`
El archivo SQLite. Toda la base de datos vive acá. Para hacer backup, basta con copiar este archivo.

### `prisma/migrations/`
Historial de cambios. Cada migración es una carpeta con el SQL que se ejecutó. Funciona igual que Alembic (Python) o las migraciones de Django: versiona los cambios de la BD para que sean reproducibles.

### `prisma.config.ts`
Configuración general: dónde está el schema, dónde van las migraciones, y la URL de conexión a la BD.

### `.env`
Variables de entorno. Actualmente solo tiene:
```
DATABASE_URL="file:./dev.db"
```
Esto le dice a Prisma que use el archivo `dev.db` dentro de `prisma/`.

### `src/generated/prisma/`
Cliente auto-generado. Prisma lee tu `schema.prisma` y genera código TypeScript con tipos para cada modelo. Esto es lo que importas en tu código para hacer queries. **Nunca se edita manualmente.**

---

## Anatomía de un modelo

Tomemos `Colegio` como ejemplo:

```prisma
model Colegio {
  // --- Campos ---
  id        Int      @id @default(autoincrement())
  nombre    String   @unique
  notas     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // --- Relaciones ---
  precios  PrecioProducto[]
  items    ItemPedido[]
  stocks   Stock[]

  // --- Configuración de tabla ---
  @@map("colegios")
}
```

### Campos

Cada línea es un campo con el formato: `nombre Tipo modificadores`

| Campo       | Tipo       | Significado                                                  |
| ----------- | ---------- | ------------------------------------------------------------ |
| `id`        | `Int`      | Número entero                                                |
| `nombre`    | `String`   | Texto                                                        |
| `notas`     | `String?`  | Texto **opcional** (el `?` = puede ser null)                 |
| `createdAt` | `DateTime` | Fecha y hora                                                 |
| `updatedAt` | `DateTime` | Fecha y hora                                                 |

### Decoradores de campo (@)

| Decorador                  | Qué hace                                                          | Equivalente Python              |
| -------------------------- | ----------------------------------------------------------------- | ------------------------------- |
| `@id`                      | Marca como primary key                                            | `primary_key=True`              |
| `@default(autoincrement())` | Auto-incrementa (1, 2, 3...)                                    | `autoincrement=True`            |
| `@default(now())`          | Valor por defecto = fecha actual                                  | `default=datetime.now`          |
| `@updatedAt`               | Se actualiza automáticamente al modificar el registro             | No hay equivalente directo      |
| `@unique`                  | Valor único, no se puede repetir                                  | `unique=True`                   |
| `@map("created_at")`       | En el código es `createdAt`, en la BD es `created_at`            | `db_column="created_at"`        |

### Decoradores de modelo (@@)

| Decorador                              | Qué hace                                                     |
| -------------------------------------- | ------------------------------------------------------------ |
| `@@map("colegios")`                    | El modelo es `Colegio` en código, la tabla es `colegios` en BD |
| `@@unique([productoId, colegioId, tallaId])` | Constraint único compuesto (la combinación no se puede repetir) |

### Relaciones

```prisma
// En Colegio:
precios  PrecioProducto[]    // Un colegio tiene MUCHOS precios (1:N)

// En PrecioProducto:
colegioId  Int       @map("colegio_id")                           // La FK
colegio    Colegio   @relation(fields: [colegioId], references: [id])  // La relación
```

- `PrecioProducto[]` (con `[]`) = "tiene muchos" (lado 1 de 1:N)
- `@relation(fields: [colegioId], references: [id])` = "este campo apunta al id de Colegio" (lado N de 1:N)
- Las relaciones no crean columnas en la BD, solo le dicen a Prisma cómo conectar los datos

**Equivalencia en Django:**
```python
# Django
class PrecioProducto(models.Model):
    colegio = models.ForeignKey(Colegio, on_delete=models.RESTRICT)

# Prisma
model PrecioProducto {
  colegioId  Int     @map("colegio_id")
  colegio    Colegio @relation(fields: [colegioId], references: [id])
}
```

---

## Tipos de datos en Prisma (SQLite)

| Tipo Prisma  | Tipo SQLite | Ejemplo                   |
| ------------ | ----------- | ------------------------- |
| `Int`        | INTEGER     | `1`, `42`, `100`          |
| `Float`      | REAL        | `15000.50`                |
| `String`     | TEXT        | `"Buzo"`, `"San José"`    |
| `Boolean`    | INTEGER     | `true` / `false`          |
| `DateTime`   | DATETIME    | `2026-03-18T12:00:00Z`    |

Agregar `?` a cualquier tipo lo hace opcional (nullable): `String?`, `DateTime?`, `Int?`

---

## Migraciones

Las migraciones son el sistema de versionado de la base de datos. Cada vez que cambias el `schema.prisma`, necesitas crear una migración para que la BD se actualice.

### Flujo de trabajo

```
1. Editas prisma/schema.prisma (agregas campo, tabla, etc.)
          │
          ▼
2. npx prisma migrate dev --name descripcion_del_cambio
          │
          ├── Genera SQL en prisma/migrations/TIMESTAMP_descripcion/
          ├── Ejecuta el SQL contra la BD
          └── Regenera el cliente tipado
          │
          ▼
3. Tu BD y tu código están sincronizados
```

### Comandos de migración

```bash
# Crear y aplicar una migración (desarrollo)
npx prisma migrate dev --name agregar_campo_x

# Aplicar migraciones pendientes (producción)
npx prisma migrate deploy

# Ver estado de las migraciones
npx prisma migrate status

# Resetear la BD completa (borra todo y re-aplica migraciones)
npx prisma migrate reset
```

### Ejemplo: agregar un campo nuevo

Supongamos que quieres agregar `direccion` a `Cliente`:

```prisma
model Cliente {
  id        Int      @id @default(autoincrement())
  nombre    String
  telefono  String
  correo    String?
  notas     String?
  direccion String?    // ← campo nuevo
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  pedidos Pedido[]
  @@map("clientes")
}
```

Luego:
```bash
npx prisma migrate dev --name agregar_direccion_cliente
```

Prisma genera automáticamente:
```sql
ALTER TABLE "clientes" ADD COLUMN "direccion" TEXT;
```

---

## Prisma Client: haciendo queries

Después de definir modelos y migrar, Prisma genera un cliente tipado que usas en tu código TypeScript.

### Configurar el cliente

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
export default prisma;
```

### Ejemplos de queries

```typescript
import prisma from "@/lib/prisma";

// --- CREAR ---
const cliente = await prisma.cliente.create({
  data: {
    nombre: "María López",
    telefono: "912345678",
  },
});

// --- BUSCAR TODOS ---
const clientes = await prisma.cliente.findMany();

// --- BUSCAR UNO ---
const cliente = await prisma.cliente.findUnique({
  where: { id: 1 },
});

// --- BUSCAR CON FILTRO ---
const pedidosPendientes = await prisma.pedido.findMany({
  where: { estado: "COTIZADO" },
});

// --- ACTUALIZAR ---
const actualizado = await prisma.cliente.update({
  where: { id: 1 },
  data: { telefono: "987654321" },
});

// --- ELIMINAR ---
await prisma.cliente.delete({
  where: { id: 1 },
});

// --- CON RELACIONES (include) ---
// Traer un pedido con su cliente, items y pagos
const pedido = await prisma.pedido.findUnique({
  where: { id: 1 },
  include: {
    cliente: true,
    items: {
      include: {
        producto: true,
        colegio: true,
        talla: true,
      },
    },
    pagos: true,
  },
});
// pedido.cliente.nombre → "María López"
// pedido.items[0].producto.nombre → "Buzo"
// pedido.items[0].talla.nombre → "M"
```

### Equivalencias con Django ORM

| Operación            | Django                                        | Prisma                                                  |
| -------------------- | --------------------------------------------- | ------------------------------------------------------- |
| Crear                | `Cliente.objects.create(nombre="X")`          | `prisma.cliente.create({ data: { nombre: "X" } })`     |
| Todos                | `Cliente.objects.all()`                        | `prisma.cliente.findMany()`                             |
| Buscar por ID        | `Cliente.objects.get(id=1)`                    | `prisma.cliente.findUnique({ where: { id: 1 } })`      |
| Filtrar              | `Pedido.objects.filter(estado="COTIZADO")`    | `prisma.pedido.findMany({ where: { estado: "COTIZADO" } })` |
| Actualizar           | `cliente.nombre = "Y"; cliente.save()`         | `prisma.cliente.update({ where: { id: 1 }, data: { nombre: "Y" } })` |
| Eliminar             | `cliente.delete()`                             | `prisma.cliente.delete({ where: { id: 1 } })`          |
| Con relaciones       | `select_related` / `prefetch_related`          | `include: { cliente: true }`                            |

---

## Prisma Studio

Prisma incluye una interfaz web para ver y editar datos directamente en la BD. Muy útil para debug y para cargar datos de prueba.

```bash
npx prisma studio
```

Abre `http://localhost:5555` con una vista de todas las tablas donde puedes:
- Ver todos los registros
- Crear, editar y eliminar registros
- Navegar relaciones entre tablas

---

## Comandos de referencia rápida

| Comando                              | Qué hace                                         |
| ------------------------------------ | ------------------------------------------------ |
| `npx prisma migrate dev --name x`   | Crea y aplica una migración                      |
| `npx prisma migrate reset`          | Borra la BD y re-aplica todas las migraciones    |
| `npx prisma generate`               | Regenera el cliente tipado (sin migrar)          |
| `npx prisma studio`                 | Abre interfaz web para ver/editar datos          |
| `npx prisma db push`                | Sincroniza schema → BD sin crear migración       |
| `npx prisma format`                 | Formatea el archivo schema.prisma                |
