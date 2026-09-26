// Realistic, SYNTHETIC demo data. Never put real patient data here.
// The demo "today" is the hackathon day. Past days below are already approved.

import type { Approval, Patient } from "@/lib/types";

export const DEMO_TODAY = "2026-09-26";

export const HOSPITAL = {
  name: "Hospital São Rafael",
  city: "Lisboa",
  department: "Internal Medicine",
  ward: "Ward 4B",
  beds: 22,
};

export const DEMO_USER = {
  name: "Dr. Inês Silva",
  shortName: "Dr. Silva",
  role: "Internal Medicine",
  avatar: "IS",
};

export const WARD_INFO = {
  location: "Building B, 4th floor (Ward 4B). Lifts are next to the main reception.",
  visitingHours: "Every day 15:00–20:00. Up to 2 visitors at a time per patient.",
  parking: "Underground car park, entrance on the east side of the hospital. First 30 minutes free.",
  doctorPhoneHour: "Doctors take family calls every day 12:00–13:00.",
  bringItems: "Glasses, hearing aids, slippers, toiletries and a phone charger are welcome.",
};

export const PATIENTS: Patient[] = [
  {
    id: "maria",
    bed: 12,
    name: "Maria Ferreira",
    firstName: "Maria",
    age: 78,
    pronoun: "she",
    admitted: "2026-09-23",
    family: [
      { name: "Ana Ferreira", relation: "daughter" },
      { name: "Pedro Ferreira", relation: "son" },
    ],
  },
  {
    id: "joao",
    bed: 7,
    name: "João Almeida",
    firstName: "João",
    age: 82,
    pronoun: "he",
    admitted: "2026-09-22",
    family: [{ name: "Lurdes Almeida", relation: "wife" }],
  },
  {
    id: "rosa",
    bed: 15,
    name: "Rosa Costa",
    firstName: "Rosa",
    age: 69,
    pronoun: "she",
    admitted: "2026-09-21",
    family: [{ name: "Miguel Costa", relation: "son" }],
  },
];

// The other beds on the ward: only shown grayed out in the ward overview, to show scale.
export const OTHER_BEDS = [
  "Manuel Sousa", "Fernanda Lopes", "António Pereira", "Graça Martins", "Carlos Rodrigues",
  "Helena Carvalho", "José Gomes", "Conceição Ribeiro", "Luís Fernandes", "Teresa Pinto",
  "Joaquim Marques", "Isabel Teixeira", "Francisco Moreira", "Rosário Correia", "Artur Mendes",
  "Beatriz Nunes", "Alberto Vieira", "Lúcia Monteiro", "Fernando Cardoso",
].map((name, i) => ({ bed: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 16, 17, 18, 19, 20, 21, 22][i], name }));

export const CALLBACK_SLOTS = [
  "Sun 27 Sep, 12:15",
  "Sun 27 Sep, 12:30",
  "Sun 27 Sep, 12:45",
  "Mon 28 Sep, 12:00",
];

const approved = (patientId: string, day: string, time: string, update: Approval["update"]): Approval => ({
  patientId,
  day,
  update,
  approvedBy: DEMO_USER.name,
  approvedAt: `${day}T${time}:00+01:00`,
});

const item = (id: string, section: "today" | "next", scope: "nursing" | "medical", text: string, when?: string) => ({
  id, section, scope, text, when: when ?? null, include: true,
});

// Already-approved updates from previous days (and Rosa's from this morning).
export const SEED_APPROVALS: Approval[] = [
  approved("maria", "2026-09-23", "17:05", {
    status: "attention",
    statusLabel: "Being treated",
    headline: "Admitted with a chest infection",
    whyHere: "Maria has pneumonia, an infection in her right lung. She is being treated with antibiotics through a drip.",
    items: [
      item("m1a", "today", "medical", "Maria came in through the emergency department with pneumonia."),
      item("m1b", "today", "nursing", "She is getting a little extra oxygen to help her breathe and is comfortable."),
      item("m1c", "next", "medical", "Blood tests tomorrow morning to see how the infection responds.", "Thu 24 Sep"),
    ],
    discharge: null,
    withheld: [],
  }),
  approved("maria", "2026-09-24", "16:40", {
    status: "improving",
    statusLabel: "Improving",
    headline: "Fever coming down",
    whyHere: "Maria has pneumonia, an infection in her right lung. She is being treated with antibiotics through a drip.",
    items: [
      item("m2a", "today", "nursing", "Her fever is coming down and she slept well."),
      item("m2b", "today", "medical", "The first blood tests show the antibiotics are working."),
      item("m2c", "today", "nursing", "She needs less extra oxygen than yesterday."),
    ],
    discharge: null,
    withheld: [],
  }),
  approved("maria", "2026-09-25", "16:10", {
    status: "improving",
    statusLabel: "Improving",
    headline: "Breathing on her own again",
    whyHere: "Maria has pneumonia, an infection in her right lung. She is being treated with antibiotics through a drip.",
    items: [
      item("m3a", "today", "nursing", "Maria is breathing well without extra oxygen."),
      item("m3b", "today", "nursing", "She started eating again and sat in a chair for an hour with the physiotherapist."),
      item("m3c", "next", "medical", "The doctors will review her progress and plan the next steps.", "Sat 26 Sep"),
    ],
    discharge: null,
    withheld: [],
  }),
  approved("joao", "2026-09-25", "17:20", {
    status: "attention",
    statusLabel: "Being treated",
    headline: "Treatment to remove extra fluid",
    whyHere: "João's heart is not pumping strongly enough, so fluid has built up in his body. He is getting medicine to remove it.",
    items: [
      item("j1a", "today", "nursing", "João is awake and talking, but tired."),
      item("j1b", "today", "medical", "The medicine is slowly removing the extra fluid."),
    ],
    discharge: null,
    withheld: [],
  }),
  approved("rosa", "2026-09-26", "11:40", {
    status: "stable",
    statusLabel: "Stable",
    headline: "Walking with a frame",
    whyHere: "Rosa broke her right hip and had an operation to replace part of the joint on 21 September.",
    items: [
      item("r1a", "today", "nursing", "Rosa walked 20 metres with a frame and the physiotherapist, and is in good spirits."),
      item("r1b", "today", "medical", "The wound is healing well and her blood count has recovered."),
      item("r1c", "next", "medical", "Move to the rehabilitation unit to keep building strength.", "Wed 30 Sep"),
    ],
    discharge: "Wednesday 30 September, to the rehabilitation unit",
    withheld: [],
  }),
];

export function getPatient(id: string) {
  return PATIENTS.find((p) => p.id === id);
}
