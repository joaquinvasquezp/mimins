"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteColegio } from "@/app/colegios/actions";
import ColegioForm from "./colegio-form";

interface Colegio {
  id: number;
  nombre: string;
  notas: string | null;
}

export default function ColegiosTable({ colegios }: { colegios: Colegio[] }) {
  const [editingColegio, setEditingColegio] = useState<Colegio | null>(null);

  async function handleDelete(id: number, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;

    const result = await deleteColegio(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Colegio eliminado");
  }

  if (colegios.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No hay colegios registrados. Crea el primero.
      </p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead className="w-24">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colegios.map((colegio) => (
            <TableRow key={colegio.id}>
              <TableCell className="font-medium">{colegio.nombre}</TableCell>
              <TableCell className="text-muted-foreground">
                {colegio.notas || "—"}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setEditingColegio(colegio)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(colegio.id, colegio.nombre)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={editingColegio !== null}
        onOpenChange={(open) => !open && setEditingColegio(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar colegio</DialogTitle>
          </DialogHeader>
          {editingColegio && (
            <ColegioForm
              colegio={editingColegio}
              onSuccess={() => setEditingColegio(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
