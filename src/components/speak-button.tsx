"use client";

import { useState } from "react";
import { Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Reads text aloud via ElevenLabs (/api/tts). Falls back to the browser's
// built-in voice if ElevenLabs is unavailable, so the button never "does nothing".
export function SpeakButton({ text }: { text: string }) {
  const [loading, setLoading] = useState(false);

  async function speak() {
    setLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("tts unavailable");
      const url = URL.createObjectURL(await res.blob());
      await new Audio(url).play();
    } catch {
      speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={speak} disabled={loading || !text}>
      {loading ? <Loader2 className="animate-spin" /> : <Volume2 />}
      Listen
    </Button>
  );
}
