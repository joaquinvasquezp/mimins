import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "db", "dev.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Helper
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
function localDate(iso) {
  return iso + "T12:00:00.000+00:00";
}
function now() {
  return new Date().toISOString();
}

// ============ LIMPIAR TODO MENOS TALLAS ============
console.log("Limpiando BD (manteniendo tallas)...");
db.exec("DELETE FROM historial_precios");
db.exec("DELETE FROM pagos");
db.exec("DELETE FROM items_pedido");
db.exec("DELETE FROM pedidos");
db.exec("DELETE FROM precios_producto");
db.exec("DELETE FROM clientes");
db.exec("DELETE FROM productos");
db.exec("DELETE FROM colegios");
db.exec("DELETE FROM stocks");

// ============ TALLAS (ya existen) ============
const tallas = db.prepare("SELECT id, nombre FROM tallas ORDER BY orden").all();
console.log(`Tallas existentes: ${tallas.map((t) => t.nombre).join(", ")}`);

// ============ COLEGIOS ============
console.log("Creando colegios...");
const colegiosData = [
  { nombre: "Colegio San Agustín", notas: "Ñuñoa, uniforme azul marino" },
  { nombre: "Liceo Bicentenario", notas: "Providencia, buzo gris" },
  { nombre: "Colegio Santa María", notas: "Las Condes, falda escocesa" },
  { nombre: "Escuela República de Chile", notas: "Santiago Centro" },
];
const insertColegio = db.prepare(
  "INSERT INTO colegios (nombre, notas, created_at, updated_at) VALUES (?, ?, ?, ?)"
);
const colegios = [];
for (const c of colegiosData) {
  const info = insertColegio.run(c.nombre, c.notas, now(), now());
  colegios.push({ id: Number(info.lastInsertRowid), nombre: c.nombre });
}
console.log(`  ${colegios.length} colegios creados`);

// ============ PRODUCTOS ============
console.log("Creando productos...");
const productosData = [
  { nombre: "Polera manga corta", categoria: "Poleras" },
  { nombre: "Polera manga larga", categoria: "Poleras" },
  { nombre: "Polera piqué", categoria: "Poleras" },
  { nombre: "Falda escolar", categoria: "Faldas" },
  { nombre: "Pantalón escolar", categoria: "Pantalones" },
  { nombre: "Short escolar", categoria: "Pantalones" },
  { nombre: "Buzo completo", categoria: "Buzos" },
  { nombre: "Polerón buzo", categoria: "Buzos" },
  { nombre: "Pantalón buzo", categoria: "Buzos" },
  { nombre: "Chaleco escolar", categoria: "Abrigo" },
  { nombre: "Parka escolar", categoria: "Abrigo" },
  { nombre: "Delantal", categoria: "Otros" },
];
const insertProducto = db.prepare(
  "INSERT INTO productos (nombre, categoria, created_at, updated_at) VALUES (?, ?, ?, ?)"
);
const productos = [];
for (const p of productosData) {
  const info = insertProducto.run(p.nombre, p.categoria, now(), now());
  productos.push({ id: Number(info.lastInsertRowid), nombre: p.nombre });
}
console.log(`  ${productos.length} productos creados`);

// ============ CLIENTES ============
console.log("Creando clientes...");
const nombres = [
  "María González", "Carolina Muñoz", "Patricia Soto", "Andrea López",
  "Claudia Hernández", "Daniela Rojas", "Lorena Díaz", "Francisca Torres",
  "Valentina Vargas", "Camila Morales", "Javiera Reyes", "Constanza Flores",
  "Fernanda Castillo", "Alejandra Espinoza", "Isabel Araya", "Paulina Contreras",
  "Catalina Figueroa", "Marcela Gutiérrez", "Verónica Núñez", "Soledad Pizarro",
  "Rosa Fuentes", "Carmen Bravo", "Teresa Salazar", "Macarena Vera",
  "Natalia Campos", "Adriana Peña", "Sandra Valenzuela", "Paola Tapia",
  "Mónica Sepúlveda", "Gloria Riquelme", "Susana Aravena", "Liliana Cárdenas",
  "Jessica Vega", "Elizabeth Paredes", "Ana Molina", "Marta Riveros",
  "Cecilia Sandoval", "Gabriela Cortés", "Pilar Donoso", "Ximena Garrido",
  "Margarita Bustos", "Victoria Inostroza", "Pamela Leiva", "Julia Moya",
  "Irene Poblete", "Antonia Ramírez", "Beatriz Saavedra", "Laura Ulloa",
  "Diana Yáñez", "Rocío Zamora",
];
const insertCliente = db.prepare(
  "INSERT INTO clientes (nombre, telefono, correo, notas, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
);
const clientes = [];
for (let i = 0; i < nombres.length; i++) {
  const tel = `+569${String(randomInt(10000000, 99999999))}`;
  const correo =
    i % 3 === 0
      ? `${nombres[i].split(" ")[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@correo.cl`
      : null;
  const notas = i % 5 === 0 ? "Cliente frecuente" : null;
  const info = insertCliente.run(nombres[i], tel, correo, notas, now(), now());
  clientes.push({ id: Number(info.lastInsertRowid), nombre: nombres[i] });
}
console.log(`  ${clientes.length} clientes creados`);

