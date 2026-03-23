"use client";

import { useState } from "react";
import Link from "next/link";
import { formatMonto, formatFecha, formatTelefono } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import EstadoBadge from "@/components/pedidos/estado-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PedidoEditForm from "@/components/pedidos/pedido-edit-form";
import PedidoItemsTable from "@/components/pedidos/pedido-items-table";
import ItemForm from "@/components/pedidos/item-form";
import PagosTable from "@/components/pedidos/pagos-table";
import PagoForm from "@/components/pedidos/pago-form";

interface Item {
  id: number;
  cantidad: number;
  precioUnitario: number;
  detalle: string | null;
  producto: { nombre: string };
  talla: { nombre: string };
}

interface Pago {
  id: number;
  monto: number;
  metodo: string;
  fechaPago: Date;
  notas: string | null;
}

interface Pedido {
  id: number;
  estado: string;
  fechaPedido: Date;
  fechaEntregaEstimada: Date | null;
  fechaEntregaReal: Date | null;
  total: number;
  notas: string | null;
  cliente: { nombre: string; telefono: string; colegio: { nombre: string }; colegioId: number };
  items: Item[];
  pagos: Pago[];
}

interface Producto {
  id: number;
  nombre: string;
}

interface Talla {
  id: number;
  nombre: string;
  orden: number;
}

export default function PedidoDetailClient({
  pedido,
  productos,
  tallas,
}: {
  pedido: Pedido;
  productos: Producto[];
  tallas: Talla[];
}) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddPago, setShowAddPago] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/pedidos"
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          aria-label="Volver a pedidos"
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">Pedido #{pedido.id}</h1>
        <EstadoBadge pedidoId={pedido.id} estado={pedido.estado} />
      </div>

      {/* Información del pedido */}
      <section className="rounded-lg border p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Información</h2>
          <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
            Editar
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Cliente</span>
            <span>{pedido.cliente.nombre}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Colegio</span>
            <span>{pedido.cliente.colegio.nombre}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Teléfono</span>
            <a href={`tel:${pedido.cliente.telefono}`} className="hover:underline">
              {formatTelefono(pedido.cliente.telefono)}
            </a>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Fecha pedido</span>
            <span>{formatFecha(pedido.fechaPedido)}</span>
          </div>
          {pedido.fechaEntregaEstimada && (
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Entrega estimada</span>
              <span>{formatFecha(pedido.fechaEntregaEstimada)}</span>
            </div>
          )}
          {pedido.fechaEntregaReal && (
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Entrega real</span>
              <span>{formatFecha(pedido.fechaEntregaReal)}</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Total</span>
            <span className="font-bold text-lg">{formatMonto(pedido.total)}</span>
          </div>
          {pedido.notas && (
            <div className="flex flex-col col-span-2">
              <span className="text-muted-foreground text-sm">Notas</span>
              <span>{pedido.notas}</span>
            </div>
          )}
        </div>
      </section>

      {/* Items */}
      <section className="rounded-lg border p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Items</h2>
          <Button size="sm" onClick={() => setShowAddItem(true)}>
            <Plus /> Agregar item
          </Button>
        </div>
        <PedidoItemsTable items={pedido.items} />
      </section>

      {/* Pagos */}
      <section className="rounded-lg border p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pagos</h2>
          <Button size="sm" onClick={() => setShowAddPago(true)}>
            <Plus /> Registrar pago
          </Button>
        </div>
        <PagosTable pagos={pedido.pagos} />
        {pedido.pagos.length > 0 && <ResumenPago total={pedido.total} pagos={pedido.pagos} />}
      </section>

      <Dialog open={showAddPago} onOpenChange={setShowAddPago}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar pago</DialogTitle>
          </DialogHeader>
          <PagoForm
            pedidoId={pedido.id}
            onSuccess={() => setShowAddPago(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar item</DialogTitle>
          </DialogHeader>
          <ItemForm
            pedidoId={pedido.id}
            colegioId={pedido.cliente.colegioId}
            productos={productos}
            tallas={tallas}
            onSuccess={() => setShowAddItem(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar pedido</DialogTitle>
          </DialogHeader>
          <PedidoEditForm
            pedido={pedido}
            onSuccess={() => setShowEdit(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ResumenPago({ total, pagos }: { total: number; pagos: Pago[] }) {
  const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
  const diferencia = total - totalPagado;

  return (
    <div className="rounded-lg border p-4 flex flex-col gap-2 text-base">
      <h3 className="font-semibold text-lg">Resumen de pagos</h3>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Total del pedido</span>
        <span className="font-medium">{formatMonto(total)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Total pagado</span>
        <span className="font-medium">{formatMonto(totalPagado)}</span>
      </div>
      <div className="border-t pt-2 flex justify-between">
        {diferencia > 0 ? (
          <>
            <span className="text-muted-foreground">Pendiente por pagar</span>
            <span className="font-bold text-red-600">{formatMonto(diferencia)}</span>
          </>
        ) : diferencia < 0 ? (
          <>
            <span className="text-muted-foreground">Vuelto a entregar</span>
            <span className="font-bold text-amber-600">{formatMonto(Math.abs(diferencia))}</span>
          </>
        ) : (
          <>
            <span className="text-muted-foreground">Estado</span>
            <span className="font-bold text-green-600">Pagado completo</span>
          </>
        )}
      </div>
    </div>
  );
}
