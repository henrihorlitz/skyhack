@AGENTS.md

# SKYHACK 2026 — hackathon project

One-day hackathon, Lisbon, Sep 26 2026. Judges score the live demo, not the code. English UI and pitch.
Tracks: **Healthcare** and **AI Agents**. Partners on the website: Cursor, Supabase, BuildUp Labs, Lisbon AI Week
(ElevenLabs is not listed on the site; check at kickoff whether there is a voice prize).

**Schedule (latest agenda):** 08:00 breakfast · 08:30 hacking starts + team formation · 10:00 break · 12:30 lunch · **17:15 code freeze & submission** · 17:30–18:30 technical reviewers at the tables · 18:45 finalists present to the final jury · 20:00 awards.
Have the submission ready **before 17:00**: live Vercel URL, repo link, a short description, and the demo must run without us touching code.
Team max. 3 people.

## Judging criteria (optimize for these, details in `docs/judging-criteria.md`)

1. **Pitch:** how clearly you communicate the idea and vision.
2. **Technical Execution:** how well it works and is built.
3. **Impact:** the potential to solve a real problem.
4. **Innovation:** how original and creative the approach is.
5. **User Experience:** how intuitive, useful and delightful it is.

Domain facts from a nurse (note structure, what nurses may say, call volume): `docs/research/nurse-input.md`.

## The idea: MindPeace (working title)

- **One sentence:** For families of hospitalized patients in Portugal, who can only reach a doctor between 12:00 and 13:00 (and nurses aren't allowed to share details), MindPeace turns the doctor's daily chart note into a doctor-approved, plain-language update and a voice agent that answers family questions 24/7, using only approved information.
- **Track:** both. Healthcare (caregivers get information, doctors save time) + AI Agents (the voice agent uses tools).
- **Origin story:** Henri's girlfriend is a nurse in Lisbon. Families call all day, nurses can't answer, doctors have no time.
- **Demo path:**
  1. **Doctor view:** raw jargon chart note → AI briefing split into ✅ shareable / 🔒 withheld (with reason, e.g. suspected malignancy pending biopsy) / ✏️ doctor should phrase it → **one-click approve**. Aha #1: the AI knows what *not* to say.
  2. **Family app (mobile):** a notification with the plain-language status ("Stable · CT tomorrow · expected discharge Friday") and a treatment timeline.
  3. **Live voice call:** family asks "When can I visit?" → it answers. Then asks "Does she have cancer?" → the agent declines, logs the question for the doctor and books a callback slot.
  4. **Back to the doctor view:** the question shows up in the doctor's queue. **Aha #2: the loop closes, so the doctor gets one list instead of 15 phone calls.**
- **Filter rules (from the real nurse vs. doctor boundary, see `docs/research/nurse-input.md`):**
  - 🟢 **Nursing scope, auto-shareable:** stable, awake and responsive, vitals stable, ate well, obvious changes in condition.
  - 🟡 **Medical scope, needs doctor approval:** diagnoses, exam and imaging findings, lab results and their interpretation, the plan.
  - ⚫ **Internal, never shared:** instructions to the nursing team (draw blood, IV fluids, meds).
  - Pitch line: *"We didn't invent the rules. We encoded the rules nurses already follow."*
- **Seed chart notes** follow the real structure: Problems (active/resolved) → Findings (labs, exams) → Plan for tomorrow (incl. nursing instructions).
  The family view mirrors it in three sections: *Why she's here* / *How today went* / *What's next*.
- **Impact numbers (real, from the nurse's Lisbon ward, representative of Portugal):** 22 beds, ~3 doctors, 1 phone hour (12:00–13:00). Details in `DEMO.md`.
- **Agent tools:** `get_approved_update`, `log_question_for_doctor`, `book_callback_slot`. Answers only from approved content, multilingual (PT/EN/DE).
- **Real:** the note → filtered briefing (Claude), the approval flow, the family status view, the voice agent with tools.
- **Faked:** EHR integration (seeded chart notes for 2–3 synthetic patients), login/relative verification, push notifications, the callback calendar.
- **Business (pitch only):** the hospital pays (saves doctor time, fewer calls, better satisfaction for private hospitals like CUF, Luz and Lusíadas), free for families. Pitch integration via FHIR plus patient consent over who gets access.
- **Roadmap line (don't build):** after discharge, the agent calls the patient daily and escalates warning signs.

## Rules for Claude

1. **Demo path first.** Only build what's on the demo path above. Everything else is faked or cut.
2. **Keep it simple.** No new libraries without asking Henri first. Reuse what's in the stack.
3. **Fake with the helpers:** `fakeAction()` from `src/lib/fake.ts` for buttons that pretend to do something; seed data in `src/data/seed.ts`.
4. **AI calls always go through** `askClaude()` (`src/lib/ai.ts`) or `/api/agent`, never call the SDK directly in new places. They fall back to cached answers in `src/data/fallbacks.ts` so the demo can't crash.
5. **Realistic synthetic data**: real-sounding Portuguese names, plausible values. Never "Test 123" or lorem ipsum. Never real patient data.
6. **Verify before saying done:** run `bun run build` and check the page in the browser.
7. **Commit + push after every working step** (Vercel auto-deploys from `main`).
8. Henri is a beginner dev: explain choices in one plain sentence, ask when there's a trade-off.
9. **After ~15:30: feature freeze.** Only polish, copy, demo data, fallbacks, and bug fixes. Code freeze is 17:15.

## Stack (already set up — don't re-install)

- Next.js 16 (App Router, TypeScript, `src/`), Tailwind v4, shadcn/ui (`src/components/ui/`)
- `bun` as package manager (`bun add`, `bun run dev`)
- Claude via `@anthropic-ai/sdk`: `src/lib/ai.ts` (single call), `src/app/api/agent/route.ts` (tool-using agent, tools in `src/lib/agent-tools.ts`)
- ElevenLabs TTS: `src/app/api/tts/route.ts` + `<SpeakButton text=… />`
- Supabase: `getSupabase()` in `src/lib/supabase.ts` (no auth; fixed `DEMO_USER`). Use the Supabase MCP/connector to create tables, but **only ever on project `qwuswyylymbwzdrqhjpk` ("Skyhack", London)**. The connector can see Henri's other projects too: never touch those.
- Health check: `/status` page

## Key files

| Path | What |
|---|---|
| `src/app/page.tsx` | Start page (currently a smoke-test playground — replace with the product) |
| `src/data/seed.ts` | Demo user + synthetic data |
| `src/data/fallbacks.ts` | Cached AI answers for when the API fails |
| `DEMO.md` | Demo script + pitch notes |

## Deploy & env

- **Live URL (public):** https://mindpeace-health.vercel.app (health check: `/status`). Vercel project `henri-horlitz/skyhack`.
- Secrets live only in `.env.local` (gitignored) and in Vercel project env vars. Never hardcode keys.
- Deploy: push to `main` → Vercel builds. Manual: `bunx vercel --prod --token "$VERCEL_TOKEN"`.
- Repo is **private**. On Vercel Hobby, commits by other people to a private repo don't deploy. If a teammate joins: either only Henri pushes, or make the repo public.
