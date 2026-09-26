"use client";

import { useEffect, useRef, useState } from "react";

// Tap-to-talk speech input via the browser's built-in Web Speech API (Chrome, Edge, Safari).
// start() listens, stop() ends and hands the transcript to onFinal. No library needed.

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

function getRecognitionClass(): (new () => Recognition) | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as Record<string, new () => Recognition>;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function useSpeechInput(onFinal: (text: string) => void) {
  const [supported] = useState(() => Boolean(getRecognitionClass()));
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const rec = useRef<Recognition | null>(null);
  const transcript = useRef("");
  const callback = useRef(onFinal);

  useEffect(() => {
    callback.current = onFinal;
  });

  function start() {
    const Rec = getRecognitionClass();
    if (!Rec) return;
    const r = new Rec();
    r.lang = "en-GB";
    r.continuous = true;
    r.interimResults = true;
    transcript.current = "";
    r.onresult = (e) => {
      transcript.current = Array.from(e.results, (res) => res[0].transcript).join(" ");
      setInterim(transcript.current);
    };
    r.onerror = (e) => console.warn("[speech]", e.error);
    r.onend = () => {
      setListening(false);
      setInterim("");
      if (transcript.current.trim()) callback.current(transcript.current);
    };
    rec.current = r;
    r.start();
    setListening(true);
  }

  function stop() {
    rec.current?.stop();
  }

  return { supported, listening, interim, start, stop };
}
