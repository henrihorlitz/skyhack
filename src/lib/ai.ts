import Anthropic from "@anthropic-ai/sdk";
import { findFallback } from "@/data/fallbacks";

// Demo safety net: every AI call returns *something*. If the key is missing,
// the venue WiFi dies or the API is slow, we serve a cached answer instead.

// Provider: OpenRouter if OPENROUTER_API_KEY is set (it speaks the Anthropic Messages API,
// so the same SDK works), otherwise Anthropic directly.
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
export const PROVIDER = OPENROUTER_KEY ? "openrouter" : "anthropic";
export const MODEL = OPENROUTER_KEY
  ? process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-5"
  : process.env.ANTHROPIC_MODEL || "claude-opus-5";
// Lower effort = faster answers on stage. Raise to "high" for harder tasks.
const EFFORT = (process.env.ANTHROPIC_EFFORT || "medium") as "low" | "medium" | "high";
const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 25_000);

export type AiResult = { text: string; source: "live" | "fallback"; error?: string };

export function hasAiKey() {
  return Boolean(OPENROUTER_KEY || process.env.ANTHROPIC_API_KEY);
}

export function getClient() {
  if (OPENROUTER_KEY) {
    return new Anthropic({
      baseURL: "https://openrouter.ai/api",
      apiKey: null,
      authToken: OPENROUTER_KEY,
      timeout: TIMEOUT_MS,
      maxRetries: 1,
    });
  }
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
  if (!hasAiKey()) {
    return { text: findFallback(prompt), source: "fallback", error: "no AI key (OPENROUTER_API_KEY / ANTHROPIC_API_KEY)" };
  }
  try {
    const response = await getClient().beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: EFFORT },
      // Direct Anthropic only: if a safety classifier declines, re-run on a fallback model.
      ...(PROVIDER === "anthropic" ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
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
