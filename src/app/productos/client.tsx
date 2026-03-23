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
import ProductosTable from "@/components/productos/productos-table";
import ProductoForm from "@/components/productos/producto-form";

interface Producto {
  id: number;
  nombre: string;
  categoria: string | null;
}

export default function ProductosClient({ productos }: { productos: Producto[] }) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus /> Nuevo producto
        </Button>
      </div>

      <ProductosTable productos={productos} />

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo producto</DialogTitle>
          </DialogHeader>
          <ProductoForm onSuccess={() => setShowCreate(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
