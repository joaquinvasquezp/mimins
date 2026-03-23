import Link from "next/link";
import { getPedidos } from "@/app/pedidos/actions";
import { cn, formatMonto } from "@/lib/utils";
import { ESTADOS_PEDIDO, ESTADO_COLORS } from "@/lib/constants";
import { ClipboardList, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const pedidos = await getPedidos();

  const activos = pedidos.filter(
    (p) => !["ENTREGADO", "CANCELADO"].includes(p.estado)
  );

  const porEstado = activos.reduce<Record<string, number>>((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {});

  const totalPendiente = activos.reduce((sum, p) => {
    const pagado = p.pagos.reduce((s, pago) => s + pago.monto, 0);
    const pendiente = p.total - pagado;
    return sum + (pendiente > 0 ? pendiente : 0);
  }, 0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Bienvenida a Mimins</h1>
        <p className="text-muted-foreground text-base mt-1">
          Resumen de tu tienda de uniformes
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/40 p-5 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Pedidos activos</span>
          <span className="text-3xl font-bold">{activos.length}</span>
        </div>
        <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/40 p-5 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Por cobrar</span>
          <span className="text-3xl font-bold">{formatMonto(totalPendiente)}</span>
        </div>
        <div className="rounded-lg border bg-zinc-100/60 dark:bg-zinc-800/40 p-5 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">Total pedidos</span>
          <span className="text-3xl font-bold">{pedidos.length}</span>
        </div>
      </div>

      {/* Badges por estado + lista de activos */}
      {activos.length === 0 && pedidos.length === 0 && (
        <section className="rounded-lg border p-8 flex flex-col items-center gap-3 text-center">
          <ClipboardList className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground text-base">
            Aún no hay pedidos registrados.
          </p>
          <Link
            href="/pedidos?nuevo=1"
            className="text-sm font-medium text-primary hover:underline"
          >
            Crear el primer pedido
          </Link>
        </section>
      )}
      {activos.length > 0 && (
        <section className="rounded-lg border p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pedidos activos</h2>
            {Object.keys(porEstado).length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {Object.entries(porEstado).map(([estado, count]) => (
                  <Badge
                    key={estado}
                    variant="outline"
                    className={cn(ESTADO_COLORS[estado])}
                  >
                    {ESTADOS_PEDIDO[estado] ?? estado}: {count}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {activos.slice(0, 8).map((pedido) => {
              const pagado = pedido.pagos.reduce((s, p) => s + p.monto, 0);
              const pendiente = pedido.total - pagado;
              return (
                <Link
                  key={pedido.id}
                  href={`/pedidos/${pedido.id}`}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/40 transition-colors group"
                >
                  <ClipboardList className="size-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-medium">
                      #{pedido.id} — {pedido.cliente.nombre}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(pedido.fechaPedido).toLocaleDateString("es-MX", { day: "numeric", month: "short" })} · {ESTADOS_PEDIDO[pedido.estado] ?? pedido.estado} · {pedido._count.items} items · {formatMonto(pedido.total)}
                    </div>
                  </div>
                  {pendiente > 0 && (
                    <span className="text-sm text-red-600 shrink-0">
                      Debe {formatMonto(pendiente)}
                    </span>
                  )}
                  <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </Link>
              );
            })}
          </div>
          {activos.length > 8 && (
            <Link
              href="/pedidos"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Ver todos los pedidos →
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
