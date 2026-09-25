@AGENTS.md

# SKYHACK 2026 — hackathon project

One-day hackathon, Lisbon, Sep 26 2026. **Code freeze 19:00, demos 20:00.**
Tracks: **Healthcare** and **AI Agents**. Sponsors: ElevenLabs (voice), Cursor.
Judges score the live demo, not the code. English UI and pitch.

## The idea (fill in at kickoff)

- **One sentence:** For [who], who [problem], [product] [does what].
- **Track:** Healthcare / AI Agents / both
- **Demo path:** User [does A] → sees [B] → aha moment: [C]
- **Real:** [the core feature]
- **Faked:** login, payments, emails, external systems, anything not on the demo path

## Rules for Claude

1. **Demo path first.** Only build what's on the demo path above. Everything else is faked or cut.
2. **Keep it simple.** No new libraries without asking Henri first. Reuse what's in the stack.
3. **Fake with the helpers:** `fakeAction()` from `src/lib/fake.ts` for buttons that pretend to do something; seed data in `src/data/seed.ts`.
4. **AI calls always go through** `askClaude()` (`src/lib/ai.ts`) or `/api/agent`, never call the SDK directly in new places. They fall back to cached answers in `src/data/fallbacks.ts` so the demo can't crash.
5. **Realistic synthetic data**: real-sounding Portuguese names, plausible values. Never "Test 123" or lorem ipsum. Never real patient data.
6. **Verify before saying done:** run `bun run build` and check the page in the browser.
7. **Commit + push after every working step** (Vercel auto-deploys from `main`).
8. Henri is a beginner dev: explain choices in one plain sentence, ask when there's a trade-off.
9. **After ~17:15: feature freeze.** Only polish, copy, demo data, fallbacks, and bug fixes.

## Stack (already set up — don't re-install)

- Next.js 16 (App Router, TypeScript, `src/`), Tailwind v4, shadcn/ui (`src/components/ui/`)
- `bun` as package manager (`bun add`, `bun run dev`)
- Claude via `@anthropic-ai/sdk`: `src/lib/ai.ts` (single call), `src/app/api/agent/route.ts` (tool-using agent, tools in `src/lib/agent-tools.ts`)
- ElevenLabs TTS: `src/app/api/tts/route.ts` + `<SpeakButton text=… />`
- Supabase: `getSupabase()` in `src/lib/supabase.ts` (no auth; fixed `DEMO_USER`). Supabase MCP is connected for this project only — use it to create tables.
- Health check: `/status` page

## Key files

| Path | What |
|---|---|
| `src/app/page.tsx` | Start page (currently a smoke-test playground — replace with the product) |
| `src/data/seed.ts` | Demo user + synthetic data |
| `src/data/fallbacks.ts` | Cached AI answers for when the API fails |
| `DEMO.md` | Demo script + pitch notes |

## Deploy & env

- Secrets live only in `.env.local` (gitignored) and in Vercel project env vars. Never hardcode keys.
- Deploy: push to `main` → Vercel builds. Manual: `bunx vercel --prod --token "$VERCEL_TOKEN"`.
- Repo is **private**. On Vercel Hobby, commits by other people to a private repo don't deploy. If a teammate joins: either only Henri pushes, or make the repo public.
