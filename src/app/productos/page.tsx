import { getProductos } from "./actions";
import ProductosClient from "./client";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const productos = await getProductos();

  return <ProductosClient productos={productos} />;
}
