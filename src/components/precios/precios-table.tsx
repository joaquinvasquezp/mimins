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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deletePrecio } from "@/app/precios/actions";
import PrecioEditForm from "./precio-edit-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTableSearch } from "@/lib/use-table-search";
import { TableSearch, TablePagination, TableEmpty, SortableHead } from "@/components/ui/table-controls";

interface Precio {
  id: number;
  precioVenta: number;
  producto: { nombre: string };
  colegio: { nombre: string };
  talla: { nombre: string };
}

export default function PreciosTable({ precios }: { precios: Precio[] }) {
  const [editingPrecio, setEditingPrecio] = useState<Precio | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Precio | null>(null);
  const { search, setSearch, page, setPage, totalPages, paged, totalFiltered, totalItems, sort, toggleSort } =
    useTableSearch(precios, (p, q) =>
      p.producto.nombre.toLowerCase().includes(q) ||
      p.colegio.nombre.toLowerCase().includes(q) ||
      p.talla.nombre.toLowerCase().includes(q)
    );

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const result = await deletePrecio(deleteTarget.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Precio eliminado");
  }

  if (precios.length === 0) {
    return (
      <p className="text-muted-foreground text-base">
        No hay precios registrados. Crea el primero.
      </p>
    );
  }

  return (
    <>
      <TableSearch value={search} onChange={setSearch} placeholder="Buscar por producto, colegio, talla..." />
      <div className="overflow-x-auto"><Table>
        <TableHeader>
          <TableRow>
            <SortableHead label="Producto" sortKey="producto.nombre" sort={sort} onToggle={toggleSort} />
            <SortableHead label="Colegio" sortKey="colegio.nombre" sort={sort} onToggle={toggleSort} />
            <SortableHead label="Talla" sortKey="talla.nombre" sort={sort} onToggle={toggleSort} />
            <SortableHead label="Precio" sortKey="precioVenta" sort={sort} onToggle={toggleSort} />
            <TableHead className="w-24">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((precio) => {
            const desc = `${precio.producto.nombre} - ${precio.colegio.nombre} - ${precio.talla.nombre}`;
            return (
              <TableRow key={precio.id}>
                <TableCell className="font-medium">
                  {precio.producto.nombre}
                </TableCell>
                <TableCell>{precio.colegio.nombre}</TableCell>
                <TableCell>{precio.talla.nombre}</TableCell>
                <TableCell>
                  {formatMonto(precio.precioVenta)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Editar"
                      onClick={() => setEditingPrecio(precio)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Eliminar"
                      onClick={() => setDeleteTarget(precio)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table></div>
      {paged.length === 0 && <TableEmpty search={search} />}
      <TablePagination page={page} totalPages={totalPages} totalFiltered={totalFiltered} totalItems={totalItems} onPageChange={setPage} />

      <Dialog
        open={editingPrecio !== null}
        onOpenChange={(open) => !open && setEditingPrecio(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar precio</DialogTitle>
          </DialogHeader>
          {editingPrecio && (
            <PrecioEditForm
              precio={editingPrecio}
              onSuccess={() => setEditingPrecio(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar precio"
        description={`¿Estás seguro de eliminar el precio de "${deleteTarget ? `${deleteTarget.producto.nombre} - ${deleteTarget.colegio.nombre} - ${deleteTarget.talla.nombre}` : ""}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
