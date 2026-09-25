# Demo & Pitch

> Draft this at kickoff (09:30), BEFORE writing product code. Rehearse from 18:00.

## Timeline for the day

| Time | Phase |
|---|---|
| 09:00–10:00 | Kickoff, mixer, **pick idea + write this file** (one sentence, demo path, 90s script) |
| 10:00–11:30 | Rough skeleton: the whole demo path clickable end to end, ugly is fine, **live on Vercel** |
| 11:30–16:30 | Make the core feature real (the aha moment). Everything else = seed data + `fakeAction` |
| **~17:15** | **Feature freeze.** Only polish, copy, demo data, fallbacks |
| 17:15–18:00 | Record real AI answers into `src/data/fallbacks.ts`, polish UI |
| 18:00–19:00 | Rehearse 5×, record 60s backup video (Cmd+Shift+5), README, **submit by 18:30** |
| 19:00 | Code freeze |
| 20:00 | Demos |

## One sentence

For **[who]**, who **[problem]**, **[product]** **[does what]**.

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
