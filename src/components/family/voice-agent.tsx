"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarClock, ClipboardList, Loader2, Mic, Send, X } from "lucide-react";
import { speak } from "@/lib/client";
import { useSpeechInput } from "@/components/family/use-speech-input";
import { DEMO_USER } from "@/data/seed";
import type { Patient } from "@/lib/types";
import { cn } from "@/lib/utils";

type Event = { tool: string; label: string };
type Turn = { role: "user" | "assistant"; content: string; events?: Event[] };

const SUGGESTIONS = ["How is she today?", "When can I visit?", "When can she come home?"];
const VISIBLE_TOOLS = ["log_question_for_doctor", "book_callback_slot"];

// Tap-to-talk voice assistant: speech → /api/agent (Claude + tools) → ElevenLabs voice.
export function VoiceAgent({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const caller = patient.family[0];
  const greeting = `Hi ${caller.name.split(" ")[0]}, I'm the MindPeace assistant for ${patient.firstName}. I can share what ${DEMO_USER.shortName} has approved, help with visiting, or pass a question on to her.`;
  const [turns, setTurns] = useState<Turn[]>([{ role: "assistant", content: greeting }]);
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [typed, setTyped] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const mic = useSpeechInput((text) => send(text));

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, busy, mic.interim]);

  async function say(text: string) {
    setSpeaking(true);
    await speak(text).catch(() => {});
    setSpeaking(false);
  }

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
    say(data.text);
  }

  const orbState = mic.listening ? "listening" : busy ? "thinking" : speaking ? "speaking" : "idle";

  return (
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-md flex-col bg-background animate-in fade-in slide-in-from-bottom-6">
      <header className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <p className="font-semibold">MindPeace assistant</p>
          <p className="text-xs text-muted-foreground">About {patient.name} · only doctor-approved info</p>
        </div>
        <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-muted">
          <X className="size-5" />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
        {turns.map((t, i) => (
          <div key={i} className={cn("flex flex-col gap-1.5", t.role === "user" ? "items-end" : "items-start")}>
            <p className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", t.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
              {t.content}
            </p>
            {t.events
              ?.filter((e) => VISIBLE_TOOLS.includes(e.tool))
              .sort((a, b) => VISIBLE_TOOLS.indexOf(a.tool) - VISIBLE_TOOLS.indexOf(b.tool))
              .map((e, n) => (
              <span key={n} className="inline-flex items-center gap-1.5 rounded-full bg-medical-soft px-3 py-1 text-xs font-medium text-medical animate-in fade-in zoom-in-95">
                {e.tool === "book_callback_slot" ? <CalendarClock className="size-3.5" /> : <ClipboardList className="size-3.5" />}
                {e.label}
              </span>
            ))}
          </div>
        ))}
        {mic.interim && <p className="self-end max-w-[85%] rounded-2xl bg-primary/10 px-4 py-2.5 text-sm italic">{mic.interim}</p>}
        {busy && (
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Checking {patient.firstName}&apos;s approved update…
          </p>
        )}
        {turns.length === 1 && !busy && (
          <div className="mt-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border px-3 py-1.5 text-sm hover:bg-muted">
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={bottom} />
      </div>

      <footer className="flex flex-col items-center gap-3 border-t px-5 pt-4 pb-5">
        <button
          onClick={mic.listening ? mic.stop : mic.start}
          disabled={!mic.supported || busy}
          aria-label={mic.listening ? "Stop and send" : "Tap to talk"}
          className={cn(
            "grid size-16 place-items-center rounded-full text-primary-foreground shadow-lg transition-all disabled:opacity-40",
            orbState === "listening" ? "scale-110 bg-withheld ring-8 ring-withheld/20 animate-pulse" : "bg-primary",
            orbState === "speaking" && "ring-8 ring-primary/15",
          )}
        >
          {busy ? <Loader2 className="size-6 animate-spin" /> : <Mic className="size-6" />}
        </button>
        <p className="text-xs text-muted-foreground">
          {orbState === "listening" ? "Listening… tap to send" : orbState === "speaking" ? "Speaking…" : mic.supported ? "Tap to talk" : "Voice not supported in this browser, type below"}
        </p>
        <form onSubmit={(e) => { e.preventDefault(); send(typed); }} className="flex w-full gap-2">
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Or type your question…"
            className="h-10 flex-1 rounded-full border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button type="submit" disabled={!typed.trim() || busy} aria-label="Send" className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40">
            <Send className="size-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}
