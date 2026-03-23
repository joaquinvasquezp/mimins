import { notFound } from "next/navigation";
import { getColegio } from "../actions";
import ColegioDetailClient from "./client";

export const dynamic = "force-dynamic";

export default async function ColegioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const colegioId = parseInt(id, 10);

  if (isNaN(colegioId)) notFound();

  const colegio = await getColegio(colegioId);

  if (!colegio) notFound();

  return <ColegioDetailClient colegio={colegio} />;
}
