"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { SpeakButton } from "@/components/speak-button";
import { fakeAction } from "@/lib/fake";

type Result = { text: string; source: string; steps?: { tool: string; input: unknown }[] };

// Starter test harness: proves AI, agent, voice and fake actions work end to end.
// TOMORROW: replace with the real demo path (or move to its own route).
export function AiPlayground() {
  const [prompt, setPrompt] = useState(
    "Find João Ferreira's profile and book him the earliest cardiology slot.",
  );
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(endpoint: "/api/ai" | "/api/agent") {
    setLoading(true);
    setResult(null);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    setResult(await res.json());
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => run("/api/agent")} disabled={loading}>
          {loading && <Loader2 className="animate-spin" />} Run agent
        </Button>
        <Button variant="secondary" onClick={() => run("/api/ai")} disabled={loading}>
          Single AI call
        </Button>
        <Button variant="outline" onClick={() => fakeAction("Summary sent to Dr. Mendes")}>
          Fake action
        </Button>
      </div>
      {result && (
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Badge variant={result.source === "live" ? "default" : "secondary"}>{result.source}</Badge>
            <SpeakButton text={result.text} />
          </div>
          {result.steps?.map((s, i) => (
            <div key={i} className="font-mono text-xs text-muted-foreground">
              → {s.tool}({JSON.stringify(s.input)})
            </div>
          ))}
          <p className="whitespace-pre-wrap text-sm">{result.text}</p>
        </div>
      )}
    </div>
  );
}
