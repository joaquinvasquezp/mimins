import { notFound } from "next/navigation";
import { getCliente } from "../actions";
import ClienteDetailClient from "./client";

export const dynamic = "force-dynamic";

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clienteId = parseInt(id, 10);

  if (isNaN(clienteId)) notFound();

  const cliente = await getCliente(clienteId);

  if (!cliente) notFound();

  return <ClienteDetailClient cliente={cliente} />;
}
