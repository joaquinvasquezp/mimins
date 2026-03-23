"use client";

import { useRef } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import MontoInput from "@/components/ui/monto-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { METODOS_PAGO } from "@/lib/constants";
import { addPago } from "@/app/pedidos/actions";
import { todayISO } from "@/lib/utils";

interface PagoFormProps {
  pedidoId: number;
  onSuccess: () => void;
}

export default function PagoForm({ pedidoId, onSuccess }: PagoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    formData.set("pedidoId", String(pedidoId));
    const result = await addPago(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Pago registrado");
    formRef.current?.reset();
    onSuccess();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="monto">Monto</Label>
        <MontoInput
          id="monto"
          name="monto"
          placeholder="Ej: 15.000"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Método de pago</Label>
        <Select name="metodo" required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona método">
              {(value: string) => METODOS_PAGO[value] ?? "Selecciona método"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(METODOS_PAGO).map(([key, label]) => (
              <SelectItem key={key} value={key} label={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fechaPago">Fecha de pago</Label>
        <DateInput
          id="fechaPago"
          name="fechaPago"
          defaultValue={todayISO()}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="notas">Notas (opcional)</Label>
        <Input
          id="notas"
          name="notas"
          placeholder="Observaciones del pago"
        />
      </div>
      <SubmitButton>Registrar pago</SubmitButton>
    </form>
  );
}
