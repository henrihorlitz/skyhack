// Realistic, SYNTHETIC demo data. Never put real patient data here.
// TOMORROW: replace with data that fits your idea — realistic names/values, no "Test 123".

export const DEMO_USER = {
  name: "Dr. Sofia Almeida",
  role: "General Practitioner",
  clinic: "Clínica Penha de França, Lisbon",
  avatar: "SA",
};

export const DEMO_PATIENTS = [
  {
    id: "p1",
    name: "João Ferreira",
    age: 67,
    conditions: ["Type 2 diabetes", "Hypertension"],
    medications: ["Metformin 1000mg", "Lisinopril 10mg"],
    lastVisit: "2026-08-14",
  },
  {
    id: "p2",
    name: "Marta Costa",
    age: 34,
    conditions: ["Migraine"],
    medications: ["Sumatriptan 50mg (as needed)"],
    lastVisit: "2026-09-02",
  },
  {
    id: "p3",
    name: "Rui Oliveira",
    age: 52,
    conditions: ["Atrial fibrillation"],
    medications: ["Apixaban 5mg", "Bisoprolol 2.5mg"],
    lastVisit: "2026-07-21",
  },
];

export const DEMO_SLOTS = [
  { id: "s101", specialty: "cardiology", doctor: "Dr. Tiago Mendes", time: "2026-09-29 09:30" },
  { id: "s102", specialty: "cardiology", doctor: "Dr. Tiago Mendes", time: "2026-09-30 14:00" },
  { id: "s201", specialty: "general practice", doctor: "Dr. Sofia Almeida", time: "2026-09-28 11:15" },
  { id: "s301", specialty: "neurology", doctor: "Dr. Inês Rocha", time: "2026-10-01 10:00" },
];
