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
  "today": [ { "scope": "nursing" | "medical", "text": "..." } ],
  "next": [ { "plan": 1, "scope": "medical", "text": "...", "when": "Sun 27 Sep" } ],
  "planSkipped": [ { "plan": 3, "reason": "discharge" | "withheld" } ],
  "discharge": "string or null",
  "withheld": [ { "text": "short description", "reason": "why it is not shared", "kind": "withheld" | "internal" } ]
}
"today": 2-4 items.
"next" + "planSkipped" MUST together cover EVERY numbered PLAN ITEM given with the note, each exactly once:
- a planned exam, procedure, treatment change, review or meeting → one "next" item, with its "plan" number;
- the expected discharge line → "planSkipped" with reason "discharge" (it goes in "discharge");
- an item that only concerns a withheld topic → "planSkipped" with reason "withheld" (and in "withheld").
"when" is a short day label like "Mon 28 Sep" for dated next steps, otherwise null.`;

// The numbered "- " lines of the note's PLAN section, so we can check that every step made it into the draft.
export function planItems(note: string): string[] {
  const items: string[] = [];
  let inPlan = false;
  for (const raw of note.split("\n")) {
    const line = raw.trim();
    if (/^[A-Z][A-Z ()/0-9]*$/.test(line)) inPlan = line === "PLAN"; // a section header
    else if (inPlan && line.startsWith("-")) items.push(line.replace(/^-\s*/, ""));
  }
  return items;
}

type Section = "today" | "next";
type RawItem = { scope?: string; text?: string; when?: string | null; plan?: number };
type Parsed = { update: FamilyUpdate; covered: Set<number> };

// The AI returns separate "today"/"next" lists (a required list of its own is dropped far less
// often than one section of a mixed list). Cached drafts use the app's "items" shape. Accept both.
function normalize(raw: Record<string, unknown>) {
  if (Array.isArray(raw.items)) return raw;
  const toItems = (section: Section, list: unknown) =>
    (Array.isArray(list) ? (list as RawItem[]) : []).map((i, n) => ({
      id: `${section}-${n + 1}`,
      section,
      scope: i.scope === "nursing" ? "nursing" : "medical",
      text: i.text ?? "",
      when: i.when ?? null,
      include: true,
    }));
  const { today, next, ...rest } = raw;
  return { ...rest, items: [...toItems("today", today), ...toItems("next", next)] };
}

function parseDraft(text: string): Parsed | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const raw = JSON.parse(text.slice(start, end + 1));
    const parsed = familyUpdateSchema.safeParse(normalize(raw));
    if (!parsed.success) console.warn("[draft] invalid shape:", parsed.error.issues.slice(0, 3));
    if (!parsed.success) return null;
    // Which PLAN items the model accounted for (as a next step, or skipped with a reason).
    const covered = new Set<number>(
      [...(Array.isArray(raw.next) ? raw.next : []), ...(Array.isArray(raw.planSkipped) ? raw.planSkipped : [])]
        .map((i: RawItem) => Number(i.plan))
        .filter((n: number) => Number.isFinite(n)),
    );
    return { update: parsed.data, covered };
  } catch (err) {
    console.warn("[draft] invalid JSON:", String(err));
    return null;
  }
}

const hasNext = (u: FamilyUpdate) => u.items.some((i) => i.section === "next" && i.text.trim());

const parseUpdate = (text: string) => parseDraft(text)?.update ?? null;

export async function generateDraft(note: string, patient: Patient) {
  const plan = planItems(note);
  const prompt = `Patient: ${patient.name}, ${patient.age}, refer to ${patient.pronoun === "she" ? "her" : "him"} as ${patient.firstName}.

CHART NOTE:
${note}

PLAN ITEMS (cover every one, see rules):
${plan.map((p, i) => `${i + 1}. ${p}`).join("\n")}`;

  const missing = (d: Parsed) => plan.map((p, i) => ({ n: i + 1, p })).filter(({ n }) => !d.covered.has(n));
  let result = await askClaude(prompt, SYSTEM);
  let live = parseDraft(result.text);

  // Every plan step must reach the family (or be skipped for a reason). If any are missing, ask once more.
  if (live && result.source === "live" && (missing(live).length > 0 || !hasNext(live.update))) {
    const gaps = missing(live);
    console.warn("[draft] plan items missing, retrying once:", gaps.map((g) => g.n));
    result = await askClaude(
      `${prompt}\n\nIMPORTANT: your previous draft did not cover these PLAN ITEMS: ${gaps.map((g) => `${g.n}. ${g.p}`).join("; ")}. Cover EVERY plan item as a neutral "next" item (or in "planSkipped" with a reason).`,
      SYSTEM,
    );
    const retry = parseDraft(result.text);
    if (retry && hasNext(retry.update) && missing(retry).length <= gaps.length) live = retry;
  }

  // Last safety net: never show an empty "What's next". Borrow the prepared next steps for this patient.
  const cached = parseUpdate(findFallback(prompt));
  let update = live?.update ?? null;
  if (update && !hasNext(update) && cached) {
    console.warn("[draft] still no next steps, using prepared ones");
    update = { ...update, items: [...update.items, ...cached.items.filter((i) => i.section === "next")] };
  }
  if (update) return { update, source: result.source };
  // Live answer was unusable: serve the cached draft for this note instead.
  if (!cached) throw new Error("No usable draft (live or fallback)");
  return { update: cached, source: "fallback" as const };
}
