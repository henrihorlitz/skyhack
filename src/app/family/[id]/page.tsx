import { notFound } from "next/navigation";
import { FamilyApp } from "@/components/family/family-app";
import { getPatient } from "@/data/seed";

export default async function FamilyPage({ params }: PageProps<"/family/[id]">) {
  const { id } = await params;
  const patient = getPatient(id);
  if (!patient) notFound();
  return <FamilyApp patient={patient} />;
}
