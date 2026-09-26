import { DRAFT_FALLBACKS } from "@/data/fallback-drafts";

// Cached answers served when the live AI call fails.
// Keyed by a word that appears in the input; the first matching key wins.

const VOICE_FALLBACKS: Record<string, string> = {
  cancer:
    "I understand this is worrying. That's a medical question Dr. Silva should answer personally, so I've passed it on to her and booked a callback for tomorrow at 12:15.",
  visit:
    "You can visit Maria every day between 15:00 and 20:00, up to two visitors at a time. Ward 4B is in Building B, on the 4th floor.",
  home:
    "Dr. Silva expects Maria can go home on Tuesday 29 September, if tomorrow's scan is clear and she stays well.",
  doing:
    "Maria is doing well. She has had no fever for more than a day, she is eating most of her meals and she sat in a chair today.",
};

const FALLBACKS: Record<string, string> = { ...DRAFT_FALLBACKS, ...VOICE_FALLBACKS };

const DEFAULT_FALLBACK =
  "I'm sorry, I couldn't look that up just now. The ward's doctors take family calls every day between 12:00 and 13:00.";

export function findFallback(input: string): string {
  const lower = input.toLowerCase();
  const hit = Object.keys(FALLBACKS).find((key) => lower.includes(key.toLowerCase()));
  return hit ? FALLBACKS[hit] : DEFAULT_FALLBACK;
}
