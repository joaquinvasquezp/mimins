# Mimins - Modelo de Negocio

## Contexto

Sistema de gestión de pedidos para tienda de uniformes escolares. Negocio familiar donde se confecciona en taller propio con ayudantes. Trabaja principalmente bajo pedido pero mantiene algo de stock. Atiende ~3 colegios fijos de la zona. Entrega en local (no delivery). Pagos en efectivo y transferencia.

---

## Flujo del Negocio

```
Cliente llega
    │
    ▼
Consulta productos/precios (catálogo por colegio)
    │
    ▼
Se genera COTIZACIÓN (pedido estado: COTIZADO)
    │
    ├── Cliente NO acepta → CANCELADO (fin)
    │
    ▼
Cliente ACEPTA → Estado: CONFIRMADO
    │
    ▼
Pago (total o parcial/seña)
    │
    ▼
EN_PREPARACIÓN (confección/ajustes en taller)
    │
    ▼
LISTO_PARA_ENTREGA (se avisa al cliente)
    │
    ▼
Cliente retira + pago restante (si hubo seña)
    │
    ▼
ENTREGADO (cerrado)
```

---

## Estados del Pedido

| Estado            | Descripción                                              |
| ----------------- | -------------------------------------------------------- |
| `COTIZADO`        | Cotización generada, esperando respuesta del cliente     |
| `CONFIRMADO`      | Cliente aceptó, puede o no haber pagado                  |
| `EN_PREPARACION`  | En confección/ajustes en el taller                       |
| `LISTO`           | Terminado, esperando retiro del cliente                  |
| `ENTREGADO`       | Cliente retiró, pedido cerrado                           |
| `CANCELADO`       | Anulado en cualquier punto del flujo                     |

### Transiciones válidas

```
COTIZADO → CONFIRMADO
COTIZADO → CANCELADO
CONFIRMADO → EN_PREPARACION
CONFIRMADO → CANCELADO
EN_PREPARACION → LISTO
LISTO → ENTREGADO
```

---

## Modelo de Datos

> Todas las tablas incluyen `created_at` (fecha de creación) y `updated_at` (última modificación), ambos `datetime` y autogenerados.

### Cliente

| Campo      | Tipo     | Requerido | Descripción                    |
| ---------- | -------- | --------- | ------------------------------ |
| id         | PK       | ✅        | Identificador único            |
| nombre     | string   | ✅        | Nombre completo                |
| telefono   | string   | ✅        | Número de contacto (WhatsApp)  |
| correo     | string   | ❌        | Email opcional                 |
| notas      | text     | ❌        | Observaciones del cliente      |
| created_at | datetime | ✅        | Fecha de creación              |
| updated_at | datetime | ✅        | Última modificación            |

### Colegio

| Campo      | Tipo     | Requerido | Descripción         |
| ---------- | -------- | --------- | ------------------- |
| id         | PK       | ✅        | Identificador único |
| nombre     | string   | ✅        | Nombre del colegio  |
| notas      | text     | ❌        | Observaciones       |
| created_at | datetime | ✅        | Fecha de creación   |
| updated_at | datetime | ✅        | Última modificación |

### Producto

| Campo      | Tipo     | Requerido | Descripción                              |
| ---------- | -------- | --------- | ---------------------------------------- |
| id         | PK       | ✅        | Identificador único                      |
| nombre     | string   | ✅        | Ej: "Buzo", "Pantalón", "Polera"        |
| categoria  | string   | ❌        | Para agrupar si crece el catálogo        |
| created_at | datetime | ✅        | Fecha de creación                        |
| updated_at | datetime | ✅        | Última modificación                      |

### Talla

| Campo      | Tipo     | Requerido | Descripción                                  |
| ---------- | -------- | --------- | -------------------------------------------- |
| id         | PK       | ✅        | Identificador único                          |
| nombre     | string   | ✅        | Ej: "16", "S", "M", "L", "XL"               |
| orden      | int      | ✅        | Para ordenar de menor a mayor (1, 2, 3...)   |
| created_at | datetime | ✅        | Fecha de creación                            |
| updated_at | datetime | ✅        | Última modificación                          |

> El campo `orden` permite mostrar las tallas en secuencia lógica (16 → S → M → L → XL) y no alfabéticamente.

### PrecioProducto (tabla cruce: Producto × Colegio × Talla)

