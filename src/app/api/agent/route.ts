import { getClient, hasAnthropicKey, MODEL, textOf } from "@/lib/ai";
import { AGENT_TOOLS } from "@/lib/agent-tools";
import { findFallback } from "@/data/fallbacks";

const SYSTEM = `You are a helpful clinic assistant agent. Use the tools to look up
patients and appointments before answering. Be concise. This is a demo with synthetic data.`;

type Step = { tool: string; input: unknown };

// POST /api/agent  { prompt }  ->  { text, steps, source }
// `steps` lists the tool calls the agent made — show them in the UI, judges love seeing the agent "think".
export async function POST(req: Request) {
  const { prompt } = (await req.json()) as { prompt?: string };
  if (!prompt) return Response.json({ error: "prompt required" }, { status: 400 });
  if (!hasAnthropicKey()) {
    return Response.json({ text: findFallback(prompt), steps: [], source: "fallback" });
  }

  const steps: Step[] = [];
  try {
    const runner = getClient().beta.messages.toolRunner({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: "medium" },
      max_iterations: 8,
      system: SYSTEM,
      tools: AGENT_TOOLS,
      messages: [{ role: "user", content: prompt }],
    });
    let last;
    for await (const message of runner) {
      for (const block of message.content) {
        if (block.type === "tool_use") steps.push({ tool: block.name, input: block.input });
      }
      last = message;
    }
    return Response.json({ text: last ? textOf(last.content) : "", steps, source: "live" });
  } catch (err) {
    console.error("[agent] falling back:", err);
    return Response.json({ text: findFallback(prompt), steps, source: "fallback", error: String(err) });
  }
}
