import { getSupabase } from "@/lib/supabase";
import { CALLBACK_SLOTS, SEED_APPROVALS } from "@/data/seed";
import type { Approval, FamilyUpdate, Question } from "@/lib/types";

// Shared demo state: seed approvals (past days) + live rows from Supabase
// (today's approvals, family questions). The doctor and family windows are
// separate clients, so everything live must go through Supabase.
// Without Supabase env vars we fall back to process memory (fine for local dev).

const memory = { approvals: [] as Approval[], questions: [] as Question[] };

type ApprovalRow = {
  patient_id: string;
  day: string;
  update: FamilyUpdate;
  approved_by: string;
  approved_at: string;
};
type QuestionRow = {
  id: string;
  patient_id: string;
  question: string;
  asked_by: string;
  callback_slot: string | null;
  created_at: string;
};

const toApproval = (r: ApprovalRow): Approval => ({
  patientId: r.patient_id,
  day: r.day,
  update: r.update,
  approvedBy: r.approved_by,
  approvedAt: r.approved_at,
});
const toQuestion = (r: QuestionRow): Question => ({
  id: r.id,
  patientId: r.patient_id,
  question: r.question,
  askedBy: r.asked_by,
  callbackSlot: r.callback_slot,
  createdAt: r.created_at,
});

async function liveApprovals(): Promise<Approval[]> {
  const db = getSupabase();
  if (!db) return memory.approvals;
  const { data, error } = await db.from("approvals").select("*").order("approved_at");
  if (error) throw error;
  return (data as ApprovalRow[]).map(toApproval);
}

// All approvals for a patient, oldest first. A live approval replaces a seed one for the same day.
export async function getApprovals(patientId?: string): Promise<Approval[]> {
  const live = await liveApprovals();
  const byKey = new Map<string, Approval>();
  for (const a of [...SEED_APPROVALS, ...live]) byKey.set(`${a.patientId}:${a.day}`, a);
  return [...byKey.values()]
    .filter((a) => !patientId || a.patientId === patientId)
    .sort((a, b) => a.approvedAt.localeCompare(b.approvedAt));
}

export async function addApproval(a: Approval) {
  const db = getSupabase();
  if (!db) return void memory.approvals.push(a);
  const { error } = await db.from("approvals").insert({
    patient_id: a.patientId,
    day: a.day,
    update: a.update,
    approved_by: a.approvedBy,
    approved_at: a.approvedAt,
  });
  if (error) throw error;
}

export async function getQuestions(patientId?: string): Promise<Question[]> {
  const db = getSupabase();
  if (!db) return memory.questions.filter((q) => !patientId || q.patientId === patientId);
  let query = db.from("questions").select("*").order("created_at", { ascending: false });
  if (patientId) query = query.eq("patient_id", patientId);
  const { data, error } = await query;
  if (error) throw error;
  return (data as QuestionRow[]).map(toQuestion);
}

export async function addQuestion(patientId: string, question: string, askedBy: string): Promise<Question> {
  const q: Question = {
    id: crypto.randomUUID(),
    patientId,
    question,
    askedBy,
    callbackSlot: null,
    createdAt: new Date().toISOString(),
  };
  const db = getSupabase();
  if (!db) {
    memory.questions.unshift(q);
    return q;
  }
  const { error } = await db.from("questions").insert({
    id: q.id,
    patient_id: patientId,
    question,
    asked_by: askedBy,
    created_at: q.createdAt,
  });
  if (error) throw error;
  return q;
}

// Books the first free slot and attaches it to the patient's latest question without a slot.
export async function bookCallback(patientId: string): Promise<string | null> {
  const all = await getQuestions();
  const taken = new Set(all.map((q) => q.callbackSlot).filter(Boolean));
  const slot = CALLBACK_SLOTS.find((s) => !taken.has(s)) ?? null;
  const target = all.find((q) => q.patientId === patientId && !q.callbackSlot);
  if (!slot) return null;
  if (!target) return slot;

  const db = getSupabase();
  if (!db) {
    target.callbackSlot = slot;
    return slot;
  }
  const { error } = await db.from("questions").update({ callback_slot: slot }).eq("id", target.id);
  if (error) throw error;
  return slot;
}

// Clears everything live so the demo starts fresh. Seed approvals stay.
export async function resetDemo() {
  const db = getSupabase();
  memory.approvals = [];
  memory.questions = [];
  if (!db) return;
  const all = "00000000-0000-0000-0000-000000000000";
  const a = await db.from("approvals").delete().neq("id", all);
  const q = await db.from("questions").delete().neq("id", all);
  if (a.error) throw a.error;
  if (q.error) throw q.error;
}
