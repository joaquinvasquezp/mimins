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
import ClientesTable from "@/components/clientes/clientes-table";
import ClienteForm from "@/components/clientes/cliente-form";

interface Cliente {
  id: number;
  colegioId: number;
  nombre: string;
  telefono: string;
  correo: string | null;
  notas: string | null;
  colegio: { nombre: string };
}

interface Colegio {
  id: number;
  nombre: string;
}

export default function ClientesClient({ clientes, colegios }: { clientes: Cliente[]; colegios: Colegio[] }) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus /> Nuevo cliente
        </Button>
      </div>

      <ClientesTable clientes={clientes} colegios={colegios} />

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
          </DialogHeader>
          <ClienteForm colegios={colegios} onSuccess={() => setShowCreate(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
