"use client";

import { useRef, useState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ESTADOS_PEDIDO } from "@/lib/constants";
import { updatePedido } from "@/app/pedidos/actions";

function toDateInput(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const y = d.toLocaleString("en-CA", { timeZone: "America/Santiago", year: "numeric" });
  const m = d.toLocaleString("en-CA", { timeZone: "America/Santiago", month: "2-digit" });
  const day = d.toLocaleString("en-CA", { timeZone: "America/Santiago", day: "2-digit" });
  return `${y}-${m}-${day}`;
}

interface PedidoEditFormProps {
  pedido: {
    id: number;
    estado: string;
    fechaEntregaEstimada: Date | null;
    fechaEntregaReal: Date | null;
    notas: string | null;
  };
  onSuccess: () => void;
}

export default function PedidoEditForm({
  pedido,
  onSuccess,
}: PedidoEditFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [estado, setEstado] = useState(pedido.estado);

  async function handleSubmit(formData: FormData) {
    formData.set("estado", estado);
    const result = await updatePedido(pedido.id, formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Pedido actualizado");
    onSuccess();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Estado</Label>
        <Select value={estado} onValueChange={(val) => val && setEstado(val)}>
          <SelectTrigger>
            <SelectValue>
              {(value: string) => ESTADOS_PEDIDO[value] ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ESTADOS_PEDIDO).map(([key, label]) => (
              <SelectItem key={key} value={key} label={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fechaEntregaEstimada">
          Fecha entrega estimada
        </Label>
        <DateInput
          id="fechaEntregaEstimada"
          name="fechaEntregaEstimada"
          defaultValue={toDateInput(pedido.fechaEntregaEstimada)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fechaEntregaReal">Fecha entrega real</Label>
        <DateInput
          id="fechaEntregaReal"
          name="fechaEntregaReal"
          defaultValue={toDateInput(pedido.fechaEntregaReal)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="notas">Notas</Label>
        <Input
          id="notas"
          name="notas"
          placeholder="Observaciones"
          defaultValue={pedido.notas ?? ""}
        />
      </div>
      <SubmitButton>Guardar cambios</SubmitButton>
    </form>
  );
}
