"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import MontoInput from "@/components/ui/monto-input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updatePrecio } from "@/app/precios/actions";

interface PrecioEditFormProps {
  precio: {
    id: number;
    precioVenta: number;
    producto: { nombre: string };
    colegio: { nombre: string };
    talla: { nombre: string };
  };
  onSuccess: () => void;
}

export default function PrecioEditForm({ precio, onSuccess }: PrecioEditFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const result = await updatePrecio(precio.id, formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Precio actualizado");
    onSuccess();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      <div className="text-muted-foreground text-base">
        {precio.producto.nombre} — {precio.colegio.nombre} — {precio.talla.nombre}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="precioVenta">Precio de venta</Label>
        <MontoInput
          id="precioVenta"
          name="precioVenta"
          defaultValue={precio.precioVenta}
          required
        />
      </div>
      <Button type="submit">Guardar cambios</Button>
    </form>
  );
}
