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

### Demo setup
- **Two browser windows on one laptop:** doctor view (wide) + family app (a narrow browser window, no phone frame). Both on the projector.
- So the family app must be a real mobile layout, designed for ~390px width.
- **Shared state lives in Supabase** (approved updates, questions, callbacks). The two windows are separate clients, and Vercel functions don't share memory.
- The family app **polls every 2s**, which is simpler than realtime and looks just as live.

### Screen (single page)
1. Header: logo, patient name + age, status pill ("🟢 Stable · updated 14:32 · approved by Dr. Silva").
2. *Why she's here* (plain language).
3. Timeline: past days (one line each, **tap to expand** the full approved update) → **today highlighted** → upcoming (e.g. "Tomorrow: chest CT") → 🏠 **Expected home: ~Friday** (or "Not estimated yet").
   - After the doctor approves, the new node appears live.
4. Sticky button **📞 Ask about Maria** → starts the voice agent (browser microphone).

## 3. Voice agent

### Tech: our stack first, upgrade if time
- **v1 (build this):** turn-based. Browser speech recognition (Web Speech API, built into Chrome, no new library) → `/api/agent` (Claude with tools) → `/api/tts` (ElevenLabs) → play audio. ~3–5s per answer.
- **v2 (only if we're ahead at 13:30):** try ElevenLabs Conversational AI (real-time). Needs a new library, so ask Henri first.

### Interaction
- **Tap to talk** (tap the mic, speak, tap again), because the hall is loud.
- **Live transcript** of the conversation as chat bubbles.
- **Tool chips** so judges see the agent act: "📋 Question sent to Dr. Silva", "📅 Callback booked Thu 12:15".
- **Text input as backup** if the mic fails.

### Behavior rules (system prompt)
- Answer only from the **approved update** + nursing-scope info (🟢). Never from the raw note.
- For medical questions beyond the approved content: decline kindly, explain that the doctor will answer personally, **log the question**, and **offer a callback**.
- Never invent or estimate dates. Only repeat the approved expected discharge.
- Short, warm, spoken-style answers (2–3 sentences). English in the demo; multilingual is a pitch point.

### Tools (replace the example tools in `src/lib/agent-tools.ts`)
| Tool | Purpose |
|---|---|
| `get_approved_update` | Current approved status + timeline + expected discharge |
| `get_ward_info` | Visiting hours, ward location, parking (non-medical) |
| `log_question_for_doctor` | Writes the question to Supabase → shows on the doctor's review screen + ❓ badge |
| `book_callback_slot` | Books a callback slot in the doctor's phone hour → shows next to the question |

## 4. Seed data

- **Hospital:** fictional "Hospital São Rafael, Lisboa", Internal Medicine, **Ward 4B**, 22 beds. Physician: **Dr. Inês Silva**.
- **Main demo patient: Maria Ferreira, 78**, bed 12, admitted 3 days ago.
  - Community-acquired pneumonia, improving on IV antibiotics.
  - 3 approved past days (admission → fever down → eating again) + **today's note as a draft**.
  - Today's note: CRP falling, afebrile, awake and eating; plan: chest CT tomorrow, switch to oral antibiotics; **expected discharge Friday if the CT is clear**.
  - Base withheld item: elevated HbA1c, new diabetes suspected. Reason: "The patient should hear a new diagnosis from her doctor first."
  - Nursing instructions (⚫): blood draw 07:00, IV fluids, blood-sugar checks.
  - Family: daughter **Ana Ferreira** (the caller in the demo, works in Lisbon), son **Pedro** (lives in Berlin, a multilingual pitch point).
- **Judge trick line:** "CT thorax: 3 cm mass right upper lobe, suspicious for malignancy. Discuss with oncology." → must be withheld. Cache a fallback.
- **Other patients** (one note each, for variety):
  - **João Almeida, 82**: decompensated heart failure, **no discharge date yet** (shows "Not estimated yet").
  - **Rosa Costa, 69**: after hip fracture surgery, discharge to rehab Wednesday. Status ✅ approved.
- The remaining ~19 beds are grayed out ("approved"), no data.
