"use client";

import { useState } from "react";
import { formatMonto } from "@/lib/utils";
import { METODOS_PAGO } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deletePago } from "@/app/pedidos/actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Pago {
  id: number;
  monto: number;
  metodo: string;
  fechaPago: Date;
  notas: string | null;
}

export default function PagosTable({ pagos }: { pagos: Pago[] }) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function handleConfirmDelete() {
    if (deleteId === null) return;
    const result = await deletePago(deleteId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Pago eliminado");
  }

  if (pagos.length === 0) {
    return (
      <p className="text-muted-foreground text-base">
        No hay pagos registrados para este pedido.
      </p>
    );
  }

  const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);

  return (
    <div className="flex flex-col gap-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagos.map((pago) => (
            <TableRow key={pago.id}>
              <TableCell>
                {new Date(pago.fechaPago).toLocaleDateString("es-CL")}
              </TableCell>
              <TableCell>
                {METODOS_PAGO[pago.metodo] ?? pago.metodo}
              </TableCell>
              <TableCell className="font-medium">
                {formatMonto(pago.monto)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {pago.notas || "—"}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleteId(pago.id)}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-base font-medium">
        Total pagado: {formatMonto(totalPagado)}
      </p>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar pago"
        description="¿Estás seguro de eliminar este pago? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
