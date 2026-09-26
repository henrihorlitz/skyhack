"use client";

import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/brand";
import { DayStrip, Timeline } from "@/components/family/timeline";
import { ChatAgent } from "@/components/family/chat-agent";
import { CareTeam } from "@/components/family/care-team";
import { CallScreen } from "@/components/family/call-screen";
import { isToday, relativeDay, timeLabel } from "@/lib/client";
import { DEMO_USER, HOSPITAL } from "@/data/seed";
import type { Approval, Patient } from "@/lib/types";
import { cn } from "@/lib/utils";

// DESIGN.md: teal is the only color for status. Coral is reserved for withheld information.
const STATUS_STYLE = {
  stable: "bg-primary-soft text-primary-deep",
  improving: "bg-primary-soft text-primary-deep",
  attention: "bg-primary-soft text-primary-deep",
};

type Props = { patient: Patient; approvals: Approval[]; freshDay?: string };

export function FamilyApp({ patient, approvals, freshDay }: Props) {
  const [mode, setMode] = useState<"call" | "chat" | null>(null);
  const latest = approvals.at(-1);

  const statusLine = latest
    ? `${patient.firstName} is ${latest.update.statusLabel.toLowerCase()}${isToday(latest) ? " today" : ""}`
    : "";

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <Logo className="text-[15px]" />
        <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-[13px] font-semibold text-primary-deep">
          {patient.family[0].name.split(" ").map((n) => n[0]).join("")}
        </span>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-5 pt-3 pb-40">
        <section>
          <p className="font-medium text-subtitle">
            Hi {patient.family[0].name.split(" ")[0]}, here&apos;s {patient.firstName}&apos;s update
          </p>
          {latest ? (
            <>
              <h1 className="mt-1 text-[34px] leading-[1.1] font-semibold tracking-[-0.03em]">{statusLine}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold", STATUS_STYLE[latest.update.status])}>
                  <span className="size-1.5 rounded-full bg-current" />
                  Updated {relativeDay(latest.day)}
                </span>
              </div>
              <p className="mt-2 text-[13px] font-medium text-muted-foreground">
                {timeLabel(latest.approvedAt)} · Approved by {latest.approvedBy} · {HOSPITAL.ward}, bed {patient.bed}
              </p>
            </>
          ) : (
            <div className="mt-2 h-24 animate-pulse rounded-[20px] bg-card" />
          )}
        </section>

        <DayStrip admitted={patient.admitted} approvals={approvals} />

        {latest && (
          <section className="rounded-card bg-card p-6 shadow-card">
            <h2 className="mb-1.5 text-sm font-semibold text-section">Why {patient.pronoun}&apos;s here</h2>
            <p className="leading-relaxed">{latest.update.whyHere}</p>
          </section>
        )}

        <section className="rounded-card bg-card p-6 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-section">{patient.firstName}&apos;s journey</h2>
          <Timeline approvals={approvals} doctor={DEMO_USER.shortName} freshDay={freshDay} />
        </section>

        <CareTeam patient={patient} onAsk={() => setMode("chat")} />
      </main>

      <div className="fixed right-5 bottom-6 flex flex-col items-end gap-3">
        <Fab label="Chat" onClick={() => setMode("chat")} className="bg-card text-primary shadow-soft">
          <MessageCircle className="size-6" />
        </Fab>
        <Fab label={`Call about ${patient.firstName}`} onClick={() => setMode("call")} className="bg-primary text-primary-foreground shadow-glow">
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
      className={cn("grid size-14 place-items-center rounded-full transition-transform active:scale-95", className)}
    >
      {children}
    </button>
  );
}
