import { getPrecios } from "./actions";
import { getProductos } from "@/app/productos/actions";
import { getColegios } from "@/app/colegios/actions";
import { getTallas } from "@/app/tallas/actions";
import PreciosClient from "./client";

export const dynamic = "force-dynamic";

export default async function PreciosPage() {
  const [precios, productos, colegios, tallas] = await Promise.all([
    getPrecios(),
    getProductos(),
    getColegios(),
    getTallas(),
  ]);

  return (
    <PreciosClient
      precios={precios}
      productos={productos}
      colegios={colegios}
      tallas={tallas}
    />
  );
}
