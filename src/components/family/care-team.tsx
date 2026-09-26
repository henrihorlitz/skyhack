"use client";

import { useState } from "react";
import { Clock, HeartPulse, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_USER } from "@/data/seed";
import type { Patient } from "@/lib/types";

// "Who's looking after Maria": a face and a few facts that give the family confidence.
export function CareTeam({ patient, onAsk }: { patient: Patient; onAsk: () => void }) {
  const her = patient.pronoun === "she" ? "her" : "him";
  const facts = [
    { icon: ShieldCheck, text: `Every update is read and approved by ${DEMO_USER.shortName} before you see it.` },
    { icon: HeartPulse, text: `Nurses check on ${patient.firstName} around the clock and tell ${DEMO_USER.shortName} about any change.` },
    { icon: MessageCircle, text: `Your questions go straight to ${DEMO_USER.shortName}, with a personal callback in the daily phone hour (12:00–13:00).` },
    { icon: Clock, text: `Visiting every day 15:00–20:00. Come and see ${her} whenever you can.` },
  ];

  return (
    <section className="rounded-card bg-card p-6 shadow-card">
      <h2 className="mb-4 text-sm font-semibold text-section">Who&apos;s looking after {patient.firstName}</h2>
      <div className="flex items-center gap-4">
        <Portrait />
        <div className="min-w-0">
          <p className="text-[20px] leading-tight font-semibold">{DEMO_USER.name}</p>
          <p className="text-sm font-medium text-subtitle">{DEMO_USER.title}</p>
          <p className="mt-1 text-[13px] font-medium text-muted-foreground">
            {DEMO_USER.experience} · {DEMO_USER.languages}
          </p>
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-2">
        {facts.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 rounded-row bg-row p-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-deep">
              <Icon className="size-3.5" />
            </span>
            <span className="text-sm font-medium leading-snug">{text}</span>
          </li>
        ))}
      </ul>

      <Button variant="outline" size="lg" className="mt-4 w-full" onClick={onAsk}>
        <MessageCircle /> Ask {DEMO_USER.shortName} a question
      </Button>
    </section>
  );
}

// Portrait on a soft teal circle, head slightly above it (like the reference). Initials until a photo exists.
function Portrait() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative mt-3 size-28 shrink-0">
      <span className="absolute inset-0 rounded-full bg-primary-soft" />
      <span className="absolute -right-1 bottom-2 size-9 rounded-full bg-primary/15" />
      <div className="absolute inset-x-0 -top-5 bottom-0 overflow-hidden rounded-b-full">
        {failed ? (
          <span className="grid size-full place-items-center pt-5 text-2xl font-semibold text-primary-deep">
            {DEMO_USER.avatar}
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- plain img so a missing file falls back cleanly
          <img
            src={DEMO_USER.photo}
            alt={DEMO_USER.name}
            onError={() => setFailed(true)}
            className="absolute bottom-0 left-1/2 w-[112%] max-w-none -translate-x-1/2"
          />
        )}
      </div>
    </div>
  );
}
