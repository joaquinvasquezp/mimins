import { notFound } from "next/navigation";
import { getPedido } from "../actions";
import { getProductos } from "@/app/productos/actions";
import { getColegios } from "@/app/colegios/actions";
import { getTallas } from "@/app/tallas/actions";
import PedidoDetailClient from "./client";

export const dynamic = "force-dynamic";

export default async function PedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pedidoId = parseInt(id, 10);

  if (isNaN(pedidoId)) notFound();

  const [pedido, productos, colegios, tallas] = await Promise.all([
    getPedido(pedidoId),
    getProductos(),
    getColegios(),
    getTallas(),
  ]);

  if (!pedido) notFound();

  return (
    <PedidoDetailClient
      pedido={pedido}
      productos={productos}
      colegios={colegios}
      tallas={tallas}
    />
  );
}
