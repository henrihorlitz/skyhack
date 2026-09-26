"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Reading today's chart note",
  "Translating into plain language",
  "Applying the nursing-scope rules",
  "Holding back what only you should say",
];
const STEP_MS = 2200;

// Shown while the AI drafts: tells the story of what the filter is doing.
// The active step fills with teal from left to right over its duration (.fill-sweep in globals.css).
export function DraftLoading({ stepMs = STEP_MS }: { stepMs?: number }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), stepMs);
    return () => clearInterval(id);
  }, [stepMs]);
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 px-2 text-center">
      <Sparkles className="size-6 animate-pulse text-primary" />
      <ul className="flex flex-col items-start gap-2.5 text-[15px] font-medium">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2.5 text-left">
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full",
                i < step ? "bg-primary-soft text-primary-deep" : "bg-day",
              )}
            >
              {i < step && <Check className="size-3" strokeWidth={3} />}
            </span>
            <span
              key={i === step ? "active" : "idle"}
              className={cn(
                i < step && "text-subtitle",
                i === step && "fill-sweep font-semibold",
                i > step && "text-muted-foreground/45",
              )}
              style={i === step ? { animationDuration: `${stepMs}ms` } : undefined}
            >
              {s}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