| Campo          | Tipo            | Requerido | Descripción                                        |
| -------------- | --------------- | --------- | -------------------------------------------------- |
| id             | PK              | ✅        | Identificador único                                |
| producto_id    | FK → Producto   | ✅        | Qué producto                                       |
| colegio_id     | FK → Colegio    | ✅        | De qué colegio                                     |
| talla_id       | FK → Talla      | ✅        | Qué talla                                          |
| precio_venta   | decimal         | ✅        | Precio actual al cliente                           |
| created_at     | datetime        | ✅        | Fecha de creación                                  |
| updated_at     | datetime        | ✅        | Última modificación                                |

> **Clave única:** La combinación `producto_id + colegio_id + talla_id` debe ser única. Esto permite que un "Buzo - Colegio San José - XL" tenga un precio distinto a un "Buzo - Colegio San José - S".

### HistorialPrecio

| Campo              | Tipo                 | Requerido | Descripción                                       |
| ------------------ | -------------------- | --------- | ------------------------------------------------- |
| id                 | PK                   | ✅        | Identificador único                               |
| precio_producto_id | FK → PrecioProducto  | ✅        | Qué registro de precio cambió                     |
| precio_venta_ant   | decimal              | ✅        | Precio de venta anterior                          |
| precio_venta_new   | decimal              | ✅        | Precio de venta nuevo                             |
| fecha_cambio       | date                 | ✅        | Cuándo cambió el precio realmente                 |
| created_at         | datetime             | ✅        | Cuándo se registró en el sistema                  |

> Se genera cada vez que se modifica `precio_venta` en `PrecioProducto`. `fecha_cambio` permite registrar la fecha real del cambio (puede ser retroactiva), mientras `created_at` es la fecha de ingreso al sistema.
>
> **Ejemplo de consulta:** "¿Cuánto subió el buzo talla M del Colegio San José en el último año?"

### Pedido

| Campo                  | Tipo          | Requerido | Descripción                                                                  |
| ---------------------- | ------------- | --------- | ---------------------------------------------------------------------------- |
| id                     | PK            | ✅        | Identificador / número de pedido                                             |
| cliente_id             | FK → Cliente  | ✅        | Quién hace el pedido                                                         |
| estado                 | enum          | ✅        | COTIZADO, CONFIRMADO, EN_PREPARACION, LISTO, ENTREGADO, CANCELADO            |
| fecha_pedido           | date          | ✅        | Cuándo se realizó el pedido realmente (puede diferir de created_at)          |
| fecha_entrega_estimada | date          | ❌        | Cuándo se estima entregar                                                    |
| fecha_entrega_real     | datetime      | ❌        | Cuándo se entregó realmente                                                  |
| total                  | decimal       | ✅        | Monto total del pedido                                                       |
| notas                  | text          | ❌        | Observaciones generales                                                      |
| created_at             | datetime      | ✅        | Cuándo se registró en el sistema                                             |
| updated_at             | datetime      | ✅        | Última modificación                                                          |

### ItemPedido

| Campo           | Tipo            | Requerido | Descripción                                                        |
| --------------- | --------------- | --------- | ------------------------------------------------------------------ |
| id              | PK              | ✅        | Identificador único                                                |
| pedido_id       | FK → Pedido     | ✅        | A qué pedido pertenece                                             |
| producto_id     | FK → Producto   | ✅        | Qué prenda                                                         |
| colegio_id      | FK → Colegio    | ✅        | De qué colegio                                                     |
| talla_id        | FK → Talla      | ✅        | Qué talla                                                          |
| cantidad        | int             | ✅        | Cuántas unidades                                                   |
| precio_unitario | decimal         | ✅        | Precio al momento de la venta (snapshot)                           |
| detalle         | text            | ❌        | Especificaciones: "quitar 2cm de basta", "manga más corta", etc.   |
| created_at      | datetime        | ✅        | Fecha de creación                                                  |
| updated_at      | datetime        | ✅        | Última modificación                                                |

### Pago

