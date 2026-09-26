import { addApproval } from "@/lib/store";
import { DEMO_TODAY, DEMO_USER, getPatient } from "@/data/seed";
import { familyUpdateSchema } from "@/lib/types";

// POST /api/approve  { patientId, update }  ->  { ok }
// Only items the doctor left switched on reach the family.
export async function POST(req: Request) {
  const body = (await req.json()) as { patientId?: string; update?: unknown };
  const parsed = familyUpdateSchema.safeParse(body.update);
  if (!body.patientId || !getPatient(body.patientId) || !parsed.success) {
    return Response.json({ error: "valid patientId and update required" }, { status: 400 });
  }
  // Only what the doctor left switched on reaches the family.
  const d = parsed.data;
  const update = { ...d, items: d.items.filter((i) => i.include), discharge: d.dischargeShared ? d.discharge : null };
  await addApproval({
    patientId: body.patientId,
    day: DEMO_TODAY,
    update,
    approvedBy: DEMO_USER.name,
    approvedAt: new Date().toISOString(),
  });
  return Response.json({ ok: true });
}
