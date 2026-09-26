# Speaker notes (pitch v2 + live demo)

5:00 total. Bold = say it like this. Arrows = do it.

## Before going on stage

- Start page → **Reset demo**
- Left window: `/doctor` (ward overview)
- Right window: `/family/maria`, narrow, **lock screen showing**
- Mic allowed in Chrome, headset plugged in
- Slides on slide 1, clicker in hand

---

## Pitch

### 1 · Title (0:00–0:05)
- **"Hi, I'm Henri. This is MindPeace."**

### 2 · The family (0:05–0:35)
- **"Maria, 78, was admitted on Wednesday."**
- Pedro: Berlin, can't visit
- Ana: works, the phone hour is 12 to 1, the middle of her day
- **"When they call, nobody picks up. The doctors are with patients."**
- **"So they call again. And again."**
- ~3,300 new families every day in Portugal

### 3 · The hospital (0:35–1:00)
- **"My girlfriend is a nurse on a ward like this in Lisbon."**
- 22 beds, 3 doctors, 1 phone hour
- **"She's legally allowed to say one thing: *she's stable*."**
- Doctors lose clinical time on the phone
- Families left in the dark → complaints, even lawsuits (seen on her ward)
- **"Nobody is doing anything wrong. There's just no channel."**

### 4 · The solution (1:00–1:15)
- The doctor's note → MindPeace AI drafts the family update → doctor approves in one click → the family
- **"Read it, or just ask it."**
- António, 81: taps one button and talks

### 5 · Live demo (1:15–3:25)
- **"One morning, four screens."** → switch to the browser
- → follow **Demo** below

### 6 · The rules (3:25–3:45)
- **"The agent follows the rules hospitals already follow."**
- Safe to share = what a nurse may already say
- Needs approval = the doctor's call
- Withheld = with a reason, like Maria's diagnosis
- **"Nothing reaches a family without the doctor's approval."**

### 7 · Impact (3:45–4:05)
- Families: an answer in 5 seconds, any hour
- Doctors: one question list instead of a morning of calls
- Nurses: **"No more *I'm not allowed to tell you*."**

### 8 · Business (4:05–4:40)
- **"Free for families. Hospitals pay."**
- Staff get the phone hour back
- Informed families don't escalate
- **"For private hospitals like CUF or Luz: the hospital that keeps you informed is a reason to choose them."**
- Per-bed licence, private hospitals first, then the SNS

### 9 · Close (4:40–5:00)
- **"One click for the doctor. Peace of mind for the family."**
- **"That's MindPeace. Thank you."**

---

## Demo (2:10)

### ① Doctor (~45 s) · left window
- → click **Maria Ferreira**
- Loading steps run (~4 s): **"It reads the note, translates it, applies the rules."**
- Left: **"The real note. Written for doctors, not families."**
- Right, point at the chips:
  - green **Safe to share**: what a nurse could say
  - outlined **Needs approval**: results, plan, discharge date
- → scroll to the coral box **Not shared with the family**
  - **"A new diabetes diagnosis. Maria hasn't heard it yet, so it stays with the doctor."**
  - grey: nursing instructions, never shared
- Optional: → switch one item off: **"The doctor stays in control."**
- → **Approve update**

### ② Family (~20 s) · right window
- Wait ~2 s → push appears on the lock screen
- **"Ana is at work. Her phone buzzes."**
- → tap the notification
- **"Maria is improving today"**: point at the headline
- Day chips: **"The dashed day is her expected discharge. Always an estimate, never invented."**
- Timeline: today's new entry

### ③ Call (~50 s) · right window
- **"And for António, who doesn't read apps:"**
- → tap the **green phone**
- Ask: **"When can I visit?"** → wait for the answer
- Ask: **"Can it get more serious?"**
  - It declines kindly, passes the question on, books a callback
  - Point at the chips: *Question sent · Callback booked*
- → hang up (coral button)

### ④ Doctor again (~15 s) · left window
- The question is on Maria's page with the callback time
- **"One list instead of a morning of phone calls."**
- → back to the slides (slide 6)

### If something breaks
- Call won't connect → close it → **chat** button → type the same two questions
- Push doesn't show after ~5 s → swipe up to open, the new day is there anyway
- Anything stuck → start page → **Reset demo** → skip ahead, talk over it

---

## Q&A cheat lines

- **Mocked?** Hospital records, login, calendar. The AI, approval, live update and call are real.
- **What if the AI leaks something?** It only drafts. The doctor approves every item and sees what was held back and why.
- **Invented dates?** Never. Only if the note has one, labelled as an estimate.
- **Privacy?** Synthetic data today. In production: pseudonymised or a local model, EU hosting, patient consent.
- **Consent?** The patient decides who gets access, or their legal representative.
- **"~3 minutes per patient"?** Our estimate for reviewing a draft. Not measured yet, say so.
- **Other languages?** Next step. Today it's English.
