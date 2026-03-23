"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MontoInput from "@/components/ui/monto-input";
import { Label } from "@/components/ui/label";
import SearchSelect from "@/components/ui/combobox";
import { toast } from "sonner";
import { createPrecio } from "@/app/precios/actions";

interface PrecioFormProps {
  productos: { id: number; nombre: string }[];
  colegios: { id: number; nombre: string }[];
  tallas: { id: number; nombre: string }[];
  onSuccess: () => void;
}

export default function PrecioForm({
  productos,
  colegios,
  tallas,
  onSuccess,
}: PrecioFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const productoItems = productos.map((p) => ({ value: String(p.id), label: p.nombre }));
  const colegioItems = colegios.map((c) => ({ value: String(c.id), label: c.nombre }));
  const tallaItems = tallas.map((t) => ({ value: String(t.id), label: t.nombre }));

  async function handleSubmit(formData: FormData) {
    const result = await createPrecio(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Precio creado");
    formRef.current?.reset();
    onSuccess();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Producto</Label>
        <SearchSelect
          placeholder="Buscar producto..."
          items={productoItems}
          name="productoId"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Colegio</Label>
        <SearchSelect
          placeholder="Buscar colegio..."
          items={colegioItems}
          name="colegioId"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Talla</Label>
        <SearchSelect
          placeholder="Buscar talla..."
          items={tallaItems}
          name="tallaId"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="precioVenta">Precio de venta</Label>
        <MontoInput
          id="precioVenta"
          name="precioVenta"
          placeholder="Ej: 15.000"
          required
        />
      </div>
      <Button type="submit">Crear precio</Button>
    </form>
  );
}
