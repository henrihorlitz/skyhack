# MindPeace

> Built in 10 hours at **SKYHACK 2026**, Lisbon · Tracks: **Healthcare** + **AI Agents**

**Live demo:** [mindpeace-health.vercel.app](https://mindpeace-health.vercel.app) · Health check: [/status](https://mindpeace-health.vercel.app/status)

<!-- TODO before submission (17:00): update status, screenshots, and "what's real" to match the final build. -->

## Problem

On a typical Lisbon hospital ward, **22 families share 3 doctors and one phone hour (12:00–13:00)**. Nurses are with patients all day but aren't allowed to share medical details. So families call again and again, nurses have to say no, and doctors spend their only free hour on the phone.

## Solution

MindPeace turns the doctor's daily chart note into a **doctor-approved, plain-language update** for the family, plus a **voice agent** that answers family questions around the clock, using only approved information.

1. **Doctor view:** the AI splits the jargon note into ✅ shareable, 🔒 withheld (with a reason) and ✏️ "doctor should phrase this". One click approves it.
2. **Family app:** a status the family can read in 5 seconds and a timeline up to the expected discharge.
3. **Voice agent:** answers "When can I visit?". For "Does she have cancer?" it declines kindly, logs the question for the doctor and books a callback.
4. **Back to the doctor:** one question queue instead of 15 phone calls.

*We didn't invent the rules. We encoded the rules nurses already follow:* nursing-scope facts are shareable, medical findings need the doctor's approval, and internal team instructions are never shared.

## How it works

A Next.js app on Vercel. Claude reads the chart note and classifies every statement against the nurse/doctor boundary. The voice agent is Claude with tools (`get_approved_update`, `log_question_for_doctor`, `book_callback_slot`) that can only read doctor-approved content. ElevenLabs gives it a voice, and Supabase stores approvals and questions. Every AI call has a cached fallback, so the demo keeps working even if the WiFi drops.

Full technical setup: [`docs/architecture.md`](docs/architecture.md) · Design decisions: [`docs/decisions/`](docs/decisions/)

| Layer | Tech |
|---|---|
| App | Next.js 16 (App Router, TypeScript), Tailwind v4, shadcn/ui |
| AI | Anthropic Claude via `@anthropic-ai/sdk` (Tool Runner for the agent) |
| Voice | ElevenLabs text-to-speech |
| Data | Supabase Postgres (EU) + synthetic seed data |
| Hosting | Vercel, auto-deploy from GitHub |

## What's real vs. simulated

- **Real:** chart note → filtered briefing (Claude), the approval flow, the family status view, the voice agent and its tool calls.
- **Simulated for the demo:** hospital record system (EHR) integration, login and relative verification, push notifications, the callback calendar.
- **Data:** 100% synthetic. No real patient data was used.

## What production would need

FHIR integration with the hospital record system, patient consent over who gets access, verified relatives, EU hosting with a data processing agreement, and audit logs of every approved statement.

## Run locally

```bash
bun install
cp .env.example .env.local   # fill in keys (see docs/architecture.md)
bun run dev
```
