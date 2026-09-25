import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { DEMO_PATIENTS, DEMO_SLOTS } from "@/data/seed";

// Example tools for the agent. They read/write DEMO DATA only.
// TOMORROW: replace these with the 2–4 actions your product's agent needs.
// Faking the backend is fine — the agent deciding *which* tool to call is the real part.

export const lookupPatient = betaZodTool({
  name: "lookup_patient",
  description: "Look up a patient's profile (age, conditions, medications) by name.",
  inputSchema: z.object({ name: z.string().describe("Patient first or full name") }),
  run: async ({ name }) => {
    const p = DEMO_PATIENTS.find((x) => x.name.toLowerCase().includes(name.toLowerCase()));
    return p ? JSON.stringify(p) : `No patient found matching "${name}".`;
  },
});

export const findAppointmentSlots = betaZodTool({
  name: "find_appointment_slots",
  description: "Find open appointment slots for a medical specialty.",
  inputSchema: z.object({ specialty: z.string().describe("e.g. cardiology, general practice") }),
  run: async ({ specialty }) => {
    const slots = DEMO_SLOTS.filter((s) => s.specialty.includes(specialty.toLowerCase()));
    return slots.length ? JSON.stringify(slots) : `No open slots for ${specialty} this week.`;
  },
});

export const bookAppointment = betaZodTool({
  name: "book_appointment",
  description: "Book an appointment slot for a patient. Returns a confirmation.",
  inputSchema: z.object({ patientName: z.string(), slotId: z.string() }),
  run: async ({ patientName, slotId }) => {
    // Faked: no real booking system behind this.
    return JSON.stringify({ status: "confirmed", confirmation: `SKY-${slotId}`, patientName });
  },
});

export const AGENT_TOOLS = [lookupPatient, findAppointmentSlots, bookAppointment];
