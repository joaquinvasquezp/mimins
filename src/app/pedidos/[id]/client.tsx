"use client";

import { useState } from "react";
import Link from "next/link";
import { formatMonto } from "@/lib/utils";
import { ESTADOS_PEDIDO, ESTADO_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  colegio: { nombre: string };
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
  cliente: { nombre: string; telefono: string };
  items: Item[];
  pagos: Pago[];
}

interface Producto {
  id: number;
  nombre: string;
}

interface Colegio {
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
  colegios,
  tallas,
}: {
  pedido: Pedido;
  productos: Producto[];
  colegios: Colegio[];
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
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">Pedido #{pedido.id}</h1>
        <Badge
          variant="outline"
          className={ESTADO_COLORS[pedido.estado] ?? ""}
        >
          {ESTADOS_PEDIDO[pedido.estado] ?? pedido.estado}
        </Badge>
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
            <span className="text-muted-foreground text-sm">Teléfono</span>
            <span>{pedido.cliente.telefono}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Fecha pedido</span>
            <span>{new Date(pedido.fechaPedido).toLocaleDateString("es-CL")}</span>
          </div>
          {pedido.fechaEntregaEstimada && (
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Entrega estimada</span>
              <span>{new Date(pedido.fechaEntregaEstimada).toLocaleDateString("es-CL")}</span>
            </div>
          )}
          {pedido.fechaEntregaReal && (
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Entrega real</span>
              <span>{new Date(pedido.fechaEntregaReal).toLocaleDateString("es-CL")}</span>
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
        <DialogContent>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar item</DialogTitle>
          </DialogHeader>
          <ItemForm
            pedidoId={pedido.id}
            productos={productos}
            colegios={colegios}
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
