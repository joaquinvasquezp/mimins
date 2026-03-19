import { getColegios } from "./actions";
import ColegiosClient from "./client";

export const dynamic = "force-dynamic";

export default async function ColegiosPage() {
  const colegios = await getColegios();

  return <ColegiosClient colegios={colegios} />;
}
