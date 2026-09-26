import Anthropic from "@anthropic-ai/sdk";
import { findFallback } from "@/data/fallbacks";

// Demo safety net: every AI call returns *something*. If the key is missing,
// the venue WiFi dies or the API is slow, we serve a cached answer instead.

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";
// Lower effort = faster answers on stage. Raise to "high" for harder tasks.
const EFFORT = (process.env.ANTHROPIC_EFFORT || "medium") as "low" | "medium" | "high";
const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 25_000);

export type AiResult = { text: string; source: "live" | "fallback"; error?: string };

export function hasAnthropicKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function getClient() {
  // Explicit baseURL: Claude Code sets ANTHROPIC_BASE_URL in its own shell, which the SDK
  // would otherwise pick up when Claude starts the dev server.
  return new Anthropic({ baseURL: "https://api.anthropic.com", timeout: TIMEOUT_MS, maxRetries: 1 });
}

export function textOf(content: Anthropic.Beta.BetaContentBlock[]) {
  return content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export async function askClaude(prompt: string, system?: string): Promise<AiResult> {
  if (!hasAnthropicKey()) {
    return { text: findFallback(prompt), source: "fallback", error: "ANTHROPIC_API_KEY missing" };
  }
  try {
    const response = await getClient().beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: EFFORT },
      // If a safety classifier declines, Anthropic re-runs on a fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system,
      messages: [{ role: "user", content: prompt }],
    });
    if (response.stop_reason === "refusal") {
      return { text: findFallback(prompt), source: "fallback", error: "refusal" };
    }
    return { text: textOf(response.content), source: "live" };
  } catch (err) {
    console.error("[ai] falling back:", err);
    return { text: findFallback(prompt), source: "fallback", error: String(err) };
  }
}
