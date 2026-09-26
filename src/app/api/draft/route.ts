import { createHash } from "node:crypto";
import { generateDraft } from "@/lib/draft";
import { cacheDraft, getCachedDraft } from "@/lib/store";
import { getPatient } from "@/data/seed";

// AI calls can take 5-20s; give them room on Vercel.
export const maxDuration = 60;

// POST /api/draft  { patientId, note, fresh? }  ->  { update, source: "cache" | "live" | "fallback" }
// Serves a stored draft for the same note instantly; `fresh: true` (Regenerate) always asks the AI.
export async function POST(req: Request) {
  const { patientId, note, fresh = false } = (await req.json()) as { patientId?: string; note?: string; fresh?: boolean };
  const patient = patientId ? getPatient(patientId) : undefined;
  if (!patient || !note) return Response.json({ error: "patientId and note required" }, { status: 400 });
  const hash = createHash("sha256").update(`${patient.id}\n${note}`).digest("hex");
  try {
    if (!fresh) {
      const cached = await getCachedDraft(hash);
      if (cached) return Response.json({ update: cached, source: "cache" });
    }
    const result = await generateDraft(note, patient);
    // Only keep real AI drafts; a fallback should not stick once the AI is back.
    if (result.source === "live") await cacheDraft(hash, patient.id, result.update);
    return Response.json(result);
  } catch (err) {
    console.error("[draft] failed:", err);
    return Response.json({ error: "draft failed" }, { status: 503 });
  }
}
