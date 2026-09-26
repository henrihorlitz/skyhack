# MindPeace: build plan

Decisions from the planning session. Big picture and rules: `CLAUDE.md`. Demo script: `DEMO.md`.

## 1. Doctor flow (desktop)

### ① Ward overview: "Ward 4B · Dr. Inês Silva"
- 22 beds in a list/grid. 3–4 patients have real seed data, the rest are grayed out as "approved" (they show the scale).
- Status per patient: 📝 Draft ready · ✅ Approved · ❓ n family questions (badge).
- Click a patient → review screen.

### ② Review screen (one patient)
- **Left:** the original chart note in the real structure (Problems active/resolved → Findings → Plan for tomorrow incl. nursing instructions).
- **Right:** the AI draft for the family, in sections *Why she's here* / *How today went* / *What's next* / *Expected discharge*.
  - Each item is tagged 🟢 nursing scope or 🟡 medical scope.
  - Each item can be **toggled on/off** and its **text edited inline**.
- **Withheld panel:** 🔒 withheld items with a reason (e.g. suspicion pending biopsy) and ⚫ internal nursing instructions.
- **Family questions:** questions logged by the voice agent, with the booked callback slot.
- **[Approve & send to family]** → confirmation "Sent to 2 family members" → next patient.

### Live AI (demo)
- The draft is generated **live** by Claude (via `askClaude()` / `/api/agent`), with a fallback in `src/data/fallbacks.ts`.
- **Judge trick:** the note is editable. A judge adds a line (e.g. "CT: 3 cm mass, suspicious for malignancy") → **Regenerate** → the AI withholds it with a reason. Prepare a pre-cached fallback for exactly this line.

## 2. Family flow (mobile)

_To plan next._

## 3. Voice agent

_To plan._

## 4. Seed data

_To plan._
