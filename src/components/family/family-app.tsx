"use client";

import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/brand";
import { Timeline } from "@/components/family/timeline";
import { ChatAgent } from "@/components/family/chat-agent";
import { CallScreen } from "@/components/family/call-screen";
import { relativeDay, timeLabel } from "@/lib/client";
import { DEMO_USER, HOSPITAL } from "@/data/seed";
import type { Approval, Patient } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  stable: "bg-nursing-soft text-nursing",
  improving: "bg-nursing-soft text-nursing",
  attention: "bg-medical-soft text-medical",
};

type Props = { patient: Patient; approvals: Approval[]; freshDay?: string };

export function FamilyApp({ patient, approvals, freshDay }: Props) {
  const [mode, setMode] = useState<"call" | "chat" | null>(null);
  const latest = approvals.at(-1);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col bg-muted/30">
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <Logo className="text-sm" />
        <span className="text-xs text-muted-foreground">{HOSPITAL.ward}</span>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-5 pb-44">
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

      <div className="fixed right-5 bottom-6 flex flex-col items-end gap-3">
        <Fab label="Chat" onClick={() => setMode("chat")} className="bg-card text-foreground ring-1 ring-border">
          <MessageCircle className="size-6" />
        </Fab>
        <Fab label={`Call about ${patient.firstName}`} onClick={() => setMode("call")} className="bg-nursing text-white">
          <Phone className="size-6" />
        </Fab>
      </div>

      {mode === "chat" && <ChatAgent patient={patient} onClose={() => setMode(null)} />}
      {mode === "call" && <CallScreen patient={patient} onClose={() => setMode(null)} />}
    </div>
  );
}

function Fab({ label, onClick, className, children }: { label: string; onClick: () => void; className?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn("grid size-14 place-items-center rounded-full shadow-lg transition-transform active:scale-95", className)}
    >
      {children}
    </button>
  );
}
