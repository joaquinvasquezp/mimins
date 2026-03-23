"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getClientes() {
  return prisma.cliente.findMany({
    orderBy: { nombre: "asc" },
  });
}

export async function getCliente(id: number) {
  return prisma.cliente.findUnique({
    where: { id },
    include: {
      pedidos: {
        include: {
          pagos: { select: { monto: true } },
          _count: { select: { items: true } },
        },
        orderBy: { fechaPedido: "desc" },
      },
    },
  });
}

export async function createCliente(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  const correo = formData.get("correo") as string;
  const notas = formData.get("notas") as string;

  if (!nombre || nombre.trim() === "") {
    return { error: "El nombre es requerido" };
  }

  if (!telefono || telefono.trim() === "") {
    return { error: "El teléfono es requerido" };
  }

  try {
    const cliente = await prisma.cliente.create({
      data: {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        correo: correo?.trim() || null,
        notas: notas?.trim() || null,
      },
    });

    revalidatePath("/clientes");
    return { success: true, clienteId: cliente.id };
  } catch {
    return { error: "No se pudo crear el cliente" };
  }
}

export async function updateCliente(id: number, formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  const correo = formData.get("correo") as string;
  const notas = formData.get("notas") as string;

  if (!nombre || nombre.trim() === "") {
    return { error: "El nombre es requerido" };
  }

  if (!telefono || telefono.trim() === "") {
    return { error: "El teléfono es requerido" };
  }

  try {
    await prisma.cliente.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        correo: correo?.trim() || null,
        notas: notas?.trim() || null,
      },
    });

    revalidatePath("/clientes");
    return { success: true };
  } catch {
    return { error: "No se pudo actualizar el cliente" };
  }
}

export async function deleteCliente(id: number) {
  try {
    await prisma.cliente.delete({
      where: { id },
    });
  } catch {
    return { error: "No se puede eliminar: tiene pedidos asociados" };
  }

  revalidatePath("/clientes");
  return { success: true };
}
