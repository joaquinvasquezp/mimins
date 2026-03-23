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
import { deleteTalla } from "@/app/tallas/actions";
import TallaForm from "./talla-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTableSearch } from "@/lib/use-table-search";
import { TableSearch, TablePagination, SortableHead } from "@/components/ui/table-controls";

interface Talla {
  id: number;
  nombre: string;
  orden: number;
}

export default function TallasTable({ tallas }: { tallas: Talla[] }) {
  const [editingTalla, setEditingTalla] = useState<Talla | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Talla | null>(null);
  const { search, setSearch, page, setPage, totalPages, paged, totalFiltered, totalItems, sort, toggleSort } =
    useTableSearch(tallas, (t, q) => t.nombre.toLowerCase().includes(q));

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const result = await deleteTalla(deleteTarget.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Talla eliminada");
  }

  if (tallas.length === 0) {
    return (
      <p className="text-muted-foreground text-base">
        No hay tallas registradas. Crea la primera.
      </p>
    );
  }

  return (
    <>
      <TableSearch value={search} onChange={setSearch} placeholder="Buscar talla..." />
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead label="Orden" sortKey="orden" sort={sort} onToggle={toggleSort} />
            <SortableHead label="Nombre" sortKey="nombre" sort={sort} onToggle={toggleSort} />
            <TableHead className="w-24">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((talla) => (
            <TableRow key={talla.id}>
              <TableCell>{talla.orden}</TableCell>
              <TableCell className="font-medium">{talla.nombre}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setEditingTalla(talla)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteTarget(talla)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination page={page} totalPages={totalPages} totalFiltered={totalFiltered} totalItems={totalItems} onPageChange={setPage} />

      <Dialog
        open={editingTalla !== null}
        onOpenChange={(open) => !open && setEditingTalla(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar talla</DialogTitle>
          </DialogHeader>
          {editingTalla && (
            <TallaForm
              talla={editingTalla}
              onSuccess={() => setEditingTalla(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar talla"
        description={`¿Estás seguro de eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
