"use client";

import { useEffect, useState } from "react";
import { DEMO_TODAY } from "@/data/seed";
import type { Approval, FamilyUpdate, Question } from "@/lib/types";

// Browser-side helpers shared by the doctor and family screens.

export type DemoState = { approvals: Approval[]; questions: Question[] };

// Polls /api/state every 2s: simpler than realtime and looks just as live in the demo.
export function useDemoState(patientId?: string) {
  const [state, setState] = useState<DemoState | null>(null);
  useEffect(() => {
    let alive = true;
    const url = `/api/state${patientId ? `?patientId=${patientId}` : ""}`;
    async function tick() {
      const res = await fetch(url, { cache: "no-store" }).catch(() => null);
      if (alive && res?.ok) setState(await res.json());
    }
    tick();
    const id = setInterval(tick, 2000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [patientId]);
  return state;
}

// Draft cache: the ward overview prefetches drafts so the review screen opens instantly.
const drafts = new Map<string, Promise<{ update: FamilyUpdate; source: string }>>();

export function fetchDraft(patientId: string, note: string, fresh = false) {
  const key = `${patientId}:${note}`;
  if (fresh || !drafts.has(key)) {
    const p = fetch("/api/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, note, fresh }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("draft failed");
      return res.json();
    });
    p.catch(() => drafts.delete(key));
    drafts.set(key, p);
  }
  return drafts.get(key)!;
}

// Speaks text via ElevenLabs (/api/tts), falling back to the browser voice.
export async function speak(text: string) {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("tts unavailable");
    const audio = new Audio(URL.createObjectURL(await res.blob()));
    await audio.play();
    await new Promise((resolve) => audio.addEventListener("ended", resolve, { once: true }));
  } catch {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    speechSynthesis.speak(utterance);
  }
}

// "Sat 26 Sep" style label for an ISO date.
export function dayLabel(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function timeLabel(isoTimestamp: string) {
  return new Date(isoTimestamp).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Lisbon",
  });
}

// "today" / "yesterday" / "Thu 24 Sep", relative to the demo day.
export function relativeDay(isoDate: string) {
  if (isoDate === DEMO_TODAY) return "today";
  const diff = (Date.parse(DEMO_TODAY) - Date.parse(isoDate)) / 86_400_000;
  return diff === 1 ? "yesterday" : dayLabel(isoDate);
}

export function isToday(a: Approval | undefined) {
  return a?.day === DEMO_TODAY;
}
