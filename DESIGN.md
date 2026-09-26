---
version: alpha
name: MindPeace
description: A calm, near-white mint interface for family updates and the doctor's approval list.
colors:
  primary: "#38A8A8"
  primary-deep: "#2E9696"
  on-primary: "#FFFFFF"
  primary-soft: "#E7F6F5"
  canvas: "#F4FAF8"
  canvas-deep: "#E7F3F0"
  surface: "#FFFFFF"
  ink: "#3A3A3A"
  muted: "#8D8D8D"
  subtitle: "#5C7572"
  section: "#1F5551"
  coral: "#F88870"
  coral-soft: "#FFF0EC"
  coral-ink: "#D46550"
  coral-track: "#F3E8E4"
  neutral-soft: "#F3F4F4"
  neutral-ink: "#6D6D6D"
  field: "#F6F8F8"
  day: "#F4F7F7"
  row: "#F7FBFB"
typography:
  headline-display:
    fontFamily: Poppins
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Poppins
    fontSize: 40px
    fontWeight: 600
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Poppins
    fontSize: 22px
    fontWeight: 600
  body-md:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.45
  label-md:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: 600
  label-sm:
    fontFamily: Poppins
    fontSize: 13px
    fontWeight: 600
  caption:
    fontFamily: Poppins
    fontSize: 13px
    fontWeight: 500
  button:
    fontFamily: Poppins
    fontSize: 15px
    fontWeight: 600
rounded:
  sm: 14px
  md: 18px
  lg: 20px
  xl: 28px
  full: 999px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 20px
  margin: 48px
components:
  page:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  page-wash:
    backgroundColor: "{colors.canvas-deep}"
  page-title:
    textColor: "{colors.ink}"
    typography: "{typography.headline-display}"
  page-subtitle:
    textColor: "{colors.subtitle}"
    typography: "{typography.body-md}"
  section-label:
    textColor: "{colors.section}"
    typography: "{typography.label-md}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 24px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 14px
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 14px
  status-stable:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-deep}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 8px
  status-withheld:
    backgroundColor: "{colors.coral-soft}"
    textColor: "{colors.coral-ink}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 8px
  status-internal:
    backgroundColor: "{colors.neutral-soft}"
    textColor: "{colors.neutral-ink}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 8px
  search:
    backgroundColor: "{colors.field}"
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    padding: 12px
  day:
    backgroundColor: "{colors.day}"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    width: 42px
    height: 58px
  day-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    width: 42px
    height: 58px
  briefing-row:
    backgroundColor: "{colors.row}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 12px
  mark-shareable:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-deep}"
    rounded: "{rounded.full}"
    size: 28px
  mark-withheld:
    backgroundColor: "{colors.coral-soft}"
    textColor: "{colors.coral-ink}"
    rounded: "{rounded.full}"
    size: 28px
  progress:
    backgroundColor: "{colors.coral}"
    rounded: "{rounded.full}"
    height: 8px
  progress-track:
    backgroundColor: "{colors.coral-track}"
    rounded: "{rounded.full}"
    height: 8px
  avatar:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-deep}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    size: 36px
  caption:
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
---

## Overview

MindPeace should feel calm and plain, like a quiet update a family can trust. The page is almost white, with only a hint of mint. White cards float on that canvas. Teal is the only color for actions and good news. Coral appears only when something must stay with the doctor.

The audience is a tired family member on a phone, and a doctor scanning a list between rounds. Say things in sentence case. One main action per screen. No all-caps labels, no extra bright colors, no medical jargon on the family timeline.

## Colors

The palette comes from a mint productivity kit, then washed back toward white so the product feels clinical and quiet rather than decorative.

