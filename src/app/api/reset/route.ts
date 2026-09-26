import { resetDemo } from "@/lib/store";

// POST /api/reset  ->  { ok }   Clears today's approvals and all family questions.
export async function POST() {
  await resetDemo();
  return Response.json({ ok: true });
}
