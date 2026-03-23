import { getClientes } from "./actions";
import ClientesClient from "./client";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await getClientes();

  return <ClientesClient clientes={clientes} />;
}
