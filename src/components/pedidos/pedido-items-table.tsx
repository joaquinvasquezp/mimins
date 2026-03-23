"use client";

import { useRef, useState } from "react";
import { formatMonto } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MontoInput from "@/components/ui/monto-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteItem, updateItem } from "@/app/pedidos/actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Item {
  id: number;
  cantidad: number;
  precioUnitario: number;
  detalle: string | null;
  producto: { nombre: string };
  talla: { nombre: string };
}

export default function PedidoItemsTable({ items }: { items: Item[] }) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleConfirmDelete() {
    if (deleteId === null) return;
    const result = await deleteItem(deleteId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Item eliminado");
  }

  async function handleEditSubmit(formData: FormData) {
    if (!editingItem) return;
    const result = await updateItem(editingItem.id, formData);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Item actualizado");
    setEditingItem(null);
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
    <div className="overflow-x-auto"><Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Talla</TableHead>
          <TableHead>Cant.</TableHead>
          <TableHead>P. Unit.</TableHead>
          <TableHead>Subtotal</TableHead>
          <TableHead>Detalle</TableHead>
          <TableHead className="w-20"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {item.producto.nombre}
            </TableCell>
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
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Editar item"
                  onClick={() => setEditingItem(item)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Eliminar item"
                  onClick={() => setDeleteId(item.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table></div>

    <Dialog
      open={editingItem !== null}
      onOpenChange={(open) => !open && setEditingItem(null)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar item</DialogTitle>
        </DialogHeader>
        {editingItem && (
          <form ref={formRef} action={handleEditSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {editingItem.producto.nombre} — {editingItem.talla.nombre}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-cantidad">Cantidad</Label>
                <Input
                  id="edit-cantidad"
                  name="cantidad"
                  type="number"
                  min="1"
                  defaultValue={editingItem.cantidad}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-precio">Precio unitario</Label>
                <MontoInput
                  id="edit-precio"
                  name="precioUnitario"
                  defaultValue={editingItem.precioUnitario}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-detalle">Detalle (opcional)</Label>
              <Input
                id="edit-detalle"
                name="detalle"
                defaultValue={editingItem.detalle ?? ""}
                placeholder="Ej: bordado especial"
              />
            </div>
            <SubmitButton>Guardar cambios</SubmitButton>
          </form>
        )}
      </DialogContent>
    </Dialog>

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
