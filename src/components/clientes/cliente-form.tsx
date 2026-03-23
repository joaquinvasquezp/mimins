"use client";

import { useRef } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCliente, updateCliente } from "@/app/clientes/actions";

interface ClienteFormProps {
  cliente?: {
    id: number;
    nombre: string;
    telefono: string;
    correo: string | null;
    notas: string | null;
  };
  onSuccess: () => void;
}

export default function ClienteForm({ cliente, onSuccess }: ClienteFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const result = cliente
      ? await updateCliente(cliente.id, formData)
      : await createCliente(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(cliente ? "Cliente actualizado" : "Cliente creado");
    formRef.current?.reset();
    onSuccess();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          placeholder="Ej: María González"
          defaultValue={cliente?.nombre ?? ""}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <PhoneInput
          id="telefono"
          name="telefono"
          defaultValue={cliente?.telefono ?? ""}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="correo">Correo (opcional)</Label>
        <Input
          id="correo"
          name="correo"
          type="email"
          placeholder="Ej: maria@correo.cl"
          defaultValue={cliente?.correo ?? ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="notas">Notas (opcional)</Label>
        <Input
          id="notas"
          name="notas"
          placeholder="Observaciones del cliente"
          defaultValue={cliente?.notas ?? ""}
        />
      </div>
      <SubmitButton>
        {cliente ? "Guardar cambios" : "Crear cliente"}
      </SubmitButton>
    </form>
  );
}
