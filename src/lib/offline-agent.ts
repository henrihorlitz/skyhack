import { getApprovals } from "@/lib/store";
import { passQuestion, type AgentEvent } from "@/lib/agent-tools";
import { findFallback } from "@/data/fallbacks";
import { DEMO_USER, WARD_INFO } from "@/data/seed";

// When the AI is unreachable, the chat still answers from real, approved data (Supabase is
// separate from the AI provider), and medical questions still reach the doctor with a callback.
// So the demo's closed loop (question → doctor's queue) works even offline.

const MEDICAL = /cancer|tumou?r|malignan|biopsy|diagnos|result|prognos|serious|dying|die\b|diabet|sugar|scan show|what'?s wrong|x-?ray/i;

export async function offlineAnswer(patientId: string, caller: string, question: string, events: AgentEvent[]) {
  const q = question.toLowerCase();

  if (MEDICAL.test(question)) {
    const result = await passQuestion(patientId, caller, question, events);
    const slot = result.match(/on (.+)\.$/)?.[1];
    return slot
      ? `That's a question ${DEMO_USER.shortName} should answer personally. I've passed it on to her, and she'll call you on ${slot}.`
      : `That's a question ${DEMO_USER.shortName} should answer personally. I've passed it on to her. ${WARD_INFO.doctorPhoneHour}`;
  }

  if (/visit|parking|where|bring/.test(q)) return `${WARD_INFO.visitingHours} ${WARD_INFO.location}`;

  const latest = (await getApprovals(patientId)).at(-1);
  if (!latest) return findFallback(question);
  const { update } = latest;
  if (/home|discharge|leave|out of hospital/.test(q)) {
    return update.discharge
      ? `${DEMO_USER.shortName} expects ${update.discharge}. That's an estimate and can change.`
      : `${DEMO_USER.shortName} hasn't estimated a discharge date yet. You'll see it in the app as soon as she does.`;
  }
  const today = update.items.filter((i) => i.section === "today").slice(0, 2).map((i) => i.text);
  return [`Here's the latest update approved by ${DEMO_USER.shortName}.`, ...today].join(" ");
}
