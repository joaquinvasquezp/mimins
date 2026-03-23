import { getClientes } from "./actions";
import { getColegios } from "@/app/colegios/actions";
import ClientesClient from "./client";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const [clientes, colegios] = await Promise.all([
    getClientes(),
    getColegios(),
  ]);

  return <ClientesClient clientes={clientes} colegios={colegios} />;
}
