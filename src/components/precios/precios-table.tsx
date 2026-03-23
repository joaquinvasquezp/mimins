"use client";

import { useState, useEffect } from "react";
import { formatMonto, formatFecha } from "@/lib/utils";
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
import { History, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deletePrecio, getHistorialPrecio } from "@/app/precios/actions";
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

interface HistorialEntry {
  id: number;
  precioVentaAnt: number;
  precioVentaNew: number;
  fechaCambio: Date;
}

export default function PreciosTable({ precios }: { precios: Precio[] }) {
  const [editingPrecio, setEditingPrecio] = useState<Precio | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Precio | null>(null);
  const [historialTarget, setHistorialTarget] = useState<Precio | null>(null);
  const [historial, setHistorial] = useState<HistorialEntry[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const { search, setSearch, page, setPage, totalPages, paged, totalFiltered, totalItems, sort, toggleSort } =
    useTableSearch(precios, (p, q) =>
      p.producto.nombre.toLowerCase().includes(q) ||
      p.colegio.nombre.toLowerCase().includes(q) ||
      p.talla.nombre.toLowerCase().includes(q)
    );

  useEffect(() => {
    if (!historialTarget) {
      setHistorial([]);
      return;
    }
    setLoadingHistorial(true);
    getHistorialPrecio(historialTarget.id).then((data) => {
      setHistorial(data);
      setLoadingHistorial(false);
    });
  }, [historialTarget]);

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
            <TableHead className="w-28">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((precio) => (
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
                    aria-label="Ver historial"
                    onClick={() => setHistorialTarget(precio)}
                  >
                    <History />
                  </Button>
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
          ))}
        </TableBody>
      </Table></div>
      {paged.length === 0 && <TableEmpty search={search} />}
      <TablePagination page={page} totalPages={totalPages} totalFiltered={totalFiltered} totalItems={totalItems} onPageChange={setPage} />

      <Dialog
        open={historialTarget !== null}
        onOpenChange={(open) => !open && setHistorialTarget(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Historial de precios</DialogTitle>
          </DialogHeader>
          {historialTarget && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                {historialTarget.producto.nombre} — {historialTarget.colegio.nombre} — {historialTarget.talla.nombre}
              </p>
              <div className="rounded-lg border p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Precio actual</span>
                <span className="font-bold text-lg">{formatMonto(historialTarget.precioVenta)}</span>
              </div>
              {loadingHistorial ? (
                <p className="text-sm text-muted-foreground text-center py-4">Cargando...</p>
              ) : historial.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Sin cambios de precio registrados.
                </p>
              ) : (
                <div className="overflow-x-auto"><Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Anterior</TableHead>
                      <TableHead>Nuevo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historial.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell>{formatFecha(h.fechaCambio)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatMonto(h.precioVentaAnt)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatMonto(h.precioVentaNew)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
