"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Phone } from "lucide-react";
import { Logo } from "@/components/brand";
import { Timeline } from "@/components/family/timeline";
import { VoiceAgent } from "@/components/family/voice-agent";
import { relativeDay, timeLabel, useDemoState } from "@/lib/client";
import { DEMO_USER, HOSPITAL } from "@/data/seed";
import type { Patient } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  stable: "bg-nursing-soft text-nursing",
  improving: "bg-nursing-soft text-nursing",
  attention: "bg-medical-soft text-medical",
};

export function FamilyApp({ patient }: { patient: Patient }) {
  const state = useDemoState(patient.id);
  const [calling, setCalling] = useState(false);
  const [freshDay, setFreshDay] = useState<string>();
  const seen = useRef<string | null>(null);

  const approvals = state?.approvals ?? [];
  const latest = approvals.at(-1);

  // A new approval arriving while the app is open: announce it like a push notification.
  useEffect(() => {
    if (!latest) return;
    const key = latest.approvedAt;
    if (seen.current && seen.current !== key) {
      toast.success(`New update about ${patient.firstName}`, { description: `Approved by ${DEMO_USER.name}` });
      setFreshDay(latest.day);
    }
    seen.current = key;
  }, [latest, patient.firstName]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col bg-muted/30">
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <Logo className="text-sm" />
        <span className="text-xs text-muted-foreground">{HOSPITAL.ward}</span>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-5 pb-28">
        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <p className="text-xs text-muted-foreground">
            {HOSPITAL.name} · Bed {patient.bed}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {patient.firstName}
            <span className="font-normal text-muted-foreground">, {patient.age}</span>
          </h1>
          {latest ? (
            <div className="mt-3 flex flex-col gap-1">
              <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium", STATUS_STYLE[latest.update.status])}>
                <span className="size-2 rounded-full bg-current" />
                {latest.update.statusLabel}
              </span>
              <p className="text-xs text-muted-foreground">
                Updated {relativeDay(latest.day)} {timeLabel(latest.approvedAt)} · approved by {latest.approvedBy}
              </p>
            </div>
          ) : (
            <div className="mt-3 h-12 animate-pulse rounded-lg bg-muted" />
          )}
        </section>

        {latest && (
          <section>
            <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Why {patient.pronoun}&apos;s here
            </h2>
            <p className="leading-relaxed">{latest.update.whyHere}</p>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {patient.firstName}&apos;s journey
          </h2>
          <Timeline approvals={approvals} doctor={DEMO_USER.shortName} freshDay={freshDay} />
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-md bg-gradient-to-t from-background via-background/95 to-transparent px-5 pt-6 pb-5">
        <button
          onClick={() => setCalling(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground shadow-lg active:scale-[0.99]"
        >
          <Phone className="size-5" /> Ask about {patient.firstName}
        </button>
      </div>

      {calling && <VoiceAgent patient={patient} onClose={() => setCalling(false)} />}
    </div>
  );
}