// ============ PRECIOS ============
console.log("Creando precios...");
const insertPrecio = db.prepare(
  "INSERT INTO precios_producto (producto_id, colegio_id, talla_id, precio_venta, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
);
const preciosCreados = [];
const basePrices = {
  "Polera manga corta": 8000,
  "Polera manga larga": 9500,
  "Polera piqué": 11000,
  "Falda escolar": 14000,
  "Pantalón escolar": 13000,
  "Short escolar": 9000,
  "Buzo completo": 22000,
  "Polerón buzo": 15000,
  "Pantalón buzo": 12000,
  "Chaleco escolar": 16000,
  "Parka escolar": 25000,
  "Delantal": 7000,
};

for (const prod of productos) {
  const basePrice = basePrices[prod.nombre] || 10000;
  for (const col of colegios) {
    // Variación por colegio (+/- 2000)
    const colegioVar = randomInt(-2000, 2000);
    // Solo algunas tallas por producto
    const tallasForProd =
      prod.nombre.includes("Delantal")
        ? tallas.filter((t) => ["S", "M", "L"].includes(t.nombre))
        : tallas;

    for (const talla of tallasForProd) {
      // Tallas grandes cuestan un poco más
      const tallaVar = talla.nombre === "XL" ? 1500 : talla.nombre === "L" ? 1000 : 0;
      const precio = Math.round((basePrice + colegioVar + tallaVar) / 500) * 500;
      const info = insertPrecio.run(prod.id, col.id, talla.id, precio, now(), now());
      preciosCreados.push({
        id: Number(info.lastInsertRowid),
        productoId: prod.id,
        colegioId: col.id,
        tallaId: talla.id,
        precio,
      });
    }
  }
}
console.log(`  ${preciosCreados.length} precios creados`);

// ============ HISTORIAL DE PRECIOS (simular cambios) ============
console.log("Simulando cambios de precio...");
const insertHistorial = db.prepare(
  "INSERT INTO historial_precios (precio_producto_id, precio_venta_ant, precio_venta_new, fecha_cambio, created_at) VALUES (?, ?, ?, ?, ?)"
);
const updatePrecio = db.prepare(
  "UPDATE precios_producto SET precio_venta = ?, updated_at = ? WHERE id = ?"
);
let historialCount = 0;
// Cambiar ~30 precios al azar
const preciosToChange = pickN(preciosCreados, 30);
for (const p of preciosToChange) {
  const oldPrice = p.precio;
  const change = pick([500, 1000, 1500, -500, -1000]);
  const newPrice = Math.max(3000, oldPrice + change);
  const fechaCambio = localDate(`2026-02-${String(randomInt(1, 28)).padStart(2, "0")}`);
  insertHistorial.run(p.id, oldPrice, newPrice, fechaCambio, now());
  updatePrecio.run(newPrice, now(), p.id);
  p.precio = newPrice;
  historialCount++;
}
console.log(`  ${historialCount} cambios de precio registrados`);

