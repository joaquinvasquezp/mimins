"use client";

import { useState } from "react";
import { formatMonto } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteItem } from "@/app/pedidos/actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Item {
  id: number;
  cantidad: number;
  precioUnitario: number;
  detalle: string | null;
  producto: { nombre: string };
  colegio: { nombre: string };
  talla: { nombre: string };
}

export default function PedidoItemsTable({ items }: { items: Item[] }) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function handleConfirmDelete() {
    if (deleteId === null) return;
    const result = await deleteItem(deleteId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Item eliminado");
  }

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground text-base">
        Este pedido no tiene items. Agrega el primero.
      </p>
    );
  }

  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Colegio</TableHead>
          <TableHead>Talla</TableHead>
          <TableHead>Cant.</TableHead>
          <TableHead>P. Unit.</TableHead>
          <TableHead>Subtotal</TableHead>
          <TableHead>Detalle</TableHead>
          <TableHead className="w-16"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {item.producto.nombre}
            </TableCell>
            <TableCell>{item.colegio.nombre}</TableCell>
            <TableCell>{item.talla.nombre}</TableCell>
            <TableCell>{item.cantidad}</TableCell>
            <TableCell>
              {formatMonto(item.precioUnitario)}
            </TableCell>
            <TableCell className="font-medium">
              {formatMonto(item.precioUnitario * item.cantidad)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {item.detalle || "—"}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Eliminar item"
                onClick={() => setDeleteId(item.id)}
              >
                <Trash2 />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <ConfirmDialog
      open={deleteId !== null}
      onOpenChange={(open) => !open && setDeleteId(null)}
      title="Eliminar item"
      description="¿Estás seguro de eliminar este item del pedido? Esta acción no se puede deshacer."
      onConfirm={handleConfirmDelete}
    />
    </>
  );
}
