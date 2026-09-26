import { getApprovals, getQuestions } from "@/lib/store";

// GET /api/state?patientId=maria  ->  { approvals, questions }
// Polled by the doctor and family screens every 2s. Omit patientId for the whole ward.
export async function GET(req: Request) {
  const patientId = new URL(req.url).searchParams.get("patientId") ?? undefined;
  try {
    const [approvals, questions] = await Promise.all([getApprovals(patientId), getQuestions(patientId)]);
    return Response.json({ approvals, questions });
  } catch (err) {
    console.error("[state] failed:", err);
    return Response.json({ error: "state unavailable" }, { status: 503 });
  }
}
