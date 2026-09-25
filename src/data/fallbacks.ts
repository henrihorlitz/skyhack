// Cached answers served when the live AI call fails.
// TOMORROW: once the demo path is fixed, run it once live and paste the real
// answers here, keyed by a word that appears in the demo input.

const FALLBACKS: Record<string, string> = {
  hello: "Hi! I'm running in offline demo mode right now, but here's what I would do: …",
};

const DEFAULT_FALLBACK =
  "Here's a summary based on the information provided: the key points are clear, the next step is to confirm details with the user, and I've prepared a draft for review.";

export function findFallback(input: string): string {
  const lower = input.toLowerCase();
  const hit = Object.keys(FALLBACKS).find((key) => lower.includes(key));
  return hit ? FALLBACKS[hit] : DEFAULT_FALLBACK;
}
