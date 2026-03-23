"use client";

import { useRef } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createColegio, updateColegio } from "@/app/colegios/actions";

interface ColegioFormProps {
  colegio?: { id: number; nombre: string; notas: string | null };
  onSuccess: () => void;
}

export default function ColegioForm({ colegio, onSuccess }: ColegioFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const result = colegio
      ? await updateColegio(colegio.id, formData)
      : await createColegio(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(colegio ? "Colegio actualizado" : "Colegio creado");
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
          placeholder="Ej: Colegio San José"
          defaultValue={colegio?.nombre ?? ""}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="notas">Notas (opcional)</Label>
        <Input
          id="notas"
          name="notas"
          placeholder="Observaciones del colegio"
          defaultValue={colegio?.notas ?? ""}
        />
      </div>
      <SubmitButton>{colegio ? "Guardar cambios" : "Crear colegio"}</SubmitButton>
    </form>
  );
}
