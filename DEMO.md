# Demo & Pitch

> Source of truth for times: the official agenda (08:00 breakfast · 08:30 hacking + team formation · 10:00 break · 12:30 lunch · **17:15 code freeze & submission** · 17:30–18:30 technical reviewers · 18:45 finalists pitch · 20:00 awards).

## Timeline for the day

**Workflow:** plan everything first → Claude builds while Henri makes the design system and logo → Claude tests headless → Henri tests → apply the design system → 2.5h pitch → 1h practice.
**Submission is code only** (no slides/video). **Final pitch = 5 minutes including the live demo.**

| Time | Claude | Henri |
|---|---|---|
| 09:50–10:45 | Planning together: UX, user flows, feature list, seed data outline → `docs/plan.md` | same |
| 10:45–13:30 | **Build** the full demo path (doctor view, family timeline, voice agent, approve → live update), default shadcn style with theme tokens | **Design system + logo** → `DESIGN.md` with token variables + logo SVG. 12:30 lunch |
| 13:30–14:00 | **Self-test headless** (gstack `browse`/`qa`): click the whole demo path, fix bugs | finish design |
| 14:00–14:30 | Fix bugs from Henri's test | **Test** on laptop + phone, write a bug list |
| 14:30–15:15 | **Apply the design system** + logo, final fixes, deploy | review the look |
| **15:15** | **Feature freeze** | |
| 15:15–17:45 | Only fixes, polish, fallbacks (record real AI answers), README, optional backup video for us | **Pitch (2.5h):** script, slides, numbers, Q&A answers |
| **17:00** | **Submit the code** (live URL + repo). Hard deadline 17:15 | |
| 17:15 | **Code freeze.** Don't touch code anymore | |
| 17:30–18:30 | Technical reviewers at our table: every visit = a live demo rehearsal | |
| 17:45–18:45 | | **Practice (1h):** full 5-min pitch + demo, 3–5 runs, timed |
| 18:45 | Finalists pitch to the final jury | |
| 20:00 | Awards | |

**The times are upper limits, not appointments.** If a block finishes early, move straight on to the next one.
If the build runs late, we take time from the pitch block (decide at 13:30).

## One sentence

