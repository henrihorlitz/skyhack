# Demo & Pitch

> Source of truth for times: the official agenda (08:00 breakfast · 08:30 hacking + team formation · 10:00 break · 12:30 lunch · **17:15 code freeze & submission** · 17:30–18:30 technical reviewers · 18:45 finalists pitch · 20:00 awards).

## Timeline for the day

**Workflow:** plan everything first → Claude builds while Henri makes the design system and logo → Claude tests headless → Henri tests → apply the design system → 3h pitch → 1h practice.

| Time | Claude | Henri |
|---|---|---|
| 09:50–10:45 | Planning together: UX, user flows, feature list, seed data outline → `docs/plan.md` | same |
| 10:45–13:00 | **Build** the full demo path (doctor view, family timeline, voice agent, approve → live update), default shadcn style with theme tokens | **Design system + logo**: colors, font, radius, logo SVG. Deliver as tokens so the swap is easy. 12:30 lunch |
| 13:00–13:30 | **Self-test headless** (gstack `browse`/`qa`): click the whole demo path, fix bugs | lunch / finish design |
| 13:30–14:00 | Fix bugs from Henri's test | **Test** on laptop + phone, write a bug list |
| 14:00–14:45 | **Apply the design system** + logo, final fixes, deploy | review the look |
| **14:45** | **Feature freeze** | |
| 14:45–17:45 | Only fixes, polish, fallbacks (record real AI answers), README, 60s backup video | **Pitch (3h):** script, slides, numbers, Q&A answers |
| **17:00** | **Submit** (live URL, repo, description). Hard deadline 17:15 | |
| 17:15 | **Code freeze.** Don't touch code anymore | |
| 17:30–18:30 | Technical reviewers at our table: every visit = a live demo rehearsal | |
| 17:45–18:45 | | **Practice (1h):** full pitch + demo, 3–5 runs, timed |
| 18:45 | Finalists pitch to the final jury | |
| 20:00 | Awards | |

## One sentence

For **families of hospitalized patients in Portugal**, who **can only reach a doctor between 12:00 and 13:00 (and nurses aren't allowed to share medical details)**, **MindPeace** **turns the doctor's daily note into a doctor-approved, plain-language update and a voice agent that answers family questions around the clock, using only approved information.**

## Impact numbers (real, from a Lisbon ward, per our nurse; representative of Portuguese hospitals)

- 22 beds → ~22 families trying to reach the medical team
- ~3 doctors covering them
- 1 phone hour (12:00–13:00) → ~7 families per doctor in 60 minutes, on top of clinical work
- Relatives who can't get through call again, sometimes up to ~10 times
- Pitch line: *"On my girlfriend's ward in Lisbon: 22 families, 3 doctors, one phone hour."*
- Show it as a recurring operational problem, not a per-family statistic.

## 90-second demo script

1. **Hook (15s):** A concrete person. "Meet [name], [situation]. Today, [what goes wrong]."
2. **Demo (60s):** [step A] → [step B] → **aha moment [C]**. Offer a judge to type something in.
3. **Why now / what's next (15s):** [agents + voice make this possible now], [next step].

Rule of thumb: ~30% problem, ~70% solution.

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
