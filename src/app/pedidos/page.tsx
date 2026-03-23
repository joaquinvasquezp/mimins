import { getPedidos } from "./actions";
import { getClientes } from "@/app/clientes/actions";
import { getColegios } from "@/app/colegios/actions";
import PedidosClient from "./client";

export const dynamic = "force-dynamic";

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ nuevo?: string }>;
}) {
  const [pedidos, clientes, colegios, params] = await Promise.all([
    getPedidos(),
    getClientes(),
    getColegios(),
    searchParams,
  ]);

  return (
    <PedidosClient
      pedidos={pedidos}
      clientes={clientes}
      colegios={colegios}
      openCreate={params.nuevo === "1"}
    />
  );
}
