import { askClaude } from "@/lib/ai";
import { findFallback } from "@/data/fallbacks";
import { familyUpdateSchema, type FamilyUpdate, type Patient } from "@/lib/types";

// Turns a raw chart note into a family-friendly draft, filtered by the rules
// nurses already follow (docs/research/nurse-input.md). The doctor approves it afterwards.

const SYSTEM = `You write the daily family update for a hospital patient in Portugal, based on the doctor's chart note.
Relatives are worried, not medical. The doctor reviews and approves your draft before anything is shared.
Today is Saturday 26 September 2026.

FILTER RULES (these mirror what nurses may legally say vs. what only doctors may say):
- scope "nursing": general condition and wellbeing only: stable, awake and responsive, vital signs stable, eating, sleeping, walking/mobility, obvious changes.
- scope "medical": explained diagnoses the patient already knows, what test results mean, planned exams and procedures, treatment changes, discharge. Allowed in the draft, but tagged so the doctor consciously approves it.
- WITHHOLD (kind "withheld", never in items/whyHere/headline/discharge):
  - new diagnoses the note says were not yet discussed with the patient (the patient must hear it first),
  - suspicious, unconfirmed or serious findings (e.g. suspected cancer): these are discussed in person,
  - prognosis, severity scores and goals-of-care topics: discussed in person.
  Give a short, respectful reason a doctor would agree with.
  Never hint at a withheld topic anywhere else, not even indirectly ("the doctor will discuss her blood sugar", "a spot on the X-ray"). Leave it out completely.
- INTERNAL (kind "internal"): instructions for the care team: blood draw times, medication names and doses, fluid orders, monitoring orders. Summarise each briefly.
- Never repeat raw numbers (lab values, doses, scores). Translate them into meaning ("the infection is clearly improving").
- If an exam is planned, you may say it is planned and its general purpose ("to check the lungs"), but never mention a withheld finding as its reason.
- ALWAYS keep every planned exam, procedure and treatment change from the plan as a "next" item, even when a withheld finding relates to it. Describe it neutrally. Families must never see an empty "what's next".

DISCHARGE: copy the expected discharge only if the note states one, including its condition, e.g. "Tuesday 29 September, if tomorrow's scan is clear". If the note has no date, use null. NEVER estimate or invent a date.

STYLE: warm, calm, plain English, short sentences, use the patient's first name. No jargon, no abbreviations.

Return ONLY a JSON object, no markdown fences:
{
  "status": "stable" | "improving" | "attention",
  "statusLabel": "1-2 words, e.g. Improving",
  "headline": "max 5 words for today's timeline entry",
  "whyHere": "1-2 sentences: why the patient is in hospital, only already-known diagnoses",
  "items": [
    { "id": "i1", "section": "today", "scope": "nursing" | "medical", "text": "...", "when": null },
    { "id": "i4", "section": "next", "scope": "medical", "text": "...", "when": "Sun 27 Sep" }
  ],
  "discharge": "string or null",
  "withheld": [ { "text": "short description", "reason": "why it is not shared", "kind": "withheld" | "internal" } ]
}
Use 2-4 "today" items and 1-3 "next" items. "when" is a short day label like "Mon 28 Sep" for dated next steps, otherwise null.`;

function parseUpdate(text: string): FamilyUpdate | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed = familyUpdateSchema.safeParse(JSON.parse(text.slice(start, end + 1)));
    if (!parsed.success) console.warn("[draft] invalid shape:", parsed.error.issues.slice(0, 3));
    return parsed.success ? parsed.data : null;
  } catch (err) {
    console.warn("[draft] invalid JSON:", String(err));
    return null;
  }
}

export async function generateDraft(note: string, patient: Patient) {
  const prompt = `Patient: ${patient.name}, ${patient.age}, refer to ${patient.pronoun === "she" ? "her" : "him"} as ${patient.firstName}.

CHART NOTE:
${note}`;
  let result = await askClaude(prompt, SYSTEM);
  let live = parseUpdate(result.text);
  // The model sometimes drops the plan when a finding is withheld. Ask once more, explicitly.
  if (live && result.source === "live" && !live.items.some((i) => i.section === "next")) {
    result = await askClaude(
      `${prompt}\n\nIMPORTANT: your previous draft had no "next" items. Include every planned exam and treatment change from the PLAN as a neutral "next" item.`,
      SYSTEM,
    );
    live = parseUpdate(result.text) ?? live;
  }
  if (live) return { update: live, source: result.source };
  // Live answer was unusable: serve the cached draft for this note instead.
  const cached = parseUpdate(findFallback(prompt));
  if (!cached) throw new Error("No usable draft (live or fallback)");
  return { update: cached, source: "fallback" as const };
}
