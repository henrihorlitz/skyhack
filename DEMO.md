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

## 5-minute pitch (including live demo), draft

| Time | Part | Content |
|---|---|---|
| 0:00–0:45 | **Hook + problem** | Girlfriend is a nurse in Lisbon. "On her ward: 22 families, 3 doctors, one phone hour." Nurses aren't allowed to say more than "stable". |
| 0:45–3:15 | **Live demo** | Doctor approves the filtered note (aha #1: the AI knows what not to say) → family timeline updates live → voice call, the agent declines "Does she have cancer?" and logs it → question appears in the doctor's queue (aha #2) |
| 3:15–4:00 | **Why it works** | "We encoded the rules nurses already follow." Doctor stays in control, nothing leaves without approval. |
| 4:00–4:40 | **Business + vision** | The hospital pays, free for families. FHIR integration, after-discharge follow-up calls. |
| 4:40–5:00 | **Close** | One memorable line + the name. |

The demo gets about half the time. Rehearse with a timer, and cut words, not demo steps.

## Honest answers ready

- **What's mocked?** [e.g. "Booking system and patient records are simulated with synthetic data. The agent's reasoning and tool calls are real."]
- **What breaks first?** [...]
- **Data privacy (healthcare!)?** Synthetic data only; in production: [EU hosting, consent, no training on patient data].

## Pre-demo checklist

- [ ] `/status` all green on the live URL
- [ ] Warm up the AI once right before going on stage
- [ ] Browser zoom 125–150%, all other tabs closed, notifications off (Focus mode)
- [ ] Phone hotspot ready as WiFi backup
- [ ] Backup video on desktop
- [ ] Laptop charged
