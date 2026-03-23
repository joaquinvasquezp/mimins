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
import { deleteColegio } from "@/app/colegios/actions";
import ColegioForm from "./colegio-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTableSearch } from "@/lib/use-table-search";
import { TableSearch, TablePagination, TableEmpty, SortableHead } from "@/components/ui/table-controls";

interface Colegio {
  id: number;
  nombre: string;
  notas: string | null;
}

export default function ColegiosTable({ colegios }: { colegios: Colegio[] }) {
  const [editingColegio, setEditingColegio] = useState<Colegio | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Colegio | null>(null);
  const { search, setSearch, page, setPage, totalPages, paged, totalFiltered, totalItems, sort, toggleSort } =
    useTableSearch(colegios, (c, q) => c.nombre.toLowerCase().includes(q));

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const result = await deleteColegio(deleteTarget.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Colegio eliminado");
  }

  if (colegios.length === 0) {
    return (
      <p className="text-muted-foreground text-base">
        No hay colegios registrados. Crea el primero.
      </p>
    );
  }

  return (
    <>
      <TableSearch value={search} onChange={setSearch} placeholder="Buscar colegio..." />
      <div className="overflow-x-auto"><Table>
        <TableHeader>
          <TableRow>
            <SortableHead label="Nombre" sortKey="nombre" sort={sort} onToggle={toggleSort} />
            <TableHead>Notas</TableHead>
            <TableHead className="w-24">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((colegio) => (
            <TableRow key={colegio.id}>
              <TableCell className="font-medium">{colegio.nombre}</TableCell>
              <TableCell className="text-muted-foreground">
                {colegio.notas || "—"}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Editar"
                    onClick={() => setEditingColegio(colegio)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Eliminar"
                    onClick={() => setDeleteTarget(colegio)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table></div>
      {paged.length === 0 && <TableEmpty search={search} />}
      <TablePagination page={page} totalPages={totalPages} totalFiltered={totalFiltered} totalItems={totalItems} onPageChange={setPage} />

      <Dialog
        open={editingColegio !== null}
        onOpenChange={(open) => !open && setEditingColegio(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar colegio</DialogTitle>
          </DialogHeader>
          {editingColegio && (
            <ColegioForm
              colegio={editingColegio}
              onSuccess={() => setEditingColegio(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar colegio"
        description={`¿Estás seguro de eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
