# Pitch deck: structure and content

Final pitch: **5 minutes total, including the live demo** (see `DEMO.md`). 9 main slides + 3 backup slides for Q&A.
Story arc: family pain → hospital reality → one insight ("there's no channel") → solution → live proof → why it's safe → impact → business → close.

**Status:** structure approved. Still open: closing line, deck format.

| # | Slide | Time | Judging criteria |
|---|---|---|---|
| 1 | Title | 0:00–0:05 | Pitch |
| 2 | The family | 0:05–0:35 | Pitch, Impact |
| 3 | The hospital | 0:35–0:55 | Impact |
| 4 | The solution | 0:55–1:05 | Pitch, Innovation |
| 5 | Live demo | 1:05–3:15 | Technical Execution, UX |
| 6 | How it knows what not to say | 3:15–3:40 | Innovation |
| 7 | Impact | 3:40–4:05 | Impact |
| 8 | Business and vision | 4:05–4:40 | Pitch, Impact |
| 9 | Close | 4:40–5:00 | Pitch |

## 1 · Title
- **MindPeace** logo + app icon
- *"Peace of mind for families of hospitalized patients."*
- Small: SKYHACK 2026 · Healthcare + AI Agents

## 2 · The family
Third person on purpose: nobody wants to imagine their own mother. The jury meets Maria and Ana here and hears Ana's voice call in the demo.
- ***"Maria, 78, was admitted to hospital in Lisbon on Monday."***
- ✈️ **Pedro lives in Berlin.** Visiting isn't an option.
- 🕛 **Ana works in Lisbon.** Doctors take calls 12:00–13:00, in the middle of her workday.
- 📵 **When they call, nobody picks up.** The doctors are with patients.
- ***"So they call again. And again."***
- *This happens every day, at every hospital bed in Portugal.¹*
- Footnote: *¹ ~1.2 million hospital admissions in Portugal in 2024 (INE, Estatísticas da Saúde).*
- 🎤 *"My girlfriend is a nurse in Lisbon. She takes these calls every day, and she's not allowed to answer them."*
- 🎤 Optional: *"Today alone, around 3,300 families in Portugal are starting this."* (1.2M / 365)

## 3 · The hospital
- **22 families · 3 doctors · 1 phone hour**
- *Nurses may only say "she's stable." Everything else must come from the doctor.*
- Consequences: doctors lose clinical time on the phone · families who feel left in the dark file **complaints, even lawsuits**
- ***"Nobody is doing anything wrong. There's just no channel."***
- Small: *One Lisbon ward, representative of Portuguese public hospitals.*
- Lawsuits are anecdotal from the ward: say it that way, no numbers.

## 4 · The solution
- *MindPeace turns the doctor's daily note into a doctor-approved, plain-language update, plus a voice agent that answers families 24/7 using only approved information.*
- **Chart note → AI filter → Doctor approves (1 click) → the family**
- **Read it or ask it:**
  - 📱 **Read:** Ana checks the timeline between meetings
  - 📞 **Ask:** António, 81, Maria's husband, taps one button and just talks. No reading, no typing.

## 5 · Live demo
One slide stays up while switching to the browser; the four beats help judges follow.
1. **Doctor:** jargon note → ✅ shareable / 🔒 withheld / ⚫ internal → Approve
2. **Family:** push notification + a new timeline node appears live
3. **Voice call:** "When can I visit?" gets an answer · "Does she have cancer?" gets a kind decline, the question is logged, a callback is booked
4. **Doctor again:** the question is in the queue. *One list instead of a morning of phone calls.*
- Optional: a judge types a suspicious finding into the note, the AI withholds it.
- 🎤 Before the voice call: *"Many of the people waiting at home are elderly. They don't need to read anything. They tap one button and ask."*

## 6 · How it knows what not to say
- ***"We didn't invent the rules. We encoded the rules nurses already follow."***
- 🟢 **Shared automatically:** stable, awake, vitals, ate well
- 🟡 **Doctor approves first:** diagnoses, results, the plan, the discharge date
- ⚫ **Never shared:** instructions for the nursing team
- *Nothing reaches a family without the doctor's click. The AI never invents a discharge date.*
- 📷 Dr. Inês Silva portrait (`public/brand/doctor.png`) on the teal circle

## 7 · Impact
- 👩 **Families:** an answer in 5 seconds, any hour, in their language, by reading or just by asking
- 🩺 **Doctors:** one question list instead of a morning of calls, fewer complaints
- 👩‍⚕️ **Nurses:** no more "I'm not allowed to tell you"

## 8 · Business and vision
- **The hospital pays, families use it for free.**
- First customers: private hospitals (CUF, Luz, Lusíadas) → then the public SNS
- FHIR integration with patient consent
- Next: after discharge, daily check-in calls that escalate warning signs

## 9 · Close
- Closing line: **open**
  - *"Doctors decide what's said. MindPeace says it, any time of day."*
  - *"22 families shouldn't have to fight over one phone hour."*
- Logo + mindpeace-health.vercel.app + QR code

---

# Backup slides (Q&A only)

## B1 · The questions you're probably asking

| 🏥 Where does the data come from? | 🤝 Who gives consent? | 🔐 What about patient privacy? |
|---|---|---|
| The hospital's **electronic patient record** | **The patient decides.** At admission they get a **QR code or link** to share, or give us contacts and we send the invites | Patient data **never reaches the AI with a name on it** |
| Pulled **once a day**, after the doctor updates the note | The patient can **revoke access** at any time | **A: local model** on the hospital's own servers. Simple task, and small models improve every month |
| **Read-only** through FHIR. We never write to the record | **Patient can't consent** (unconscious, dementia)? Their **legal representative** decides, the same rule the hospital already uses | **B: pseudonymisation.** Identifying details are removed before the AI sees the note and put back afterwards |

*Today's demo uses synthetic data only.*

## B2 · Under the hood
- Claude filters the note and runs the agent with real tool calls (`get_approved_update`, `log_question_for_doctor`, `book_callback_slot`)
- ElevenLabs real-time voice (PT / EN / DE) · Supabase live sync · Next.js on Vercel
- Cached fallbacks, so the demo can't crash
- **Real:** AI filter, approval, family app, voice agent · **Simulated:** hospital records, login, calendar

## B3 · What breaks first
- Voice in a noisy hall → text input as a fallback
- No discharge date in the note → "Not estimated yet. Dr. Silva will update you."

## Sources
- INE, Estatísticas da Saúde 2024 (published April 2026): ~1.2M hospital admissions in 2024. Reported by [DN](https://www.dn.pt/sociedade/hospitais-superaram-atividade-pr-pandemia-em-2024-24-milhes-de-consultas1-2-milhes-de-internamentos-e-13-milhes-de-cirurgias) and [Observador](https://observador.pt/2026/04/06/internamentos-superaram-em-2024-niveis-de-2019-e-consultas-bateram-recorde/).
- Ward numbers and nurse/doctor boundary: `docs/research/nurse-input.md`.
