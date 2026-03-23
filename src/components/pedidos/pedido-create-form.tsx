"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { PhoneInput } from "@/components/ui/phone-input";
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
import { todayISO } from "@/lib/utils";

interface PedidoCreateFormProps {
  clientes: { id: number; nombre: string; colegio: { nombre: string } }[];
  colegios: { id: number; nombre: string }[];
  onSuccess: () => void;
}

export default function PedidoCreateForm({
  clientes: clientesInicial,
  colegios,
  onSuccess,
}: PedidoCreateFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const clienteFormRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [clientes, setClientes] = useState(clientesInicial);
  const [clienteId, setClienteId] = useState<string>("");
  const [showNewCliente, setShowNewCliente] = useState(false);
  const [newClienteColegioId, setNewClienteColegioId] = useState("");

  const clienteItems = clientes.map((c) => ({ value: String(c.id), label: `${c.nombre} (${c.colegio.nombre})` }));
  const colegioItems = colegios.map((c) => ({ value: String(c.id), label: c.nombre }));

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
    formData.set("colegioId", newClienteColegioId);
    const result = await createCliente(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    const nombre = formData.get("nombre") as string;
    const colegioNombre = colegios.find((c) => String(c.id) === newClienteColegioId)?.nombre ?? "";
    const newId = String(result.clienteId);
    setClientes((prev) => [...prev, { id: result.clienteId!, nombre: nombre.trim(), colegio: { nombre: colegioNombre } }]);
    setClienteId(newId);
    setShowNewCliente(false);
    setNewClienteColegioId("");
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
          <DateInput
            id="fechaPedido"
            name="fechaPedido"
            defaultValue={todayISO()}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="fechaEntregaEstimada">
            Fecha entrega estimada (opcional)
          </Label>
          <DateInput
            id="fechaEntregaEstimada"
            name="fechaEntregaEstimada"
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
        <SubmitButton>Crear pedido</SubmitButton>
      </form>

      <Dialog open={showNewCliente} onOpenChange={setShowNewCliente}>
        <DialogContent className="sm:max-w-md z-[60]">
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
          </DialogHeader>
          <form ref={clienteFormRef} action={handleCreateCliente} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nc-nombre">Nombre</Label>
              <Input id="nc-nombre" name="nombre" placeholder="Ej: María González" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Colegio</Label>
              <SearchSelect
                value={newClienteColegioId}
                onValueChange={setNewClienteColegioId}
                placeholder="Buscar colegio..."
                items={colegioItems}
                name="colegioId"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="nc-telefono">Teléfono</Label>
              <PhoneInput id="nc-telefono" name="telefono" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="nc-correo">Correo (opcional)</Label>
              <Input id="nc-correo" name="correo" type="email" placeholder="Ej: maria@correo.cl" />
            </div>
            <SubmitButton>Crear cliente</SubmitButton>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
