import { notFound } from "next/navigation";
import { FamilyExperience } from "@/components/family/family-experience";
import { getPatient } from "@/data/seed";

export default async function FamilyPage({ params }: PageProps<"/family/[id]">) {
  const { id } = await params;
  const patient = getPatient(id);
  if (!patient) notFound();
  return <FamilyExperience patient={patient} />;
}
