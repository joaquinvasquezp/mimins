"use client";

import { useState, useTransition } from "react";
import { Popover } from "@base-ui/react/popover";
import { Badge } from "@/components/ui/badge";
import { ESTADOS_PEDIDO, ESTADO_COLORS } from "@/lib/constants";
import { updatePedido } from "@/app/pedidos/actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronDown, Loader2 } from "lucide-react";

interface EstadoBadgeProps {
  pedidoId: number;
  estado: string;
}

export default function EstadoBadge({ pedidoId, estado }: EstadoBadgeProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSelect(nuevoEstado: string) {
    if (nuevoEstado === estado) {
      setOpen(false);
      return;
    }
    setOpen(false);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("estado", nuevoEstado);
      const result = await updatePedido(pedidoId, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Estado → ${ESTADOS_PEDIDO[nuevoEstado]}`);
      }
    });
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className="cursor-pointer focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <Badge
          variant="outline"
          className={cn(
            ESTADO_COLORS[estado] ?? "",
            "hover:opacity-80 transition-opacity cursor-pointer",
            pending && "opacity-60"
          )}
        >
          {pending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : null}
          {ESTADOS_PEDIDO[estado] ?? estado}
          <ChevronDown className="size-3 opacity-60" />
        </Badge>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" sideOffset={6} className="z-50">
          <Popover.Popup className="rounded-lg border bg-popover p-2 shadow-md animate-in fade-in-0 zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <div className="flex flex-col gap-1 min-w-[140px]">
              <span className="text-xs text-muted-foreground px-2 pb-1">Cambiar estado</span>
              {Object.entries(ESTADOS_PEDIDO).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors text-left",
                    key === estado
                      ? "bg-accent font-medium"
                      : "hover:bg-accent/50"
                  )}
                >
                  <span className={cn("inline-block size-2 rounded-full shrink-0", ESTADO_COLORS[key]?.split(" ")[0] ?? "bg-zinc-200")} />
                  {label}
                </button>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
