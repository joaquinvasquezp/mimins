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
  nombre: string;
  telefono: string;
  correo: string | null;
  notas: string | null;
}

export default function ClientesClient({ clientes }: { clientes: Cliente[] }) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus /> Nuevo cliente
        </Button>
      </div>

      <ClientesTable clientes={clientes} />

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
          </DialogHeader>
          <ClienteForm onSuccess={() => setShowCreate(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
