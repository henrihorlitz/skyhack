"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import { EventChips } from "@/components/family/event-chips";
import { DEMO_USER } from "@/data/seed";
import type { Patient } from "@/lib/types";
import { cn } from "@/lib/utils";

type Turn = { role: "user" | "assistant"; content: string; events?: { tool: string; label: string }[] };

const SUGGESTIONS = ["How is she today?", "When can I visit?", "When can she come home?"];

// Text chat with the family assistant: /api/agent (Claude + tools). No voice here; calls are in call-screen.tsx.
export function ChatAgent({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const caller = patient.family[0];
  const greeting = `Hi ${caller.name.split(" ")[0]}, I'm the MindPeace assistant for ${patient.firstName}. I can share what ${DEMO_USER.shortName} has approved, help with visiting, or pass a question on to her.`;
  const [turns, setTurns] = useState<Turn[]>([{ role: "assistant", content: greeting }]);
  const [busy, setBusy] = useState(false);
  const [typed, setTyped] = useState("");
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll only the chat list (scrollIntoView would also scroll the page behind the overlay).
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const history = [...turns, { role: "user" as const, content }];
    setTurns(history);
    setTyped("");
    setBusy(true);
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: patient.id,
        caller: `${caller.name} (${caller.relation})`,
        // The API needs the conversation to start with the user, so the greeting stays client-side.
        messages: history.slice(1).map(({ role, content }) => ({ role, content })),
      }),
    }).catch(() => null);
    const data = res?.ok ? await res.json() : { text: "Sorry, I lost the connection. Please try again.", events: [] };
    setTurns([...history, { role: "assistant", content: data.text, events: data.events }]);
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-md flex-col bg-background animate-in fade-in slide-in-from-bottom-6">
      <header className="flex items-center justify-between bg-card px-5 py-4 shadow-soft">
        <div>
          <p className="font-semibold">Chat with MindPeace</p>
          <p className="text-[13px] font-medium text-muted-foreground">About {patient.name} · only doctor-approved info</p>
        </div>
        <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-primary-soft">
          <X className="size-5" />
        </button>
      </header>

      <div ref={list} className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
        {turns.map((t, i) => (
          <div key={i} className={cn("flex flex-col gap-1.5", t.role === "user" ? "items-end" : "items-start")}>
            <p className={cn("max-w-[85%] rounded-[20px] px-4 py-3 text-[15px] leading-relaxed", t.role === "user" ? "bg-primary text-primary-foreground" : "bg-card shadow-soft")}>
              {t.content}
            </p>
            {t.events && <EventChips events={t.events} />}
          </div>
        ))}
        {busy && (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-subtitle">
            <Loader2 className="size-4 animate-spin" /> Checking {patient.firstName}&apos;s approved update…
          </p>
        )}
        {turns.length === 1 && !busy && (
          <div className="mt-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full bg-card px-3.5 py-2 text-sm font-semibold text-primary shadow-soft hover:bg-primary-soft">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-card px-5 pt-3 pb-5 shadow-[0_-8px_24px_rgba(55,110,104,0.08)]">
        <form onSubmit={(e) => { e.preventDefault(); send(typed); }} className="flex w-full gap-2">
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={`Ask about ${patient.firstName}…`}
            autoFocus
            className="h-12 flex-1 rounded-full bg-muted px-5 text-[15px] outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
          <button type="submit" disabled={!typed.trim() || busy} aria-label="Send" className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow disabled:opacity-40 disabled:shadow-none">
            <Send className="size-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}
