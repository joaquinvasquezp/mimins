"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Trash2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatMonto, formatFecha } from "@/lib/utils";
import { ESTADOS_PEDIDO, ESTADO_COLORS } from "@/lib/constants";
import EstadoBadge from "@/components/pedidos/estado-badge";
import { useTableSearch } from "@/lib/use-table-search";
import { TableSearch, TablePagination, TableEmpty, SortableHead } from "@/components/ui/table-controls";
import { toast } from "sonner";
import { deletePedido } from "./actions";
import PedidoCreateForm from "@/components/pedidos/pedido-create-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Pedido {
  id: number;
  estado: string;
  fechaPedido: Date;
  total: number;
  notas: string | null;
  cliente: { nombre: string; colegio: { id: number; nombre: string } };
  pagos: { monto: number }[];
  _count: { items: number };
}

interface Cliente {
  id: number;
  nombre: string;
  colegio: { nombre: string };
}

interface Colegio {
  id: number;
  nombre: string;
}

export default function PedidosClient({
  pedidos,
  clientes,
  colegios,
  openCreate = false,
}: {
  pedidos: Pedido[];
  clientes: Cliente[];
  colegios: Colegio[];
  openCreate?: boolean;
}) {
  const [showCreate, setShowCreate] = useState(openCreate);
  const [estadoFilter, setEstadoFilter] = useState<string | null>(null);
  const [colegioFilter, setColegioFilter] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const pedidosFiltrados = pedidos.filter((p) => {
    if (estadoFilter && p.estado !== estadoFilter) return false;
    if (colegioFilter && p.cliente.colegio.id !== colegioFilter) return false;
    return true;
  });

  const { search, setSearch, page, setPage, totalPages, paged, totalFiltered, totalItems, sort, toggleSort } =
    useTableSearch(pedidosFiltrados, (p, q) =>
      p.cliente.nombre.toLowerCase().includes(q) ||
      p.cliente.colegio.nombre.toLowerCase().includes(q) ||
      String(p.id).includes(q) ||
      (ESTADOS_PEDIDO[p.estado] ?? p.estado).toLowerCase().includes(q)
    );

  async function handleConfirmDelete() {
    if (deleteId === null) return;
    const result = await deletePedido(deleteId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Pedido eliminado");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus /> Nuevo pedido
        </Button>
      </div>

      {pedidos.length === 0 ? (
        <p className="text-muted-foreground text-base">
          No hay pedidos registrados. Crea el primero.
        </p>
      ) : (
        <>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground shrink-0 w-14">Estado</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setEstadoFilter(null)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  estadoFilter === null
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Todos
              </button>
              {Object.entries(ESTADOS_PEDIDO).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setEstadoFilter(estadoFilter === key ? null : key)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm transition-colors",
                    estadoFilter === key
                      ? ESTADO_COLORS[key]
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
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
        </div>
        <TableSearch value={search} onChange={setSearch} placeholder="Buscar por cliente, #..." />
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow>
              <SortableHead label="#" sortKey="id" sort={sort} onToggle={toggleSort} />
              <SortableHead label="Cliente" sortKey="cliente.nombre" sort={sort} onToggle={toggleSort} />
              <SortableHead label="Colegio" sortKey="cliente.colegio.nombre" sort={sort} onToggle={toggleSort} />
              <SortableHead label="Fecha" sortKey="fechaPedido" sort={sort} onToggle={toggleSort} />
              <SortableHead label="Estado" sortKey="estado" sort={sort} onToggle={toggleSort} />
              <SortableHead label="Items" sortKey="_count.items" sort={sort} onToggle={toggleSort} />
              <SortableHead label="Total" sortKey="total" sort={sort} onToggle={toggleSort} />
              <TableHead>Pendiente</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell className="font-medium">{pedido.id}</TableCell>
                <TableCell>{pedido.cliente.nombre}</TableCell>
                <TableCell>{pedido.cliente.colegio.nombre}</TableCell>
                <TableCell>
                  {formatFecha(pedido.fechaPedido)}
                </TableCell>
                <TableCell>
                  <EstadoBadge pedidoId={pedido.id} estado={pedido.estado} />
                </TableCell>
                <TableCell>{pedido._count.items}</TableCell>
                <TableCell>
                  {formatMonto(pedido.total)}
                </TableCell>
                <TableCell>
                  {(() => {
                    if (pedido.estado === "COTIZADO" || pedido.estado === "CANCELADO")
                      return <span className="text-muted-foreground">—</span>;
                    const pagado = pedido.pagos.reduce((s, p) => s + p.monto, 0);
                    const pendiente = pedido.total - pagado;
                    if (pendiente <= 0)
                      return <span className="text-green-600">Pagado</span>;
                    return <span className="text-red-600">{formatMonto(pendiente)}</span>;
                  })()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Link
                      href={`/pedidos/${pedido.id}`}
                      className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                      aria-label="Ver detalle"
                    >
                      <Eye />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Eliminar"
                      onClick={() => setDeleteId(pedido.id)}
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
        </>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo pedido</DialogTitle>
          </DialogHeader>
          <PedidoCreateForm
            clientes={clientes}
            colegios={colegios}
            onSuccess={() => setShowCreate(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar pedido"
        description={`¿Estás seguro de eliminar el pedido #${deleteId} y todos sus items/pagos? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
