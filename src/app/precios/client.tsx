"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import PreciosTable from "@/components/precios/precios-table";
import PrecioForm from "@/components/precios/precio-form";

interface Producto {
  id: number;
  nombre: string;
  categoria: string | null;
}

interface Colegio {
  id: number;
  nombre: string;
}

interface Talla {
  id: number;
  nombre: string;
  orden: number;
}

interface Precio {
  id: number;
  productoId: number;
  colegioId: number;
  tallaId: number;
  precioVenta: number;
  producto: { nombre: string };
  colegio: { nombre: string };
  talla: { nombre: string };
}

interface PreciosClientProps {
  precios: Precio[];
  productos: Producto[];
  colegios: Colegio[];
  tallas: Talla[];
}

export default function PreciosClient({
  precios,
  productos,
  colegios,
  tallas,
}: PreciosClientProps) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Precios</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus /> Nuevo precio
        </Button>
      </div>

      <PreciosTable precios={precios} />

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo precio</DialogTitle>
          </DialogHeader>
          <PrecioForm
            productos={productos}
            colegios={colegios}
            tallas={tallas}
            onSuccess={() => setShowCreate(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
