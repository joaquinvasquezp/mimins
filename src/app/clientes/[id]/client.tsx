"use client";

import Link from "next/link";
import { formatMonto, formatFecha, formatTelefono } from "@/lib/utils";
import { ESTADOS_PEDIDO, ESTADO_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Eye } from "lucide-react";

interface Pedido {
  id: number;
  estado: string;
  fechaPedido: Date;
  total: number;
  pagos: { monto: number }[];
  _count: { items: number };
}

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  correo: string | null;
  notas: string | null;
  createdAt: Date;
  pedidos: Pedido[];
}

export default function ClienteDetailClient({ cliente }: { cliente: Cliente }) {
  const totalPedidos = cliente.pedidos.length;
  const pedidosActivos = cliente.pedidos.filter(
    (p) => !["ENTREGADO", "CANCELADO"].includes(p.estado)
  );
  const totalGastado = cliente.pedidos.reduce((sum, p) => sum + p.total, 0);
  const totalPagado = cliente.pedidos.reduce(
    (sum, p) => sum + p.pagos.reduce((s, pago) => s + pago.monto, 0),
    0
  );
  const totalPendiente = cliente.pedidos.reduce((sum, p) => {
    const pagado = p.pagos.reduce((s, pago) => s + pago.monto, 0);
    const pendiente = p.total - pagado;
    return sum + (pendiente > 0 ? pendiente : 0);
  }, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/clientes"
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          aria-label="Volver a clientes"
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">{cliente.nombre}</h1>
      </div>

      {/* Info */}
      <section className="rounded-lg border p-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Información</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Teléfono</span>
            <a href={`tel:${cliente.telefono}`} className="hover:underline">
              {formatTelefono(cliente.telefono)}
            </a>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Correo</span>
            {cliente.correo ? (
              <a href={`mailto:${cliente.correo}`} className="hover:underline">
                {cliente.correo}
              </a>
            ) : (
              <span>—</span>
            )}
          </div>
          {cliente.notas && (
            <div className="flex flex-col col-span-2">
              <span className="text-muted-foreground text-sm">Notas</span>
              <span>{cliente.notas}</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Cliente desde</span>
            <span>{formatFecha(cliente.createdAt)}</span>
          </div>
        </div>
      </section>

      {/* Resumen */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-zinc-100/60 p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Total pedidos</span>
          <span className="text-2xl font-bold">{totalPedidos}</span>
        </div>
        <div className="rounded-lg border bg-blue-50 p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Activos</span>
          <span className="text-2xl font-bold">{pedidosActivos.length}</span>
        </div>
        <div className="rounded-lg border bg-emerald-50 p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Total gastado</span>
          <span className="text-2xl font-bold">{formatMonto(totalGastado)}</span>
        </div>
        <div className="rounded-lg border bg-amber-50 p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Pagado</span>
          <span className="text-2xl font-bold">{formatMonto(totalPagado)}</span>
          {totalPendiente > 0 && (
            <span className="text-sm text-red-600">
              Debe {formatMonto(totalPendiente)}
            </span>
          )}
        </div>
      </section>

      {/* Historial de pedidos */}
      <section className="rounded-lg border p-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Historial de pedidos</h2>
        {cliente.pedidos.length === 0 ? (
          <p className="text-muted-foreground text-base">
            Este cliente no tiene pedidos.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pagado</TableHead>
                <TableHead>Pendiente</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cliente.pedidos.map((pedido) => {
                const pagado = pedido.pagos.reduce((s, p) => s + p.monto, 0);
                const pendiente = pedido.total - pagado;
                return (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">{pedido.id}</TableCell>
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
                    <TableCell>{formatMonto(pedido.total)}</TableCell>
                    <TableCell>{formatMonto(pagado)}</TableCell>
                    <TableCell>
                      {pendiente > 0 ? (
                        <span className="text-red-600">{formatMonto(pendiente)}</span>
                      ) : (
                        <span className="text-green-600">Pagado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/pedidos/${pedido.id}`}
                        target="_blank"
                        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                        aria-label="Ver pedido"
                      >
                        <Eye />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
