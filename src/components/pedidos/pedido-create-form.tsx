"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchSelect from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createPedido } from "@/app/pedidos/actions";
import { createCliente } from "@/app/clientes/actions";

interface PedidoCreateFormProps {
  clientes: { id: number; nombre: string }[];
  onSuccess: () => void;
}

export default function PedidoCreateForm({
  clientes: clientesInicial,
  onSuccess,
}: PedidoCreateFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const clienteFormRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [clientes, setClientes] = useState(clientesInicial);
  const [clienteId, setClienteId] = useState<string>("");
  const [showNewCliente, setShowNewCliente] = useState(false);

  const clienteItems = clientes.map((c) => ({ value: String(c.id), label: c.nombre }));

  async function handleSubmit(formData: FormData) {
    formData.set("clienteId", clienteId);
    const result = await createPedido(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Pedido creado — ahora agrega los items");
    formRef.current?.reset();
    onSuccess();
    if (result.pedidoId) {
      router.push(`/pedidos/${result.pedidoId}`);
    }
  }

  async function handleCreateCliente(formData: FormData) {
    const result = await createCliente(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    const nombre = formData.get("nombre") as string;
    const newId = String(result.clienteId);
    setClientes((prev) => [...prev, { id: result.clienteId!, nombre: nombre.trim() }]);
    setClienteId(newId);
    setShowNewCliente(false);
    clienteFormRef.current?.reset();
    toast.success("Cliente creado");
  }

  return (
    <>
      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Cliente</Label>
          <SearchSelect
            value={clienteId}
            onValueChange={setClienteId}
            placeholder="Buscar cliente..."
            items={clienteItems}
            name="clienteId"
            required
          />
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
            onClick={() => setShowNewCliente(true)}
          >
            + Crear nuevo cliente
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="fechaPedido">Fecha del pedido</Label>
          <Input
            id="fechaPedido"
            name="fechaPedido"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="fechaEntregaEstimada">
            Fecha entrega estimada (opcional)
          </Label>
          <Input
            id="fechaEntregaEstimada"
            name="fechaEntregaEstimada"
            type="date"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notas">Notas (opcional)</Label>
          <Input
            id="notas"
            name="notas"
            placeholder="Observaciones del pedido"
          />
        </div>
        <Button type="submit">Crear pedido</Button>
      </form>

      <Dialog open={showNewCliente} onOpenChange={setShowNewCliente}>
        <DialogContent className="sm:max-w-xl z-[60]">
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
          </DialogHeader>
          <form ref={clienteFormRef} action={handleCreateCliente} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nc-nombre">Nombre</Label>
              <Input id="nc-nombre" name="nombre" placeholder="Ej: María González" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="nc-telefono">Teléfono</Label>
              <Input id="nc-telefono" name="telefono" placeholder="Ej: +56 9 1234 5678" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="nc-correo">Correo (opcional)</Label>
              <Input id="nc-correo" name="correo" type="email" placeholder="Ej: maria@correo.cl" />
            </div>
            <Button type="submit">Crear cliente</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
