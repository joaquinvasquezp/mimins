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
import ColegiosTable from "@/components/colegios/colegios-table";
import ColegioForm from "@/components/colegios/colegio-form";

interface Colegio {
  id: number;
  nombre: string;
  notas: string | null;
}

export default function ColegiosClient({ colegios }: { colegios: Colegio[] }) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Colegios</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus /> Nuevo colegio
        </Button>
      </div>

      <ColegiosTable colegios={colegios} />

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo colegio</DialogTitle>
          </DialogHeader>
          <ColegioForm onSuccess={() => setShowCreate(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
