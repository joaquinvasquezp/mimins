"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProductos() {
  return prisma.producto.findMany({
    orderBy: { nombre: "asc" },
  });
}

export async function createProducto(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const categoria = formData.get("categoria") as string;

  if (!nombre || nombre.trim() === "") {
    return { error: "El nombre es requerido" };
  }

  try {
    await prisma.producto.create({
      data: {
        nombre: nombre.trim(),
        categoria: categoria?.trim() || null,
      },
    });

    revalidatePath("/productos");
    return { success: true };
  } catch {
    return { error: "No se pudo crear el producto" };
  }
}

export async function updateProducto(id: number, formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const categoria = formData.get("categoria") as string;

  if (!nombre || nombre.trim() === "") {
    return { error: "El nombre es requerido" };
  }

  try {
    await prisma.producto.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        categoria: categoria?.trim() || null,
      },
    });

    revalidatePath("/productos");
    return { success: true };
  } catch {
    return { error: "No se pudo actualizar el producto" };
  }
}

export async function deleteProducto(id: number) {
  try {
    await prisma.producto.delete({
      where: { id },
    });
  } catch {
    return { error: "No se puede eliminar: tiene precios, pedidos o stock asociados" };
  }

  revalidatePath("/productos");
  return { success: true };
}