- **Canvas (#F4FAF8):** The page background. A white with a slight mint hint. A soft wash toward **canvas-deep (#E7F3F0)** is allowed at the edges, never a saturated green field.
- **Surface (#FFFFFF):** Cards, the secondary button, and anything that holds content.
- **Primary (#38A8A8):** Teal for the one main action, the selected day, and "today" on the timeline.
- **Primary deep (#2E9696):** Text on soft teal chips, and the primary button when pressed.
- **Primary soft (#E7F6F5):** Background for stable status, avatars, and the shareable mark.
- **On primary (#FFFFFF):** Text and icons on teal fills.
- **Coral (#F88870):** Withheld information and the progress fill. Never a second call-to-action.
- **Coral soft (#FFF0EC) and coral ink (#D46550):** The withheld chip and its label.
- **Ink (#3A3A3A):** Headlines and body text.
- **Muted (#8D8D8D):** Captions, search placeholder, unselected days.
- **Neutral soft (#F3F4F4) and neutral ink (#6D6D6D):** Internal notes that stay with the care team.

## Typography

Everything is **Poppins**. Weights in use are 400, 500, and 600. Do not introduce a second family, and do not set UI text in all capitals.

- **Headlines:** Poppins 600. The page title is 56px. A status headline such as "Maria is stable today" is 40px. Names and card titles are 22px.
- **Body:** 16px at weight 400 for sentences the family reads. Supporting lines are 14px at weight 500.
- **Labels:** 14px semibold for section names ("Colors", "Family view"). Status chips are 13px semibold.
- **Buttons:** 15px semibold, sentence case ("Approve update"), not small caps.
- **Captions:** 13px medium, in muted gray. Example: "Updated today · 14:32 · Approved by Dr. Inês Silva".

## Layout

The page is a single column on a phone and a wide board on desktop, capped at 1120px, with 48px of space at the sides. Related blocks sit 20px apart. Inside a card, use 24px of padding.

Spacing follows an 8px step: 8, 12, 16, 24, 40. Group a status, a short timeline, and one button inside the family card. The doctor's briefing uses the same card, with shareable and withheld rows stacked inside it.

## Elevation & Depth

Depth comes from soft shadows, not borders. A card lifts off the mint canvas with a wide, low-contrast shadow (about 18px offset, 40px blur, teal-gray at 16% opacity). Smaller objects such as color swatches and the secondary button use a lighter shadow (8px offset, 24px blur, 10% opacity). The primary button may carry a small teal glow. Do not outline cards with a dark stroke.

## Shapes

Controls are pills. Buttons, status chips, the search field, avatars, and the progress bar use a full radius. Day chips are softer rectangles at 14px. Briefing rows are 18px. Cards are 28px. Do not mix sharp corners into this set.

## Components

- **Primary button:** Teal fill, white sentence-case label, pill shape, 14px vertical padding. One per screen. Hover and pressed use primary deep. Example: "Approve update", "Call the update line".
- **Secondary button:** White fill, teal label, same pill, lighter shadow. Example: "Edit phrasing".
- **Status — stable:** Soft teal chip, deep teal text, a small teal dot. Example: "Stable · updated today".
- **Status — withheld:** Soft coral chip, coral ink text. Example: "Withheld · pending biopsy".
- **Status — internal:** Light gray chip, gray text. Example: "Internal · nursing only".
- **Search:** Pill on a near-gray field, muted placeholder. Example: "Ask about visiting hours".
- **Day chip:** 42 by 58px. Unselected is a pale fill with a muted weekday and ink number. The selected day is teal with white text.
- **Briefing row:** Pale mint-white row, 18px radius. A circular mark sits at the left: teal check for shareable, coral mark for withheld.
- **Progress:** 8px pill. Track is a pale coral. The fill is coral, and it marks something held back, not a success meter.
- **Family card:** White card, page title in headline-md, status chip, then a vertical timeline. Past days are quiet. Today uses the teal dot. End the list with the expected discharge, labeled as an estimate.
- **Avatar:** 36px circle, soft teal fill, deep teal initials.

## Do's and Don'ts

- Do use teal for the one main action on a screen.
- Do keep cards white on the near-white mint canvas.
- Do use pills for buttons, status, and search.
- Do write labels and buttons in sentence case.
- Do save coral for something the family must not hear yet.
- Don't add a third bright color.
- Don't set labels, buttons, or dates in all capitals.
- Don't use sharp corners on buttons or cards.
- Don't put medical jargon on the family timeline.
- Don't invent a discharge date if the note has none.
