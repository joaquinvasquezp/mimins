import { getPedidos } from "./actions";
import { getClientes } from "@/app/clientes/actions";
import PedidosClient from "./client";

export const dynamic = "force-dynamic";

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ nuevo?: string }>;
}) {
  const [pedidos, clientes, params] = await Promise.all([
    getPedidos(),
    getClientes(),
    searchParams,
  ]);

  return (
    <PedidosClient
      pedidos={pedidos}
      clientes={clientes}
      openCreate={params.nuevo === "1"}
    />
  );
}
