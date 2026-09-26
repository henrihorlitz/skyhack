// Cached family-update drafts, served when the live AI call fails.
// Same JSON shape the AI returns (see src/lib/draft.ts). Replace with real live output later.

const MARIA_WHY = "Maria has pneumonia, an infection in her right lung. She is being treated with antibiotics through a drip.";

const mariaBase = {
  status: "improving",
  statusLabel: "Improving",
  headline: "No fever, eating well",
  whyHere: MARIA_WHY,
  items: [
    { id: "i1", section: "today", scope: "nursing", text: "Maria has had no fever for more than a day and a half.", when: null },
    { id: "i2", section: "today", scope: "nursing", text: "She is awake, alert and eating most of her meals. She sat in a chair with help today.", when: null },
    { id: "i3", section: "today", scope: "medical", text: "Her blood tests and chest X-ray show the infection is clearly getting better.", when: null },
    { id: "i4", section: "next", scope: "medical", text: "A CT scan of the chest, to make sure the lungs are healing well.", when: "Sun 27 Sep" },
    { id: "i5", section: "next", scope: "medical", text: "If all goes well, her antibiotics switch from the drip to tablets.", when: "Mon 28 Sep" },
  ],
  discharge: "Tuesday 29 September, if tomorrow's scan is clear and she stays well",
  withheld: [
    { kind: "withheld", text: "Raised blood sugar, probable new diabetes", reason: "A new diagnosis Maria has not heard yet. She should hear it from her doctor first (planned for Monday's ward round)." },
    { kind: "internal", text: "Blood tests at 07:00", reason: "Instruction for the nursing team." },
    { kind: "internal", text: "Blood sugar checks and insulin per protocol", reason: "Instruction for the nursing team." },
    { kind: "internal", text: "Stop IV fluids once she drinks enough; physio and falls precautions", reason: "Instruction for the nursing team." },
  ],
};

const mariaTrick = {
  ...mariaBase,
  withheld: [
    { kind: "withheld", text: "Suspicious opacity in the right upper lung on X-ray review", reason: "An unconfirmed, potentially serious finding. It must be confirmed first and then discussed with Maria in person by her doctor." },
    ...mariaBase.withheld,
  ],
};

const joao = {
  status: "attention",
  statusLabel: "Being treated",
  headline: "Slowly losing extra fluid",
  whyHere: "João's heart is not pumping strongly enough, so fluid has built up in his body. He is getting medicine to remove it.",
  items: [
    { id: "i1", section: "today", scope: "nursing", text: "João is awake and talking. He is still tired and ate half of his lunch.", when: null },
    { id: "i2", section: "today", scope: "medical", text: "The medicine is working: he has lost some of the extra fluid and his breathing is a little easier.", when: null },
    { id: "i3", section: "next", scope: "medical", text: "The doctors will review how well the treatment is working.", when: "Mon 28 Sep" },
    { id: "i4", section: "next", scope: "nursing", text: "He still gets a little extra oxygen, which will be reduced as he improves.", when: null },
  ],
  discharge: null,
  withheld: [
    { kind: "withheld", text: "Heart scan result and what it means for the future", reason: "Prognosis and care goals will be discussed in person at a family meeting with his doctor." },
    { kind: "internal", text: "Daily weight, fluid limit and fluid chart", reason: "Instruction for the nursing team." },
    { kind: "internal", text: "Blood tests at 07:00", reason: "Instruction for the nursing team." },
  ],
};

const rosa = {
  status: "stable",
  statusLabel: "Stable",
  headline: "Walking with a frame",
  whyHere: "Rosa broke her right hip and had an operation to replace part of the joint on 21 September.",
  items: [
    { id: "i1", section: "today", scope: "nursing", text: "Rosa walked 20 metres with a frame and the physiotherapist, and is in good spirits.", when: null },
    { id: "i2", section: "today", scope: "medical", text: "The wound is healing well and her blood count has recovered.", when: null },
    { id: "i3", section: "next", scope: "medical", text: "Move to the rehabilitation unit to keep building strength.", when: "Wed 30 Sep" },
  ],
  discharge: "Wednesday 30 September, to the rehabilitation unit",
  withheld: [
    { kind: "internal", text: "Daily wound check, blood thinner injection, physio twice a day", reason: "Instruction for the nursing team." },
  ],
};

// Order matters: the first key found in the prompt wins, so the judge-trick draft comes first.
export const DRAFT_FALLBACKS: Record<string, string> = {
  malignancy: JSON.stringify(mariaTrick),
  "Maria Ferreira": JSON.stringify(mariaBase),
  "João Almeida": JSON.stringify(joao),
  "Rosa Costa": JSON.stringify(rosa),
};
