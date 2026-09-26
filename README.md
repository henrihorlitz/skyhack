# MindPeace

> Built in 10 hours at **SKYHACK 2026**, Lisbon · Tracks: **Healthcare** + **AI Agents**

**Live demo:** [mindpeace-health.vercel.app](https://mindpeace-health.vercel.app) · Health check: [/status](https://mindpeace-health.vercel.app/status)


## Problem

On a typical Lisbon hospital ward, **22 families share 3 doctors and one phone hour (12:00–13:00)**. Nurses are with patients all day but aren't allowed to share medical details. So families call again and again, nurses have to say no, and doctors spend their only free hour on the phone.

## Solution

MindPeace turns the doctor's daily chart note into a **doctor-approved, plain-language update** for the family, and gives families an assistant they can **call or chat with** around the clock, which only uses approved information.

1. **Doctor view:** the AI drafts the family update from the jargon note and tags every statement: **safe to share** (what a nurse may already say), **needs approval** (medical content), **withheld** (e.g. a new diagnosis the patient hasn't heard yet, or a suspicious finding, with a reason) and **care team only** (nursing instructions). The doctor can switch items off or reword them, then approves with one click.
2. **Family phone:** a push notification on the lock screen, then a status the family can read in 5 seconds, day chips, and a timeline up to the expected discharge (always labelled as an estimate, never invented). A care-team section shows who is looking after their mother.
3. **Call or chat:** a real-time voice call (ElevenLabs) or a chat answers "When can I visit?" or "When can she come home?". For "Does she have cancer?" it declines kindly, passes the question to the doctor and books a callback in the phone hour.
4. **Back to the doctor:** one question list with booked callbacks, instead of 15 phone calls.

*We didn't invent the rules. We encoded the rules nurses already follow* (see [`docs/research/nurse-input.md`](docs/research/nurse-input.md)).

## Try it

1. Open [/doctor](https://mindpeace-health.vercel.app/doctor) in one window and [/family/maria](https://mindpeace-health.vercel.app/family/maria) in a narrow second window.
2. In the doctor view, open **Maria Ferreira**, optionally click **New radiology report** (the AI must hold the new finding back), then **Approve update**.
3. Watch the push notification arrive on the family lock screen, tap it, then call or chat about Maria.
4. **Reset demo** on the [start page](https://mindpeace-health.vercel.app) clears today's approvals and questions.

## How it works

A Next.js app on Vercel. Claude (Sonnet 5 via OpenRouter) turns the chart note into a draft, and the server checks that every step of the doctor's plan made it in. The chat is Claude with tools that can only read approved content. The call is an ElevenLabs Conversational AI agent whose tools run inside our app. Supabase shares approvals and questions between the doctor's and the family's screens. Every AI path has a fallback, so the demo keeps working even if the WiFi drops.

Full technical setup: [`docs/architecture.md`](docs/architecture.md) · Design system: [`DESIGN.md`](DESIGN.md) · Decisions: [`docs/decisions/`](docs/decisions/)

| Layer | Tech |
|---|---|
| App | Next.js 16 (App Router, TypeScript), Tailwind v4, shadcn/ui, Poppins |
| AI | Claude Sonnet 5 via OpenRouter (Anthropic SDK, tool runner) |
| Voice | ElevenLabs Conversational AI (real-time call, client tools) |
| Data | Supabase Postgres (EU) + synthetic seed data |
| Hosting | Vercel, auto-deploy from GitHub |

## What's real vs. simulated

- **Real:** chart note → filtered draft (live AI), the approval flow, live updates to the family phone, the chat agent and the voice call with their tool calls, the doctor's question list.
- **Simulated for the demo:** hospital record system (EHR) integration, login and relative verification, real push notifications (drawn in the page), the callback calendar.
- **Data:** 100% synthetic. No real patient data was used.

## What production would need

FHIR integration with the hospital record system, patient consent over who gets access, verified relatives, EU hosting with a data processing agreement, and audit logs of every approved statement.

## Run locally

```bash
bun install
cp .env.example .env.local   # fill in keys (see docs/architecture.md)
bun run dev
```
