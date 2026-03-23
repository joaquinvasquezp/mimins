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
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteCliente } from "@/app/clientes/actions";
import { cn, formatTelefono } from "@/lib/utils";
import ClienteForm from "./cliente-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTableSearch } from "@/lib/use-table-search";
import { TableSearch, TablePagination, TableEmpty, SortableHead } from "@/components/ui/table-controls";

interface Cliente {
  id: number;
  colegioId: number;
  nombre: string;
  telefono: string;
  correo: string | null;
  notas: string | null;
  colegio: { nombre: string };
}

interface Colegio {
  id: number;
  nombre: string;
}

export default function ClientesTable({ clientes, colegios }: { clientes: Cliente[]; colegios: Colegio[] }) {
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null);
  const [colegioFilter, setColegioFilter] = useState<number | null>(null);

  const clientesFiltrados = colegioFilter
    ? clientes.filter((c) => c.colegioId === colegioFilter)
    : clientes;

  const { search, setSearch, page, setPage, totalPages, paged, totalFiltered, totalItems, sort, toggleSort } =
    useTableSearch(clientesFiltrados, (c, q) =>
      c.nombre.toLowerCase().includes(q) ||
      c.colegio.nombre.toLowerCase().includes(q) ||
      c.telefono.includes(q) ||
      (c.correo ?? "").toLowerCase().includes(q)
    );

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const result = await deleteCliente(deleteTarget.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Cliente eliminado");
  }

  if (clientes.length === 0) {
    return (
      <p className="text-muted-foreground text-base">
        No hay clientes registrados. Crea el primero.
      </p>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground shrink-0 w-14">Colegio</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setColegioFilter(null)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              colegioFilter === null
                ? "bg-foreground text-background border-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Todos
          </button>
          {colegios.map((col) => (
            <button
              key={col.id}
              onClick={() => setColegioFilter(colegioFilter === col.id ? null : col.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                colegioFilter === col.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {col.nombre}
            </button>
          ))}
        </div>
      </div>
      <TableSearch value={search} onChange={setSearch} placeholder="Buscar por nombre, teléfono, correo..." />
      <div className="overflow-x-auto"><Table>
        <TableHeader>
          <TableRow>
            <SortableHead label="Nombre" sortKey="nombre" sort={sort} onToggle={toggleSort} />
            <SortableHead label="Colegio" sortKey="colegio.nombre" sort={sort} onToggle={toggleSort} />
            <TableHead>Teléfono</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead className="w-24">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="font-medium">{cliente.nombre}</TableCell>
              <TableCell>{cliente.colegio.nombre}</TableCell>
              <TableCell>{formatTelefono(cliente.telefono)}</TableCell>
              <TableCell className="text-muted-foreground">
                {cliente.correo || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {cliente.notas || "—"}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Link
                    href={`/clientes/${cliente.id}`}
                    className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                    aria-label="Ver detalle"
                  >
                    <Eye />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Editar"
                    onClick={() => setEditingCliente(cliente)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Eliminar"
                    onClick={() => setDeleteTarget(cliente)}
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
      <TablePagination
        page={page}
        totalPages={totalPages}
        totalFiltered={totalFiltered}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <Dialog
        open={editingCliente !== null}
        onOpenChange={(open) => !open && setEditingCliente(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
          </DialogHeader>
          {editingCliente && (
            <ClienteForm
              cliente={editingCliente}
              colegios={colegios}
              onSuccess={() => setEditingCliente(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar cliente"
        description={`¿Estás seguro de eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
