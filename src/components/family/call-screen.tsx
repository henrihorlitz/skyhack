"use client";

import { useEffect, useRef, useState } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Leaf, Mic, MicOff, PhoneOff } from "lucide-react";
import { EventChips } from "@/components/family/event-chips";
import { DEMO_USER } from "@/data/seed";
import type { Patient } from "@/lib/types";
import { cn } from "@/lib/utils";

type Line = { role: "user" | "agent"; text: string };
type Event = { tool: string; label: string };
type Props = { patient: Patient; onClose: () => void };

// Real-time phone call with the ElevenLabs voice agent. Its tools run in our app via /api/voice-tool,
// so it only ever sees doctor-approved information.
export function CallScreen(props: Props) {
  return (
    <ConversationProvider>
      <Call {...props} />
    </ConversationProvider>
  );
}

function Call({ patient, onClose }: Props) {
  const caller = patient.family[0];
  const [lines, setLines] = useState<Line[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const started = useRef(false);

  const conversation = useConversation({
    onMessage: ({ message, source }) => setLines((l) => [...l, { role: source === "user" ? "user" : "agent", text: message }]),
    onError: (message) => setError(String(message)),
  });
  const connected = conversation.status === "connected";

  async function runTool(tool: string, args: Record<string, unknown> = {}) {
    const res = await fetch("/api/voice-tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: patient.id, caller: `${caller.name} (${caller.relation})`, tool, args }),
    });
    const data = (await res.json()) as { result?: string; events?: Event[] };
    if (data.events) setEvents((e) => [...e, ...data.events!]);
    return data.result ?? "Sorry, that information is not available right now.";
  }

  useEffect(() => {
    if (started.current) return; // React dev mode mounts twice; start only one call
    started.current = true;
    (async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const res = await fetch("/api/voice-session");
        if (!res.ok) throw new Error("Voice assistant unavailable");
        const { signedUrl } = await res.json();
        conversation.startSession({
          signedUrl,
          dynamicVariables: {
            patient_name: patient.name,
            first_name: patient.firstName,
            caller_name: `${caller.name} (${caller.relation})`,
            caller_first_name: caller.name.split(" ")[0],
            doctor_name: DEMO_USER.name,
          },
          clientTools: {
            get_approved_update: () => runTool("get_approved_update"),
            get_ward_info: () => runTool("get_ward_info"),
            pass_question_to_doctor: (p: { question: string }) => runTool("pass_question_to_doctor", p),
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Call failed");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!connected) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [connected]);

  function hangUp() {
    conversation.endSession();
    onClose();
  }

  const last = lines.slice(-4);
  const timer = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-md flex-col bg-[linear-gradient(180deg,#1f2937_0%,#111827_100%)] text-white animate-in fade-in slide-in-from-bottom-6">
      <div className="flex flex-col items-center pt-16">
        <span
          className={cn(
            "grid size-24 place-items-center rounded-full bg-primary text-primary-foreground transition-all duration-300",
            conversation.isSpeaking && "scale-105 ring-[14px] ring-white/10",
          )}
        >
          <Leaf className="size-10" />
        </span>
        <p className="mt-5 text-2xl font-semibold">MindPeace</p>
        <p className="text-sm text-white/60">{patient.firstName}&apos;s care team assistant</p>
        <p className="mt-2 text-sm tabular-nums text-white/80">
          {error ? "Call failed" : connected ? timer : "Calling…"}
        </p>
      </div>

      <div className="mt-8 flex flex-1 flex-col justify-end gap-2 overflow-hidden px-6 pb-4">
        {error && <p className="rounded-xl bg-white/10 p-3 text-sm">{error}. Please use the chat instead.</p>}
        {last.map((l, i) => (
          <p key={lines.length - last.length + i} className={cn("text-[15px] leading-snug animate-in fade-in", l.role === "user" ? "self-end text-right text-white/60" : "text-white")}>
            {l.text}
          </p>
        ))}
        <div className="flex flex-col items-start gap-1.5">
          <EventChips events={events} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-10 pb-12">
        <button
          onClick={() => conversation.setMuted(!conversation.isMuted)}
          aria-label={conversation.isMuted ? "Unmute" : "Mute"}
          className={cn("grid size-16 place-items-center rounded-full", conversation.isMuted ? "bg-white text-gray-900" : "bg-white/15")}
        >
          {conversation.isMuted ? <MicOff className="size-6" /> : <Mic className="size-6" />}
        </button>
        <button onClick={hangUp} aria-label="End call" className="grid size-16 place-items-center rounded-full bg-red-500">
          <PhoneOff className="size-6" />
        </button>
      </div>
    </div>
  );
}
