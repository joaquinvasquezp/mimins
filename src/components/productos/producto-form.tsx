"use client";

import { useRef } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createProducto, updateProducto } from "@/app/productos/actions";

interface ProductoFormProps {
  producto?: { id: number; nombre: string; categoria: string | null };
  onSuccess: () => void;
}

export default function ProductoForm({ producto, onSuccess }: ProductoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const result = producto
      ? await updateProducto(producto.id, formData)
      : await createProducto(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(producto ? "Producto actualizado" : "Producto creado");
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
          placeholder="Ej: Buzo, Pantalón, Polera"
          defaultValue={producto?.nombre ?? ""}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="categoria">Categoría (opcional)</Label>
        <Input
          id="categoria"
          name="categoria"
          placeholder="Ej: Superior, Inferior, Accesorios"
          defaultValue={producto?.categoria ?? ""}
        />
      </div>
      <SubmitButton>{producto ? "Guardar cambios" : "Crear producto"}</SubmitButton>
    </form>
  );
}
