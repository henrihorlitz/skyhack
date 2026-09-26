# 0001: Hackathon stack and demo-safety choices

- **Date:** 2026-09-25 (set up the evening before SKYHACK)
- **Status:** accepted

## Context

A 10-hour hackathon judged on a live demo (pitch, technical execution, impact, innovation, UX), built by one person with Claude Code. The main risks are losing time to setup and the demo failing on stage (venue WiFi, API outages, slow responses).

## Decisions

1. **Next.js + Vercel + Supabase + shadcn/ui.** One codebase for UI and server, a public URL in seconds, and a stack Claude Code knows very well. Set up and deployed the night before, so no time is lost on the day.
2. **Every AI call has a cached fallback.** A demo that crashes is worse than one that's partly simulated. Routes return `source: "fallback"`, so we can always say honestly what was live.
3. **Agent via the Anthropic SDK Tool Runner, not a framework.** The loop is ~30 lines, has no extra dependency, and returns the list of tool calls for the UI to show.
4. **No login; a fixed demo user.** Auth takes hours and nobody sees it in a 3-minute demo. Relative verification is named as a production step in the pitch.
5. **ElevenLabs via its REST endpoint, not the SDK.** One `fetch` call, one fewer dependency. The browser's built-in voice is the fallback.
6. **Synthetic data only.** Healthcare context: no real patient data, even for testing.
7. **Model configurable by env var.** Opus for quality, Sonnet for stage speed. Switching needs no code change.
8. **Private repo, secrets only in `.env.local` and Vercel env.** The Vercel GitHub app has access to this one repo only; the Anthropic key lives in its own workspace with a spend limit.

## Consequences

- Anything outside the demo path is faked (`fakeAction()`, seed data). We say so openly when asked.
- The Supabase database is optional at runtime: the app still runs on seed data if it's empty or down.
