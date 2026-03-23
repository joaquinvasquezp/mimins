"use client";

import { useState } from "react";
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
import { deleteProducto } from "@/app/productos/actions";
import ProductoForm from "./producto-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTableSearch } from "@/lib/use-table-search";
import { TableSearch, TablePagination, TableEmpty, SortableHead } from "@/components/ui/table-controls";

interface Producto {
  id: number;
  nombre: string;
  categoria: string | null;
}

export default function ProductosTable({ productos }: { productos: Producto[] }) {
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null);
  const { search, setSearch, page, setPage, totalPages, paged, totalFiltered, totalItems, sort, toggleSort } =
    useTableSearch(productos, (p, q) =>
      p.nombre.toLowerCase().includes(q) ||
      (p.categoria ?? "").toLowerCase().includes(q)
    );

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const result = await deleteProducto(deleteTarget.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Producto eliminado");
  }

  if (productos.length === 0) {
    return (
      <p className="text-muted-foreground text-base">
        No hay productos registrados. Crea el primero.
      </p>
    );
  }

  return (
    <>
      <TableSearch value={search} onChange={setSearch} placeholder="Buscar por nombre, categoría..." />
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead label="Nombre" sortKey="nombre" sort={sort} onToggle={toggleSort} />
            <SortableHead label="Categoría" sortKey="categoria" sort={sort} onToggle={toggleSort} />
            <TableHead className="w-24">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell className="font-medium">{producto.nombre}</TableCell>
              <TableCell className="text-muted-foreground">
                {producto.categoria || "—"}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Editar"
                    onClick={() => setEditingProducto(producto)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Eliminar"
                    onClick={() => setDeleteTarget(producto)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {paged.length === 0 && <TableEmpty search={search} />}
      <TablePagination page={page} totalPages={totalPages} totalFiltered={totalFiltered} totalItems={totalItems} onPageChange={setPage} />

      <Dialog
        open={editingProducto !== null}
        onOpenChange={(open) => !open && setEditingProducto(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar producto</DialogTitle>
          </DialogHeader>
          {editingProducto && (
            <ProductoForm
              producto={editingProducto}
              onSuccess={() => setEditingProducto(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar producto"
        description={`¿Estás seguro de eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