For **families of hospitalized patients in Portugal**, who **can only reach a doctor between 12:00 and 13:00 (and nurses aren't allowed to share medical details)**, **MindPeace** **turns the doctor's daily note into a doctor-approved, plain-language update and a voice agent that answers family questions around the clock, using only approved information.**

## Impact numbers (real, from a Lisbon ward, per our nurse; representative of Portuguese hospitals)

- 22 beds → ~22 families trying to reach the medical team
- ~3 doctors covering them
- 1 phone hour (12:00–13:00) → ~7 families per doctor in 60 minutes, on top of clinical work
- Relatives who can't get through call again, sometimes up to ~10 times
- Pitch line: *"On my girlfriend's ward in Lisbon: 22 families, 3 doctors, one phone hour."*
- Show it as a recurring operational problem, not a per-family statistic.

## 5-minute pitch (including live demo)

**Setup:** two Chrome windows side by side. Left: doctor view (`/doctor`). Right: family phone (`/family/maria`, narrow ~390 px, on the lock screen).

| Time | Part | Say / do |
|---|---|---|
| 0:00–0:40 | **Hook** | "My girlfriend is a nurse on a ward here in Lisbon. 22 families, 3 doctors, and one phone hour: 12 to 1. Legally, she can tell a worried daughter one thing: *she's stable*. So families call again and again, and doctors spend their only free hour on the phone." |
| 0:40–1:00 | **Solution** | "MindPeace turns the doctor's daily note into an update the family can actually read, approved by the doctor in one click, and gives families an assistant they can call any time." |
| 1:00–1:45 | **Demo: doctor** | Open **Maria Ferreira**. Left: the real note, full of jargon. Right: the AI draft. "Green is what a nurse may already say. Everything medical needs the doctor's approval. And look here, in coral: the new diabetes diagnosis is held back, because Maria should hear it from her doctor first. **We didn't invent these rules. We encoded the rules nurses already follow.**" |
| 1:45–2:15 | **Judge moment** | "Would one of you click *New radiology report*?" (a suspicious lung finding is added). While it loads (~20 s), keep talking: "Now the note has something no family should hear from an app." → the finding lands in **Not shared**, with a reason. **Aha #1: the AI knows what not to say.** |
| 2:15–2:45 | **Demo: family** | Click **Approve update**. Point at the phone: the push arrives on the lock screen. Tap it. "Maria is improving today. Here's her week, what's next, and when she's expected home, always as an estimate, never invented." |
| 2:45–3:30 | **Demo: call** | Tap the green call button. Ask: "When can she come home?" → answer. Then: "Does she have cancer?" → it declines kindly, passes the question on, books a callback (chips appear). Hang up. |
| 3:30–3:50 | **Loop closes** | Back to the doctor view: the question is there with the callback time. **Aha #2: one list instead of 15 phone calls.** |
| 3:50–4:20 | **Why it works** | "Live Claude drafts; the server checks every step of the doctor's plan made it in. The call is a real-time voice agent, but its tools run inside our app, so it can only ever see what the doctor approved. And if the WiFi dies, it falls back to prepared answers." |
| 4:20–4:45 | **Business + vision** | "The hospital pays: doctors get their phone hour back, and private hospitals like CUF, Luz and Lusíadas compete on patient experience. Next: record-system integration, verified relatives, more languages (Maria's son lives in Berlin), and follow-up calls after discharge." |
| 4:45–5:00 | **Close** | "Families get peace of mind. Doctors get their hour back. That's MindPeace." |

Rehearse with a timer. If you run long, cut words in "Why it works", never demo steps.

**If something fails on stage**
- Call doesn't connect (mic/network) → close it, tap the **chat** button, type the same questions. The loop still closes.
- Draft is slow → keep talking over the loading steps; after ~25 s the prepared draft appears automatically.
- Anything stuck → start page → **Reset demo** → start again from the ward overview.

## Honest answers ready

- **What's mocked?** The hospital record integration, logins and relative verification, real push delivery and the callback calendar. The AI drafting, the filter, the approval flow, the live update, the chat and the voice call with their tool calls are real.
- **What if the AI leaks something?** Nothing reaches the family without the doctor's approval. The AI only drafts, shows what it held back and why, and the doctor can switch any item off. In production, every approved statement is logged.
- **Can it invent a discharge date?** No. It copies a date only if the note has one, labels it as an estimate, and otherwise shows "Not estimated yet".
- **Privacy / GDPR?** Demo data is 100% synthetic. Production: EU hosting, a data processing agreement, zero-retention AI providers, the patient decides which relatives get access, no training on patient data.
- **Why would doctors use it?** Reviewing takes about a minute and replaces calls they can't take anyway. The rules come from what nurses are already allowed to say.
- **What if the patient doesn't want the family informed?** Access is based on the patient's consent; without it, no updates are sent.
- **Is 22 families / 3 doctors real?** Yes, current numbers from one Lisbon ward, shared by a nurse working there.

## Pre-demo checklist

- [ ] `/status` all green on the live URL
- [ ] Start page → **Reset demo**
- [ ] Doctor window on `/doctor`, **wait 15 s** (drafts prepare in the background). Don't open Maria before the demo.
- [ ] Family window narrow (~390 px), on `/family/maria` (lock screen). Chrome, microphone allowed for the site (do one test call beforehand)
- [ ] One full run-through 10 min before, then **Reset demo** again
- [ ] Browser zoom checked on the projector, other tabs closed, notifications off (Focus mode)
- [ ] Phone hotspot ready as WiFi backup, laptop charged, backup video on the desktop
