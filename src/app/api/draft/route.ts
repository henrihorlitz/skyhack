import { generateDraft } from "@/lib/draft";
import { getPatient } from "@/data/seed";

// POST /api/draft  { patientId, note }  ->  { update, source }
export async function POST(req: Request) {
  const { patientId, note } = (await req.json()) as { patientId?: string; note?: string };
  const patient = patientId ? getPatient(patientId) : undefined;
  if (!patient || !note) return Response.json({ error: "patientId and note required" }, { status: 400 });
  try {
    return Response.json(await generateDraft(note, patient));
  } catch (err) {
    console.error("[draft] failed:", err);
    return Response.json({ error: "draft failed" }, { status: 503 });
  }
}
