import { getTallas } from "./actions";
import TallasClient from "./client";

export const dynamic = "force-dynamic";

export default async function TallasPage() {
  const tallas = await getTallas();

  return <TallasClient tallas={tallas} />;
}