// ============ PEDIDOS ============
console.log("Creando pedidos...");
const estados = ["COTIZADO", "CONFIRMADO", "EN_PRODUCCION", "LISTO", "ENTREGADO", "CANCELADO"];
const insertPedido = db.prepare(
  "INSERT INTO pedidos (cliente_id, estado, fecha_pedido, fecha_entrega_estimada, fecha_entrega_real, total, notas, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
const insertItem = db.prepare(
  "INSERT INTO items_pedido (pedido_id, producto_id, colegio_id, talla_id, cantidad, precio_unitario, detalle, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
const insertPago = db.prepare(
  "INSERT INTO pagos (pedido_id, monto, metodo, fecha_pago, notas, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
);
const updatePedidoTotal = db.prepare(
  "UPDATE pedidos SET total = ? WHERE id = ?"
);

const pedidos = [];
const numPedidos = 80;

for (let i = 0; i < numPedidos; i++) {
  const cliente = pick(clientes);
  const colegio = pick(colegios);
  const estado = pick(estados);

  // Fechas realistas
  const mesBase = randomInt(1, 3);
  const diaBase = randomInt(1, 28);
  const fechaPedido = localDate(
    `2026-${String(mesBase).padStart(2, "0")}-${String(diaBase).padStart(2, "0")}`
  );

  const diasEntrega = randomInt(5, 20);
  const diaEntrega = Math.min(28, diaBase + diasEntrega);
  const mesEntrega = diaBase + diasEntrega > 28 ? Math.min(12, mesBase + 1) : mesBase;
  const fechaEntregaEstimada =
    estado !== "COTIZADO"
      ? localDate(
          `2026-${String(mesEntrega).padStart(2, "0")}-${String(diaEntrega).padStart(2, "0")}`
        )
      : null;

  const fechaEntregaReal =
    estado === "ENTREGADO"
      ? localDate(
          `2026-${String(mesEntrega).padStart(2, "0")}-${String(Math.min(28, diaEntrega + randomInt(-2, 3))).padStart(2, "0")}`
        )
      : null;

  const notas = pick([
    null,
    null,
    null,
    "Urgente",
    "Bordado con nombre",
    "Entregar en recepción",
    "Cliente habitual",
    "Pedido para hermanos",
  ]);

  const info = insertPedido.run(
    cliente.id,
    estado,
    fechaPedido,
    fechaEntregaEstimada,
    fechaEntregaReal,
    0, // total se calcula después
    notas,
    now(),
    now()
  );
  const pedidoId = Number(info.lastInsertRowid);

  // ---- Items del pedido (1 a 5) ----
  const numItems = randomInt(1, 5);
  const itemProducts = pickN(productos, numItems);
  let totalPedido = 0;

  for (const prod of itemProducts) {
    const talla = pick(tallas);
    const cantidad = randomInt(1, 4);

    // Buscar precio en tabla o usar base
    const precioRow = preciosCreados.find(
      (p) => p.productoId === prod.id && p.colegioId === colegio.id && p.tallaId === talla.id
    );
    const precioUnit = precioRow ? precioRow.precio : basePrices[prod.nombre] || 10000;
    const detalle = pick([null, null, null, "Sin logo", "Tela reforzada", "Bordado especial"]);

    insertItem.run(
      pedidoId,
      prod.id,
      colegio.id,
      talla.id,
      cantidad,
      precioUnit,
      detalle,
      now(),
      now()
    );
    totalPedido += precioUnit * cantidad;
  }

  updatePedidoTotal.run(totalPedido, pedidoId);

  // ---- Pagos ----
  if (estado === "ENTREGADO") {
    // Pagado completo (1 o 2 pagos)
    if (Math.random() > 0.4) {
      // Un solo pago
      insertPago.run(
        pedidoId,
        totalPedido,
        pick(["EFECTIVO", "TRANSFERENCIA"]),
        fechaPedido,
        null,
        now(),
        now()
      );
    } else {
      // Dos pagos (abono + saldo)
      const abono = Math.round(totalPedido * 0.5 / 500) * 500;
      insertPago.run(
        pedidoId,
        abono,
        "TRANSFERENCIA",
        fechaPedido,
        "Abono 50%",
        now(),
        now()
      );
      const fechaSaldo = localDate(
        `2026-${String(mesEntrega).padStart(2, "0")}-${String(Math.min(28, diaEntrega - 1)).padStart(2, "0")}`
      );
      insertPago.run(
        pedidoId,
        totalPedido - abono,
        pick(["EFECTIVO", "TRANSFERENCIA"]),
        fechaSaldo,
        "Saldo final",
        now(),
        now()
      );
    }
  } else if (["CONFIRMADO", "EN_PRODUCCION", "LISTO"].includes(estado)) {
    // Pago parcial o completo
    const pagoPct = pick([0, 0.3, 0.5, 0.7, 1.0]);
    if (pagoPct > 0) {
      const montoPago = Math.round(totalPedido * pagoPct / 500) * 500 || 500;
      insertPago.run(
        pedidoId,
        Math.min(montoPago, totalPedido),
        pick(["EFECTIVO", "TRANSFERENCIA"]),
        fechaPedido,
        pagoPct < 1 ? "Abono" : null,
        now(),
        now()
      );
    }
  }
  // COTIZADO y CANCELADO no tienen pagos

  pedidos.push({ id: pedidoId, estado, cliente: cliente.nombre });
}

console.log(`  ${numPedidos} pedidos creados`);

// ---- Resumen ----
const resumen = db
  .prepare("SELECT estado, COUNT(*) as total FROM pedidos GROUP BY estado")
  .all();
console.log("\nResumen de pedidos por estado:");
for (const r of resumen) {
  console.log(`  ${r.estado}: ${r.total}`);
}

const totalItems = db.prepare("SELECT COUNT(*) as n FROM items_pedido").get();
const totalPagos = db.prepare("SELECT COUNT(*) as n FROM pagos").get();
console.log(`\nTotal items: ${totalItems.n}`);
console.log(`Total pagos: ${totalPagos.n}`);
console.log(`Total precios: ${preciosCreados.length}`);
console.log(`Total historial: ${historialCount}`);
console.log("\nSeed completado!");

db.close();
