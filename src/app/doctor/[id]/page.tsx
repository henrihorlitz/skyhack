import { notFound } from "next/navigation";
import { DemoFooter, TopBar } from "@/components/doctor/top-bar";
import { ReviewScreen } from "@/components/doctor/review-screen";
import { getPatient } from "@/data/seed";
import { TODAY_NOTES } from "@/data/notes";

export default async function ReviewPage({ params }: PageProps<"/doctor/[id]">) {
  const { id } = await params;
  const patient = getPatient(id);
  if (!patient) notFound();
  return (
    <>
      <TopBar />
      <ReviewScreen patient={patient} initialNote={TODAY_NOTES[id]} />
      <DemoFooter />
    </>
  );
}
