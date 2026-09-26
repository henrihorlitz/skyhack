"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ChevronRight, CircleCheck, FileText, MessageCircleQuestion } from "lucide-react";
import { fetchDraft, isToday, timeLabel, useDemoState } from "@/lib/client";
import { HOSPITAL, OTHER_BEDS, PATIENTS } from "@/data/seed";
import { TODAY_NOTES } from "@/data/notes";
import { cn } from "@/lib/utils";

type Row =
  | { kind: "real"; bed: number; id: string; name: string; age: number; approvedAt?: string; headline?: string; questions: number }
  | { kind: "other"; bed: number; name: string; age: number; headline: string; approvedAt: string };

export function WardOverview() {
  const state = useDemoState();

  // Drafts are prepared in the background, like the daily job would do, so review opens instantly.
  useEffect(() => {
    for (const p of PATIENTS) fetchDraft(p.id, TODAY_NOTES[p.id]).catch(() => {});
  }, []);

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
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Saturday 26 September</p>
          <h1 className="text-2xl font-semibold tracking-tight">Family updates · {HOSPITAL.ward}</h1>
        </div>
        <div className="flex gap-3 text-sm">
          <Stat value={HOSPITAL.beds} label="patients" />
          <Stat value={HOSPITAL.beds - drafts} label="families informed" />
          <Stat value={drafts} label="drafts to review" highlight={drafts > 0} />
          <Stat value={questions} label="family questions" highlight={questions > 0} />
        </div>
      </div>

      {needsAction.length > 0 && (
        <>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Needs you</h2>
          <div className="mb-8 overflow-hidden rounded-xl border bg-card shadow-sm">
            {needsAction.map((r) => (
              <PatientRow key={r.bed} row={r} />
            ))}
          </div>
        </>
      )}
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">All beds</h2>
      <div className="overflow-hidden rounded-xl border bg-card">
        {rows.map((r) => (r.kind === "real" ? <PatientRow key={r.bed} row={r} /> : <OtherRow key={r.bed} row={r} />))}
      </div>
    </main>
  );
}

function Stat({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-lg border px-3 py-2", highlight && "border-medical/40 bg-medical-soft")}>
      <div className="text-lg font-semibold leading-none">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function PatientRow({ row }: { row: Extract<Row, { kind: "real" }> }) {
  return (
    <Link
      href={`/doctor/${row.id}`}
      className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0 hover:bg-muted/60"
    >
      <span className="w-10 text-sm text-muted-foreground">{row.bed}</span>
      <div className="min-w-0 flex-1">
        <div className="font-medium">
          {row.name} <span className="font-normal text-muted-foreground">· {row.age}</span>
        </div>
        {row.headline && <div className="truncate text-sm text-muted-foreground">{row.headline}</div>}
      </div>
      {row.questions > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-withheld-soft px-2.5 py-1 text-xs font-medium text-withheld">
          <MessageCircleQuestion className="size-3.5" />
          {row.questions} {row.questions === 1 ? "question" : "questions"}
        </span>
      )}
      {row.approvedAt ? (
        <span className="inline-flex w-36 items-center gap-1 text-sm text-nursing">
          <CircleCheck className="size-4" /> Approved {timeLabel(row.approvedAt)}
        </span>
      ) : (
        <span className="inline-flex w-36 items-center gap-1 text-sm font-medium text-medical">
          <FileText className="size-4" /> Draft ready
        </span>
      )}
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

function OtherRow({ row }: { row: Extract<Row, { kind: "other" }> }) {
  return (
    <div className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0">
      <span className="w-10 text-sm text-muted-foreground">{row.bed}</span>
      <div className="min-w-0 flex-1">
        <div className="font-medium">
          {row.name} <span className="font-normal text-muted-foreground">· {row.age}</span>
        </div>
        <div className="truncate text-sm text-muted-foreground">{row.headline}</div>
      </div>
      <span className="inline-flex w-36 items-center gap-1 text-sm text-nursing">
        <CircleCheck className="size-4" /> Approved {row.approvedAt}
      </span>
      <ChevronRight className="size-4 text-muted-foreground/30" />
    </div>
  );
}
