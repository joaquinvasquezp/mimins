"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTallas() {
  return prisma.talla.findMany({
    orderBy: { orden: "asc" },
  });
}

export async function createTalla(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const ordenStr = formData.get("orden") as string;

  if (!nombre || nombre.trim() === "") {
    return { error: "El nombre es requerido" };
  }

  const orden = parseInt(ordenStr, 10);
  if (isNaN(orden)) {
    return { error: "El orden debe ser un número" };
  }

  try {
    await prisma.talla.create({
      data: {
        nombre: nombre.trim(),
        orden,
      },
    });
  } catch {
    return { error: "Ya existe una talla con ese nombre" };
  }

  revalidatePath("/tallas");
  return { success: true };
}

export async function updateTalla(id: number, formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const ordenStr = formData.get("orden") as string;

  if (!nombre || nombre.trim() === "") {
    return { error: "El nombre es requerido" };
  }

  const orden = parseInt(ordenStr, 10);
  if (isNaN(orden)) {
    return { error: "El orden debe ser un número" };
  }

  try {
    await prisma.talla.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        orden,
      },
    });
  } catch {
    return { error: "Ya existe una talla con ese nombre" };
  }

  revalidatePath("/tallas");
  return { success: true };
}

export async function deleteTalla(id: number) {
  try {
    await prisma.talla.delete({
      where: { id },
    });
  } catch {
    return { error: "No se puede eliminar: tiene precios, pedidos o stock asociados" };
  }

  revalidatePath("/tallas");
  return { success: true };
}
