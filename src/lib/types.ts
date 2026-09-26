import { z } from "zod";

// The family-facing update the AI drafts from a chart note and the doctor approves.
// One schema for the AI output, the Supabase `approvals.update` column and the UI.

export const updateItemSchema = z.object({
  id: z.string(),
  section: z.enum(["today", "next"]),
  text: z.string(),
  // nursing = a nurse may already say this; medical = only after doctor approval
  scope: z.enum(["nursing", "medical"]),
  // Only for "next" items with a known day, e.g. "Sun 27 Sep". Shown as a future timeline node.
  when: z.string().nullish(),
  include: z.boolean().default(true),
});

export const withheldSchema = z.object({
  text: z.string(),
  reason: z.string(),
  // withheld = medical info not for the family (yet); internal = instructions for the care team
  kind: z.enum(["withheld", "internal"]),
});

export const familyUpdateSchema = z.object({
  status: z.enum(["stable", "improving", "attention"]),
  statusLabel: z.string(),
  headline: z.string(),
  whyHere: z.string(),
  items: z.array(updateItemSchema),
  // null = no date in the note. The AI must never invent one.
  discharge: z.string().nullable(),
  withheld: z.array(withheldSchema),
});

export type UpdateItem = z.infer<typeof updateItemSchema>;
export type Withheld = z.infer<typeof withheldSchema>;
export type FamilyUpdate = z.infer<typeof familyUpdateSchema>;

export type Approval = {
  patientId: string;
  day: string; // ISO date, e.g. "2026-09-26"
  update: FamilyUpdate;
  approvedBy: string;
  approvedAt: string; // ISO timestamp
};

export type Question = {
  id: string;
  patientId: string;
  question: string;
  askedBy: string;
  callbackSlot: string | null;
  createdAt: string;
};

export type Patient = {
  id: string;
  bed: number;
  name: string;
  firstName: string;
  age: number;
  pronoun: "she" | "he";
  admitted: string;
  family: { name: string; relation: string }[];
};
