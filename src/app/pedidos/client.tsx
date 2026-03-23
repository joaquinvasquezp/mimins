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
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Trash2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatMonto, formatFecha } from "@/lib/utils";
import { ESTADOS_PEDIDO, ESTADO_COLORS } from "@/lib/constants";
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
  cliente: { nombre: string };
  pagos: { monto: number }[];
  _count: { items: number };
}

interface Cliente {
  id: number;
  nombre: string;
}

export default function PedidosClient({
  pedidos,
  clientes,
  openCreate = false,
}: {
  pedidos: Pedido[];
  clientes: Cliente[];
  openCreate?: boolean;
}) {
  const [showCreate, setShowCreate] = useState(openCreate);
  const [estadoFilter, setEstadoFilter] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const pedidosFiltrados = estadoFilter
    ? pedidos.filter((p) => p.estado === estadoFilter)
    : pedidos;

  const { search, setSearch, page, setPage, totalPages, paged, totalFiltered, totalItems, sort, toggleSort } =
    useTableSearch(pedidosFiltrados, (p, q) =>
      p.cliente.nombre.toLowerCase().includes(q) ||
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
                  ? "bg-foreground text-background border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <TableSearch value={search} onChange={setSearch} placeholder="Buscar por cliente, #..." />
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead label="#" sortKey="id" sort={sort} onToggle={toggleSort} />
              <SortableHead label="Cliente" sortKey="cliente.nombre" sort={sort} onToggle={toggleSort} />
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
                <TableCell>
                  {formatFecha(pedido.fechaPedido)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={ESTADO_COLORS[pedido.estado] ?? ""}
                  >
                    {ESTADOS_PEDIDO[pedido.estado] ?? pedido.estado}
                  </Badge>
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
        </Table>
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
