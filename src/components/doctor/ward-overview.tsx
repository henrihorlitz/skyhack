"use client";

import Link from "next/link";
import { ChevronRight, CircleCheck, FileText, MessageCircleQuestion } from "lucide-react";
import { isToday, timeLabel, useDemoState } from "@/lib/client";
import { DraftWarmup } from "@/components/draft-warmup";
import { HOSPITAL, OTHER_BEDS, PATIENTS } from "@/data/seed";
import { cn } from "@/lib/utils";

type Row =
  | { kind: "real"; bed: number; id: string; name: string; age: number; approvedAt?: string; headline?: string; questions: number }
  | { kind: "other"; bed: number; name: string; age: number; headline: string; approvedAt: string };

export function WardOverview() {
  const state = useDemoState();


  const rows: Row[] = [
    ...PATIENTS.map((p) => {
      const mine = state?.approvals.filter((a) => a.patientId === p.id) ?? [];
      const today = mine.find(isToday);
      return {
        kind: "real" as const,
        bed: p.bed,
        id: p.id,
        name: p.name,
        age: p.age,
        approvedAt: today?.approvedAt,
        headline: (today ?? mine.at(-1))?.update.headline,
        questions: state?.questions.filter((q) => q.patientId === p.id).length ?? 0,
      };
    }),
    ...OTHER_BEDS.map((b) => ({ kind: "other" as const, ...b })),
  ].sort((a, b) => a.bed - b.bed);

  const real = rows.filter((r) => r.kind === "real");
  const needsAction = real.filter((r) => !r.approvedAt || r.questions > 0);
  const drafts = real.filter((r) => !r.approvedAt).length;
  const questions = real.reduce((n, r) => n + r.questions, 0);

  return (
    <main className="mx-auto w-full max-w-[1120px] flex-1 px-6 pt-6 pb-4">
      <DraftWarmup />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-medium text-subtitle">Saturday 26 September</p>
          <h1 className="text-[40px] leading-tight font-semibold tracking-[-0.03em]">Family updates</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Stat value={HOSPITAL.beds} label="Patients" />
          <Stat value={HOSPITAL.beds - drafts} label="Families informed" />
          <Stat value={drafts} label="Drafts to review" highlight={drafts > 0} />
          <Stat value={questions} label="Family questions" highlight={questions > 0} />
        </div>
      </div>

      {needsAction.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-section">Needs you</h2>
          <div className="flex flex-col gap-1 rounded-card bg-card p-3 shadow-card">
            {needsAction.map((r) => (
              <PatientRow key={r.bed} row={r} />
            ))}
          </div>
        </section>
      )}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-section">All beds</h2>
        <div className="flex flex-col gap-1 rounded-card bg-card p-3 shadow-card">
          {rows.map((r) => (r.kind === "real" ? <PatientRow key={r.bed} row={r} /> : <OtherRow key={r.bed} row={r} />))}
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className={cn("min-w-28 rounded-[20px] bg-card px-4 py-3 shadow-soft", highlight && "bg-primary text-primary-foreground shadow-glow")}>
      <div className="text-[22px] leading-none font-semibold">{value}</div>
      <div className={cn("mt-1.5 text-[13px] font-medium", highlight ? "text-primary-foreground/85" : "text-muted-foreground")}>{label}</div>
    </div>
  );
}

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2);

function Person({ bed, name, age, headline }: { bed: number; name: string; age: number; headline?: string }) {
  return (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-[13px] font-semibold text-primary-deep">
        {initials(name)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-semibold">
          {name} <span className="font-medium text-muted-foreground">· {age} · Bed {bed}</span>
        </div>
        {headline && <div className="truncate text-sm font-medium text-subtitle">{headline}</div>}
      </div>
    </>
  );
}

function PatientRow({ row }: { row: Extract<Row, { kind: "real" }> }) {
  return (
    <Link href={`/doctor/${row.id}`} className="flex items-center gap-4 rounded-row px-3 py-3 transition-colors hover:bg-row">
      <Person bed={row.bed} name={row.name} age={row.age} headline={row.headline} />
      {row.questions > 0 && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[13px] font-semibold text-primary-deep">
          <MessageCircleQuestion className="size-4" />
          {row.questions} {row.questions === 1 ? "question" : "questions"}
        </span>
      )}
      {row.approvedAt ? (
        <span className="inline-flex w-40 items-center gap-1.5 text-sm font-medium text-primary-deep">
          <CircleCheck className="size-4" /> Approved {timeLabel(row.approvedAt)}
        </span>
      ) : (
        <span className="inline-flex w-40 items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[13px] font-semibold text-primary-foreground">
          <FileText className="size-4" /> Review draft
        </span>
      )}
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

function OtherRow({ row }: { row: Extract<Row, { kind: "other" }> }) {
  return (
    <div className="flex items-center gap-4 rounded-row px-3 py-3">
      <Person bed={row.bed} name={row.name} age={row.age} headline={row.headline} />
      <span className="inline-flex w-40 items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <CircleCheck className="size-4" /> Approved {row.approvedAt}
      </span>
      <ChevronRight className="size-4 text-transparent" />
    </div>
  );
}
