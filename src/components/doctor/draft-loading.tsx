"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const STEPS = [
  "Reading today's chart note…",
  "Translating into plain language…",
  "Applying the nursing-scope rules…",
  "Holding back what only you should say…",
];

// Shown while the AI drafts: tells the story of what the filter is doing.
export function DraftLoading() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center">
      <Sparkles className="size-6 animate-pulse text-primary" />
      <ul className="flex flex-col gap-2 text-[15px]">
        {STEPS.map((s, i) => (
          <li key={s} className={i < step ? "text-muted-foreground line-through decoration-muted-foreground/40" : i === step ? "font-semibold text-primary-deep" : "text-muted-foreground/50"}>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
