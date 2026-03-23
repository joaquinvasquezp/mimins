"use client";

import Link from "next/link";
import { formatMonto, formatFecha } from "@/lib/utils";
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
  pedidos: Pedido[];
}

interface Colegio {
  id: number;
  nombre: string;
  notas: string | null;
  clientes: Cliente[];
}

export default function ColegioDetailClient({ colegio }: { colegio: Colegio }) {
  const totalClientes = colegio.clientes.length;
  const allPedidos = colegio.clientes.flatMap((c) => c.pedidos);
  const totalPedidos = allPedidos.length;
  const pedidosActivos = allPedidos.filter(
    (p) => !["ENTREGADO", "CANCELADO"].includes(p.estado)
  );
  const totalGastado = allPedidos.reduce((sum, p) => sum + p.total, 0);
  const totalPagado = allPedidos.reduce(
    (sum, p) => sum + p.pagos.reduce((s, pago) => s + pago.monto, 0),
    0
  );
  const totalPendiente = allPedidos.reduce((sum, p) => {
    const pagado = p.pagos.reduce((s, pago) => s + pago.monto, 0);
    const pendiente = p.total - pagado;
    return sum + (pendiente > 0 ? pendiente : 0);
  }, 0);

  // Pedidos ordenados por fecha desc para la tabla
  const pedidosSorted = allPedidos
    .map((p) => {
      const cliente = colegio.clientes.find((c) => c.pedidos.includes(p))!;
      return { ...p, clienteNombre: cliente.nombre };
    })
    .sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/colegios"
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          aria-label="Volver a colegios"
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">{colegio.nombre}</h1>
      </div>

      {/* Info */}
      {colegio.notas && (
        <section className="rounded-lg border p-5 flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Información</h2>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Notas</span>
            <span>{colegio.notas}</span>
          </div>
        </section>
      )}

      {/* Resumen */}
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="rounded-lg border bg-zinc-100/60 dark:bg-zinc-800/40 p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Clientes</span>
          <span className="text-2xl font-bold">{totalClientes}</span>
        </div>
        <div className="rounded-lg border bg-zinc-100/60 dark:bg-zinc-800/40 p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Total pedidos</span>
          <span className="text-2xl font-bold">{totalPedidos}</span>
        </div>
        <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/40 p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Activos</span>
          <span className="text-2xl font-bold">{pedidosActivos.length}</span>
        </div>
        <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/40 p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Total gastado</span>
          <span className="text-2xl font-bold">{formatMonto(totalGastado)}</span>
        </div>
        <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/40 p-4 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Pagado</span>
          <span className="text-2xl font-bold">{formatMonto(totalPagado)}</span>
          {totalPendiente > 0 && (
            <span className="text-sm text-red-600">
              Debe {formatMonto(totalPendiente)}
            </span>
          )}
        </div>
      </section>

      {/* Clientes del colegio */}
      <section className="rounded-lg border p-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Clientes ({totalClientes})</h2>
        {totalClientes === 0 ? (
          <p className="text-muted-foreground text-base">
            Este colegio no tiene clientes.
          </p>
        ) : (
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Activos</TableHead>
                <TableHead>Total gastado</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colegio.clientes.map((cliente) => {
                const activos = cliente.pedidos.filter(
                  (p) => !["ENTREGADO", "CANCELADO"].includes(p.estado)
                );
                const gastado = cliente.pedidos.reduce((s, p) => s + p.total, 0);
                return (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell>{cliente.pedidos.length}</TableCell>
                    <TableCell>{activos.length}</TableCell>
                    <TableCell>{formatMonto(gastado)}</TableCell>
                    <TableCell>
                      <Link
                        href={`/clientes/${cliente.id}`}
                        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                        aria-label="Ver cliente"
                      >
                        <Eye />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table></div>
        )}
      </section>

      {/* Historial de pedidos */}
      <section className="rounded-lg border p-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Historial de pedidos ({totalPedidos})</h2>
        {totalPedidos === 0 ? (
          <p className="text-muted-foreground text-base">
            Este colegio no tiene pedidos.
          </p>
        ) : (
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Cliente</TableHead>
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
              {pedidosSorted.map((pedido) => {
                const pagado = pedido.pagos.reduce((s, p) => s + p.monto, 0);
                const pendiente = pedido.total - pagado;
                return (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">{pedido.id}</TableCell>
                    <TableCell>{pedido.clienteNombre}</TableCell>
                    <TableCell>{formatFecha(pedido.fechaPedido)}</TableCell>
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
          </Table></div>
        )}
      </section>
    </div>
  );
}
