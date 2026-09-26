"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, CircleCheck, FilePlus2, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DraftEditor } from "@/components/doctor/draft-editor";
import { DraftLoading } from "@/components/doctor/draft-loading";
import { QuestionsPanel } from "@/components/doctor/questions-panel";
import { fetchDraft, isToday, timeLabel, useDemoState } from "@/lib/client";
import type { FamilyUpdate, Patient } from "@/lib/types";
import { JUDGE_TRICK_LINE } from "@/data/notes";

type Props = { patient: Patient; initialNote: string };

const INTRO_MS = 3600; // minimum time the loading steps show on first open (4 steps × 0.9 s)

export function ReviewScreen({ patient, initialNote }: Props) {
  const state = useDemoState(patient.id);
  const [note, setNote] = useState(initialNote);
  const [draftNote, setDraftNote] = useState(initialNote);
  const [draft, setDraft] = useState<FamilyUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [intro, setIntro] = useState(true); // first load: short, snappy loading steps

  async function load(forNote: string, fresh: boolean) {
    setLoading(true);
    try {
      const res = await fetchDraft(patient.id, forNote, fresh);
      setDraft(res.update);
      setDraftNote(forNote);
    } catch {
      toast.error("Couldn't prepare the draft. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // First draft: already prepared in the background (and cached on the server), so it's instant.
  // For the demo we still show the loading steps briefly, so the audience sees what the AI does.
  useEffect(() => {
    const shown = new Promise((r) => setTimeout(r, INTRO_MS));
    Promise.all([fetchDraft(patient.id, initialNote), shown])
      .then(([res]) => setDraft(res.update))
      .catch(() => toast.error("Couldn't prepare the draft. Please try again."))
      .finally(() => {
        setLoading(false);
        setIntro(false);
      });
  }, [patient.id, initialNote]);

  function addFinding() {
    const next = `${note.trimEnd()}\n\nRADIOLOGY (NEW)\n${JUDGE_TRICK_LINE}`;
    setNote(next);
    load(next, true);
  }

  const approvedToday = state?.approvals.find((a) => a.patientId === patient.id && isToday(a));
  const family = patient.family.map((f) => f.name.split(" ")[0]).join(" and ");

  async function approve() {
    if (!draft) return;
    setSending(true);
    const res = await fetch("/api/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: patient.id, update: draft }),
    }).catch(() => null);
    setSending(false);
    if (res?.ok) toast.success(`Update sent to ${family}`);
    else toast.error("Sending failed. Please try again.");
  }

  return (
    <main className="mx-auto w-full max-w-[1120px] flex-1 px-6 pt-4 pb-6">
      <Link href="/doctor" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-subtitle hover:text-foreground">
        <ArrowLeft className="size-4" /> Ward 4B
      </Link>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] leading-tight font-semibold tracking-[-0.03em]">
            {patient.name} <span className="text-[22px] font-medium tracking-normal text-muted-foreground">{patient.age} · Bed {patient.bed}</span>
          </h1>
          <p className="font-medium text-subtitle">
            Family: {patient.family.map((f) => `${f.name} (${f.relation})`).join(", ")}
          </p>
        </div>
        {approvedToday && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3.5 py-2 text-[13px] font-semibold text-primary-deep">
            <CircleCheck className="size-4" /> Approved today at {timeLabel(approvedToday.approvedAt)}
          </span>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-section">Today&apos;s chart note</h2>
            <div className="flex gap-2">
              {/* Demo helper: a judge adds a serious new finding with one click, and the AI must hold it back. */}
              {patient.id === "maria" && !note.includes(JUDGE_TRICK_LINE) && (
                <Button size="sm" variant="outline" onClick={addFinding} disabled={loading}>
                  <FilePlus2 /> New radiology report
                </Button>
              )}
              {note !== draftNote && (
                <Button size="sm" variant="outline" onClick={() => load(note, true)} disabled={loading}>
                  <RefreshCw className={loading ? "animate-spin" : ""} /> Regenerate draft
                </Button>
              )}
            </div>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            spellCheck={false}
            className="min-h-[560px] flex-1 resize-none rounded-card bg-card p-5 font-mono text-[12px] leading-relaxed text-foreground/85 shadow-soft outline-none focus:ring-2 focus:ring-ring/40"
          />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-section">Family update · AI draft</h2>
          </div>
          <div className="rounded-card bg-card p-6 shadow-card">
            {loading || !draft ? (
              <DraftLoading stepMs={intro ? INTRO_MS / 4 : undefined} />
            ) : (
              <DraftEditor draft={draft} onChange={setDraft} pronoun={patient.pronoun} disabled={sending} />
            )}
          </div>

          <QuestionsPanel questions={state?.questions ?? []} />

          <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-full bg-card/95 py-2 pr-2 pl-5 shadow-card backdrop-blur">
            <p className="text-sm font-medium text-subtitle">Only switched-on items are sent to {family}.</p>
            <Button size="lg" onClick={approve} disabled={!draft || loading || sending}>
              <Send /> {approvedToday ? "Send updated version" : "Approve update"}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
