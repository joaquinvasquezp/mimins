-- CreateTable
CREATE TABLE "colegios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "notas" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "productos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tallas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "precios_producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "producto_id" INTEGER NOT NULL,
    "colegio_id" INTEGER NOT NULL,
    "talla_id" INTEGER NOT NULL,
    "precio_venta" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "precios_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "precios_producto_colegio_id_fkey" FOREIGN KEY ("colegio_id") REFERENCES "colegios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "precios_producto_talla_id_fkey" FOREIGN KEY ("talla_id") REFERENCES "tallas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "historial_precios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precio_producto_id" INTEGER NOT NULL,
    "precio_venta_ant" REAL NOT NULL,
    "precio_venta_new" REAL NOT NULL,
    "fecha_cambio" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "historial_precios_precio_producto_id_fkey" FOREIGN KEY ("precio_producto_id") REFERENCES "precios_producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT,
    "notas" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cliente_id" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'COTIZADO',
    "fecha_pedido" DATETIME NOT NULL,
    "fecha_entrega_estimada" DATETIME,
    "fecha_entrega_real" DATETIME,
    "total" REAL NOT NULL,
    "notas" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "items_pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedido_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "colegio_id" INTEGER NOT NULL,
    "talla_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "detalle" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "items_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "items_pedido_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "items_pedido_colegio_id_fkey" FOREIGN KEY ("colegio_id") REFERENCES "colegios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "items_pedido_talla_id_fkey" FOREIGN KEY ("talla_id") REFERENCES "tallas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedido_id" INTEGER NOT NULL,
    "monto" REAL NOT NULL,
    "metodo" TEXT NOT NULL,
    "fecha_pago" DATETIME NOT NULL,
    "notas" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pagos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "stocks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "producto_id" INTEGER NOT NULL,
    "colegio_id" INTEGER NOT NULL,
    "talla_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "stocks_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stocks_colegio_id_fkey" FOREIGN KEY ("colegio_id") REFERENCES "colegios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stocks_talla_id_fkey" FOREIGN KEY ("talla_id") REFERENCES "tallas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "colegios_nombre_key" ON "colegios"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "tallas_nombre_key" ON "tallas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "precios_producto_producto_id_colegio_id_talla_id_key" ON "precios_producto"("producto_id", "colegio_id", "talla_id");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_producto_id_colegio_id_talla_id_key" ON "stocks"("producto_id", "colegio_id", "talla_id");
