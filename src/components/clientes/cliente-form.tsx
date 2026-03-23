"use client";

import { useRef, useState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import SearchSelect from "@/components/ui/combobox";
import { toast } from "sonner";
import { createCliente, updateCliente } from "@/app/clientes/actions";

interface ClienteFormProps {
  cliente?: {
    id: number;
    colegioId: number;
    nombre: string;
    telefono: string;
    correo: string | null;
    notas: string | null;
  };
  colegios: { id: number; nombre: string }[];
  onSuccess: () => void;
}

export default function ClienteForm({ cliente, colegios, onSuccess }: ClienteFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [colegioId, setColegioId] = useState(cliente ? String(cliente.colegioId) : "");
  const colegioItems = colegios.map((c) => ({ value: String(c.id), label: c.nombre }));

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
        <Label>Colegio</Label>
        <SearchSelect
          value={colegioId}
          onValueChange={setColegioId}
          placeholder="Buscar colegio..."
          items={colegioItems}
          name="colegioId"
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
