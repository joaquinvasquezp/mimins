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
import TallasTable from "@/components/tallas/tallas-table";
import TallaForm from "@/components/tallas/talla-form";

interface Talla {
  id: number;
  nombre: string;
  orden: number;
}

export default function TallasClient({ tallas }: { tallas: Talla[] }) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tallas</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus /> Nueva talla
        </Button>
      </div>

      <TallasTable tallas={tallas} />

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva talla</DialogTitle>
          </DialogHeader>
          <TallaForm onSuccess={() => setShowCreate(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
