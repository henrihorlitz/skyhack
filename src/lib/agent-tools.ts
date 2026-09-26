import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { addQuestion, getApprovals, nextFreeSlot, setCallback } from "@/lib/store";
import { DEMO_USER, WARD_INFO, getPatient } from "@/data/seed";

// Tools for the family voice agent. They only ever expose APPROVED information.
// Each tool also records a short "event" so the UI can show what the agent did.

export type AgentEvent = { tool: string; label: string };

export function makeAgentTools(patientId: string, askedBy: string, events: AgentEvent[]) {
  const patient = getPatient(patientId);
  // The model may call log + book in parallel and in either order, so link them here.
  let loggedId: string | null = null;
  let bookedSlot: string | null = null;

  const getApprovedUpdate = betaZodTool({
    name: "get_approved_update",
    description:
      "Get the doctor-approved family update for the patient: status, why they are in hospital, today's update, next steps and expected discharge. This is the ONLY medical information you may share.",
    inputSchema: z.object({}),
    run: async () => {
      const approvals = await getApprovals(patientId);
      const latest = approvals.at(-1);
      events.push({ tool: "get_approved_update", label: "Read the approved update" });
      if (!latest) return "No approved update yet.";
      const { update } = latest;
      return JSON.stringify({
        patient: patient?.name,
        approvedBy: latest.approvedBy,
        approvedAt: latest.approvedAt,
        status: update.statusLabel,
        whyHere: update.whyHere,
        today: update.items.filter((i) => i.section === "today").map((i) => i.text),
        next: update.items.filter((i) => i.section === "next").map((i) => `${i.when ? i.when + ": " : ""}${i.text}`),
        expectedDischarge: update.discharge ?? "Not estimated yet by the doctor.",
        earlierDays: approvals.slice(0, -1).map((a) => `${a.day}: ${a.update.headline}`),
      });
    },
  });

  const getWardInfo = betaZodTool({
    name: "get_ward_info",
    description: "Practical, non-medical ward information: location, visiting hours, parking, doctor phone hour, what to bring.",
    inputSchema: z.object({}),
    run: async () => {
      events.push({ tool: "get_ward_info", label: "Checked ward info" });
      return JSON.stringify(WARD_INFO);
    },
  });

  const logQuestion = betaZodTool({
    name: "log_question_for_doctor",
    description:
      "Pass a question you are not allowed to answer to the patient's doctor. Use it for any medical question beyond the approved update. Phrase the question clearly in English.",
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
