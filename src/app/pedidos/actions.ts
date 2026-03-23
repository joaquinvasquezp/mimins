"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { VALID_ESTADOS, VALID_METODOS } from "@/lib/constants";

/** Parsea "yyyy-mm-dd" como fecha local (mediodía) para evitar desfase por zona horaria */
function parseLocalDate(iso: string): Date {
  return new Date(iso + "T12:00:00");
}

export async function getPedidos() {
  return prisma.pedido.findMany({
    include: {
      cliente: true,
      pagos: { select: { monto: true } },
      _count: { select: { items: true } },
    },
    orderBy: { fechaPedido: "desc" },
  });
}

export async function getPedido(id: number) {
  return prisma.pedido.findUnique({
    where: { id },
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
}

export async function createPedido(formData: FormData) {
  const clienteId = parseInt(formData.get("clienteId") as string, 10);
  const fechaPedido = formData.get("fechaPedido") as string;
  const fechaEntregaEstimada = formData.get("fechaEntregaEstimada") as string;
  const notas = formData.get("notas") as string;

  if (isNaN(clienteId)) {
    return { error: "El cliente es requerido" };
  }

  if (!fechaPedido) {
    return { error: "La fecha de pedido es requerida" };
  }

  try {
    const pedido = await prisma.pedido.create({
      data: {
        clienteId,
        fechaPedido: parseLocalDate(fechaPedido),
        fechaEntregaEstimada: fechaEntregaEstimada
          ? parseLocalDate(fechaEntregaEstimada)
          : null,
        notas: notas?.trim() || null,
        total: 0,
      },
    });

    revalidatePath("/pedidos");
    return { success: true, pedidoId: pedido.id };
  } catch {
    return { error: "No se pudo crear el pedido" };
  }
}

export async function updatePedido(id: number, formData: FormData) {
  const estado = formData.get("estado") as string;
  const fechaEntregaEstimada = formData.get("fechaEntregaEstimada") as string;
  const fechaEntregaReal = formData.get("fechaEntregaReal") as string;
  const notas = formData.get("notas") as string;

  const data: Record<string, unknown> = {};

  if (estado) {
    if (!VALID_ESTADOS.includes(estado)) {
      return { error: "Estado inválido" };
    }
    if (estado === "ENTREGADO") {
      const pedido = await prisma.pedido.findUnique({
        where: { id },
        include: { pagos: { select: { monto: true } } },
      });
      if (pedido) {
        const pagado = pedido.pagos.reduce((s, p) => s + p.monto, 0);
        if (pagado < pedido.total) {
          return { error: "No se puede marcar como entregado sin pago completo" };
        }
      }
    }
    data.estado = estado;
  }
  if (fechaEntregaEstimada !== null) {
    data.fechaEntregaEstimada = fechaEntregaEstimada
      ? parseLocalDate(fechaEntregaEstimada)
      : null;
  }
  if (fechaEntregaReal !== null) {
    data.fechaEntregaReal = fechaEntregaReal
      ? parseLocalDate(fechaEntregaReal)
      : null;
  }
  if (notas !== null) data.notas = notas?.trim() || null;

  try {
    await prisma.pedido.update({ where: { id }, data });
  } catch {
    return { error: "No se pudo actualizar el pedido" };
  }

  revalidatePath(`/pedidos/${id}`);
  revalidatePath("/pedidos");
  return { success: true };
}

export async function deletePedido(id: number) {
  try {
    await prisma.$transaction([
      prisma.pago.deleteMany({ where: { pedidoId: id } }),
      prisma.itemPedido.deleteMany({ where: { pedidoId: id } }),
      prisma.pedido.delete({ where: { id } }),
    ]);
  } catch {
    return { error: "No se puede eliminar este pedido" };
  }

  revalidatePath("/pedidos");
  return { success: true };
}

// ---- Items del pedido ----

async function recalcularTotal(pedidoId: number) {
  const items = await prisma.itemPedido.findMany({
    where: { pedidoId },
  });
  const total = items.reduce(
    (sum, item) => sum + item.precioUnitario * item.cantidad,
    0
  );
  await prisma.pedido.update({
    where: { id: pedidoId },
    data: { total },
  });
}

export async function addItem(formData: FormData) {
  const pedidoId = parseInt(formData.get("pedidoId") as string, 10);
  const productoId = parseInt(formData.get("productoId") as string, 10);
  const colegioId = parseInt(formData.get("colegioId") as string, 10);
  const tallaId = parseInt(formData.get("tallaId") as string, 10);
  const cantidad = parseInt(formData.get("cantidad") as string, 10);
  const precioUnitario = parseFloat(formData.get("precioUnitario") as string);
  const detalle = formData.get("detalle") as string;

  if (isNaN(productoId) || isNaN(colegioId) || isNaN(tallaId)) {
    return { error: "Producto, colegio y talla son requeridos" };
  }

  if (isNaN(cantidad) || cantidad < 1) {
    return { error: "La cantidad debe ser al menos 1" };
  }

  if (isNaN(precioUnitario) || precioUnitario < 0) {
    return { error: "El precio unitario debe ser un número válido" };
  }

  try {
    await prisma.itemPedido.create({
      data: {
        pedidoId,
        productoId,
        colegioId,
        tallaId,
        cantidad,
        precioUnitario,
        detalle: detalle?.trim() || null,
      },
    });

    await recalcularTotal(pedidoId);

    revalidatePath(`/pedidos/${pedidoId}`);
    return { success: true };
  } catch {
    return { error: "No se pudo agregar el item" };
  }
}

export async function updateItem(itemId: number, formData: FormData) {
  const cantidad = parseInt(formData.get("cantidad") as string, 10);
  const precioUnitario = parseFloat(formData.get("precioUnitario") as string);
  const detalle = formData.get("detalle") as string;

  if (isNaN(cantidad) || cantidad < 1) {
    return { error: "La cantidad debe ser al menos 1" };
  }

  if (isNaN(precioUnitario) || precioUnitario < 0) {
    return { error: "El precio unitario debe ser un número válido" };
  }

  try {
    const item = await prisma.itemPedido.update({
      where: { id: itemId },
      data: {
        cantidad,
        precioUnitario,
        detalle: detalle?.trim() || null,
      },
    });

    await recalcularTotal(item.pedidoId);

    revalidatePath(`/pedidos/${item.pedidoId}`);
    return { success: true };
  } catch {
    return { error: "No se pudo actualizar el item" };
  }
}

export async function deleteItem(itemId: number) {
  try {
    const item = await prisma.itemPedido.delete({
      where: { id: itemId },
    });

    await recalcularTotal(item.pedidoId);
    revalidatePath(`/pedidos/${item.pedidoId}`);
  } catch {
    return { error: "No se pudo eliminar el item" };
  }

  return { success: true };
}

// ---- Pagos del pedido ----

export async function addPago(formData: FormData) {
  const pedidoId = parseInt(formData.get("pedidoId") as string, 10);
  const monto = parseFloat(formData.get("monto") as string);
  const metodo = formData.get("metodo") as string;
  const fechaPago = formData.get("fechaPago") as string;
  const notas = formData.get("notas") as string;

  if (isNaN(pedidoId)) {
    return { error: "Pedido inválido" };
  }

  if (isNaN(monto) || monto <= 0) {
    return { error: "El monto debe ser mayor a 0" };
  }

  if (!metodo || !VALID_METODOS.includes(metodo)) {
    return { error: "Método de pago inválido" };
  }

  if (!fechaPago) {
    return { error: "La fecha de pago es requerida" };
  }

  try {
    await prisma.pago.create({
      data: {
        pedidoId,
        monto,
        metodo,
        fechaPago: parseLocalDate(fechaPago),
        notas: notas?.trim() || null,
      },
    });

    revalidatePath(`/pedidos/${pedidoId}`);
    return { success: true };
  } catch {
    return { error: "No se pudo registrar el pago" };
  }
}

export async function deletePago(pagoId: number) {
  try {
    const pago = await prisma.pago.delete({
      where: { id: pagoId },
    });

    revalidatePath(`/pedidos/${pago.pedidoId}`);
  } catch {
    return { error: "No se pudo eliminar el pago" };
  }

  return { success: true };
}
