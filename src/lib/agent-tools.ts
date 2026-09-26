import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { addQuestion, getApprovals, nextFreeSlot, setCallback } from "@/lib/store";
import { DEMO_USER, WARD_INFO, getPatient } from "@/data/seed";

// Tools for the family assistant. They only ever expose APPROVED information.
// Shared by the chat (Claude tool runner, below) and the voice call (ElevenLabs client tools
// → /api/voice-tool). Each run records a short "event" so the UI can show what the agent did.

export type AgentEvent = { tool: string; label: string };

export async function approvedUpdate(patientId: string) {
  const approvals = await getApprovals(patientId);
  const latest = approvals.at(-1);
  if (!latest) return "No approved update yet.";
  const { update } = latest;
  return JSON.stringify({
    patient: getPatient(patientId)?.name,
    approvedBy: latest.approvedBy,
    approvedAt: latest.approvedAt,
    status: update.statusLabel,
    whyHere: update.whyHere,
    today: update.items.filter((i) => i.section === "today").map((i) => i.text),
    next: update.items.filter((i) => i.section === "next").map((i) => `${i.when ? i.when + ": " : ""}${i.text}`),
    expectedDischarge: update.discharge ?? "Not estimated yet by the doctor.",
    earlierDays: approvals.slice(0, -1).map((a) => `${a.day}: ${a.update.headline}`),
  });
}

export const wardInfo = () => JSON.stringify(WARD_INFO);

// Logs the question and books a callback in one step (used by the voice call).
export async function passQuestion(patientId: string, askedBy: string, question: string, events: AgentEvent[]) {
  const q = await addQuestion(patientId, question, askedBy);
  events.push({ tool: "log_question_for_doctor", label: `Question sent to ${DEMO_USER.shortName}` });
  const slot = await nextFreeSlot();
  if (!slot) return `Passed to ${DEMO_USER.name}. No callback slot free; the phone hour is 12:00–13:00.`;
  await setCallback(q.id, slot);
  events.push({ tool: "book_callback_slot", label: `Callback booked: ${slot}` });
  return `Passed to ${DEMO_USER.name}. She will call personally on ${slot}.`;
}

export function makeAgentTools(patientId: string, askedBy: string, events: AgentEvent[]) {
  // The model may call log + book in parallel and in either order, so link them here.
  let loggedId: string | null = null;
  let bookedSlot: string | null = null;

  const getApprovedUpdate = betaZodTool({
    name: "get_approved_update",
    description:
      "Get the doctor-approved family update for the patient: status, why they are in hospital, today's update, next steps and expected discharge. This is the ONLY medical information you may share.",
    inputSchema: z.object({}),
    run: async () => {
      events.push({ tool: "get_approved_update", label: "Read the approved update" });
      return approvedUpdate(patientId);
    },
  });

  const getWardInfo = betaZodTool({
    name: "get_ward_info",
    description: "Practical, non-medical ward information: location, visiting hours, parking, doctor phone hour, what to bring.",
    inputSchema: z.object({}),
    run: async () => {
      events.push({ tool: "get_ward_info", label: "Checked ward info" });
      return wardInfo();
    },
  });

  const logQuestion = betaZodTool({
    name: "log_question_for_doctor",
    description:
      "Pass a question you are not allowed to answer to the patient's doctor. Use it for any medical question beyond the approved update.",
    inputSchema: z.object({
      question: z.string().describe("The question as the family member asked it: short, first person, e.g. 'Does my mother have cancer?'"),
    }),
    run: async ({ question }) => {
      const q = await addQuestion(patientId, question, askedBy);
      loggedId = q.id;
      if (bookedSlot) await setCallback(q.id, bookedSlot);
      events.push({ tool: "log_question_for_doctor", label: `Question sent to ${DEMO_USER.shortName}` });
      return `Logged for ${DEMO_USER.name}. It will appear on her review screen.`;
    },
  });

  const bookCallbackSlot = betaZodTool({
    name: "book_callback_slot",
    description: "Book a personal callback from the doctor during the phone hour, for the question you just logged.",
    inputSchema: z.object({}),
    run: async () => {
      const slot = bookedSlot ?? (await nextFreeSlot());
      bookedSlot = slot;
      if (slot && loggedId) await setCallback(loggedId, slot);
      events.push({ tool: "book_callback_slot", label: slot ? `Callback booked: ${slot}` : "No callback slot free" });
      return slot ? `Booked: ${DEMO_USER.name} will call on ${slot}.` : "No free slots. Suggest the daily phone hour 12:00–13:00.";
    },
  });

  return [getApprovedUpdate, getWardInfo, logQuestion, bookCallbackSlot];
}