| Campo      | Tipo         | Requerido | Descripción                                      |
| ---------- | ------------ | --------- | ------------------------------------------------ |
| id         | PK           | ✅        | Identificador único                              |
| pedido_id  | FK → Pedido  | ✅        | A qué pedido corresponde                         |
| monto      | decimal      | ✅        | Cuánto se pagó                                   |
| metodo     | enum         | ✅        | EFECTIVO, TRANSFERENCIA                          |
| notas      | text         | ❌        | Ej: "seña inicial", "pago final al retirar"     |
| fecha_pago | date         | ✅        | Cuándo se realizó el pago realmente (puede diferir de created_at)  |
| created_at | datetime     | ✅        | Cuándo se registró en el sistema                 |
| updated_at | datetime     | ✅        | Última modificación                              |

### Stock (inventario básico)

| Campo       | Tipo            | Requerido | Descripción          |
| ----------- | --------------- | --------- | -------------------- |
| id          | PK              | ✅        | Identificador único  |
| producto_id | FK → Producto   | ✅        | Qué prenda           |
| colegio_id  | FK → Colegio    | ✅        | De qué colegio       |
| talla_id    | FK → Talla      | ✅        | Qué talla            |
| cantidad    | int             | ✅        | Unidades en stock    |
| created_at  | datetime        | ✅        | Fecha de creación    |
| updated_at  | datetime        | ✅        | Última modificación  |

---

## Diagrama Entidad-Relación

```
┌──────────┐        ┌──────────────┐
│ Cliente  │1─────N│   Pedido     │
└──────────┘        └──────┬───────┘
                           │ 1
                           │
                           │ N
                    ┌──────┴───────┐         ┌────────────────┐
                    │  ItemPedido  │         │ PrecioProducto │
                    ├──────────────┤         ├────────────────┤
                    │ producto_id──┼──┐      │ producto_id────┼──┐
                    │ colegio_id───┼─┐│      │ colegio_id─────┼─┐│
                    │ talla        │ ││      │ precio_venta   │ ││
                    │ cantidad     │ ││      │ costo_material │ ││
                    │ precio_unit  │ ││      └────────────────┘ ││
                    │ detalle      │ ││                          ││
                    └──────────────┘ ││      ┌──────────┐       ││
                                     │├─────►│ Producto │◄──────┘│
                    ┌──────────┐     ││      └──────────┘        │
                    │   Pago   │     ││                           │
                    ├──────────┤     ││      ┌──────────┐        │
                    │ pedido_id│     │└─────►│ Colegio  │◄───────┘
                    │ monto    │     │       └────┬─────┘
                    │ metodo   │     │            │
                    │ fecha    │     │       ┌────┴─────┐
                    └─────┬────┘     │       │  Stock   │
                          │          │       ├──────────┤
                          N          │       │producto_id
                          │          │       │colegio_id
                          1          │       │talla
                       Pedido        │       │cantidad
                                     │       └──────────┘
                                     │            ▲
                                     │            │
                                     └────────────┘
```

---

## Resumen de Relaciones

| Relación                             | Tipo | Descripción                               |
| ------------------------------------ | ---- | ----------------------------------------- |
| Cliente → Pedido                     | 1:N  | Un cliente puede tener muchos pedidos     |
| Pedido → ItemPedido                  | 1:N  | Un pedido tiene múltiples prendas         |
| Pedido → Pago                        | 1:N  | Un pedido puede tener múltiples pagos     |
| Producto → ItemPedido                | 1:N  | Un producto aparece en muchos items       |
| Colegio → ItemPedido                 | 1:N  | Un colegio aparece en muchos items        |
| Talla → ItemPedido                   | 1:N  | Una talla aparece en muchos items         |
| Talla → PrecioProducto              | 1:N  | Una talla aparece en muchos precios       |
| Talla → Stock                        | 1:N  | Una talla aparece en muchos registros     |
| Producto × Colegio × Talla → PrecioProducto | N:M  | Precio específico por combinación producto + colegio + talla |
| PrecioProducto → HistorialPrecio     | 1:N  | Cada cambio de precio genera un registro en el historial     |
| Producto × Colegio × Talla → Stock   | N:M  | Stock por combinación                     |

---

## Control de Costos y Márgenes (futuro)

> **Estado:** Omitido de la primera versión. Se implementará cuando se tenga claridad sobre cómo se quiere usar.
>
> **Ideas para cuando se retome:**
> - Agregar `costo_material` a `PrecioProducto` para calcular margen por prenda
> - Tabla `Gasto` para registrar compras de tela e insumos
> - Dashboard de márgenes: precio de venta vs costo material
