"use client";

import { useRef } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createTalla, updateTalla } from "@/app/tallas/actions";

interface TallaFormProps {
  talla?: { id: number; nombre: string; orden: number };
  onSuccess: () => void;
}

export default function TallaForm({ talla, onSuccess }: TallaFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const result = talla
      ? await updateTalla(talla.id, formData)
      : await createTalla(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(talla ? "Talla actualizada" : "Talla creada");
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
          placeholder="Ej: S, M, L, 4, 6, 8"
          defaultValue={talla?.nombre ?? ""}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="orden">Orden</Label>
        <Input
          id="orden"
          name="orden"
          type="number"
          placeholder="Ej: 1, 2, 3..."
          defaultValue={talla?.orden ?? ""}
          required
        />
      </div>
      <SubmitButton>{talla ? "Guardar cambios" : "Crear talla"}</SubmitButton>
    </form>
  );
}
