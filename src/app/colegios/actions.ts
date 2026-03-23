"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getColegios() {
  return prisma.colegio.findMany({
    orderBy: { nombre: "asc" },
  });
}

export async function getColegio(id: number) {
  return prisma.colegio.findUnique({
    where: { id },
    include: {
      clientes: {
        include: {
          pedidos: {
            include: {
              pagos: { select: { monto: true } },
              _count: { select: { items: true } },
            },
            orderBy: { fechaPedido: "desc" },
          },
        },
        orderBy: { nombre: "asc" },
      },
    },
  });
}

export async function createColegio(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const notas = formData.get("notas") as string;

  if (!nombre || nombre.trim() === "") {
    return { error: "El nombre es requerido" };
  }

  try {
    await prisma.colegio.create({
      data: {
        nombre: nombre.trim(),
        notas: notas?.trim() || null,
      },
    });
  } catch {
    return { error: "Ya existe un colegio con ese nombre" };
  }

  revalidatePath("/colegios");
  return { success: true };
}

export async function updateColegio(id: number, formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const notas = formData.get("notas") as string;

  if (!nombre || nombre.trim() === "") {
    return { error: "El nombre es requerido" };
  }

  try {
    await prisma.colegio.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        notas: notas?.trim() || null,
      },
    });
  } catch {
    return { error: "Ya existe un colegio con ese nombre" };
  }

  revalidatePath("/colegios");
  return { success: true };
}

export async function deleteColegio(id: number) {
  try {
    await prisma.colegio.delete({
      where: { id },
    });
  } catch {
    return { error: "No se puede eliminar: tiene productos o pedidos asociados" };
  }

  revalidatePath("/colegios");
  return { success: true };
}
