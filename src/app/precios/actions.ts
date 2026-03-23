"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPrecios() {
  return prisma.precioProducto.findMany({
    include: {
      producto: true,
      colegio: true,
      talla: true,
    },
    orderBy: [
      { producto: { nombre: "asc" } },
      { colegio: { nombre: "asc" } },
      { talla: { orden: "asc" } },
    ],
  });
}

export async function getPrecioByCombo(productoId: number, colegioId: number, tallaId: number) {
  const precio = await prisma.precioProducto.findUnique({
    where: { productoId_colegioId_tallaId: { productoId, colegioId, tallaId } },
    select: { precioVenta: true },
  });
  return precio?.precioVenta ?? null;
}

export async function createPrecio(formData: FormData) {
  const productoId = parseInt(formData.get("productoId") as string, 10);
  const colegioId = parseInt(formData.get("colegioId") as string, 10);
  const tallaId = parseInt(formData.get("tallaId") as string, 10);
  const precioVenta = parseFloat(formData.get("precioVenta") as string);

  if (isNaN(productoId) || isNaN(colegioId) || isNaN(tallaId)) {
    return { error: "Producto, colegio y talla son requeridos" };
  }

  if (isNaN(precioVenta) || precioVenta < 0) {
    return { error: "El precio debe ser un número válido" };
  }

  try {
    await prisma.precioProducto.create({
      data: { productoId, colegioId, tallaId, precioVenta },
    });
  } catch {
    return { error: "Ya existe un precio para esa combinación de producto, colegio y talla" };
  }

  revalidatePath("/precios");
  return { success: true };
}

export async function updatePrecio(id: number, formData: FormData) {
  const precioVenta = parseFloat(formData.get("precioVenta") as string);

  if (isNaN(precioVenta) || precioVenta < 0) {
    return { error: "El precio debe ser un número válido" };
  }

  const actual = await prisma.precioProducto.findUnique({ where: { id } });
  if (!actual) {
    return { error: "Precio no encontrado" };
  }

  try {
    if (actual.precioVenta !== precioVenta) {
      await prisma.$transaction([
        prisma.historialPrecio.create({
          data: {
            precioProductoId: id,
            precioVentaAnt: actual.precioVenta,
            precioVentaNew: precioVenta,
            fechaCambio: new Date(),
          },
        }),
        prisma.precioProducto.update({
          where: { id },
          data: { precioVenta },
        }),
      ]);
    }

    revalidatePath("/precios");
    return { success: true };
  } catch {
    return { error: "No se pudo actualizar el precio" };
  }
}

export async function deletePrecio(id: number) {
  try {
    await prisma.$transaction([
      prisma.historialPrecio.deleteMany({ where: { precioProductoId: id } }),
      prisma.precioProducto.delete({ where: { id } }),
    ]);
  } catch {
    return { error: "No se puede eliminar este precio" };
  }

  revalidatePath("/precios");
  return { success: true };
}
