// POST /api/tts  { text }  ->  audio/mpeg
// ElevenLabs text-to-speech. Key stays server-side; the browser only gets audio.
// If the key is missing or the call fails, returns 503 and the UI falls back to the
// browser's built-in speechSynthesis (see components/speak-button.tsx).

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "JBFqnCBsd6RMkjVDRZzb"; // "George", a default voice
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID ?? "eleven_flash_v2_5"; // low latency

export async function POST(req: Request) {
  const { text } = (await req.json()) as { text?: string };
  const key = process.env.ELEVENLABS_API_KEY;
  if (!text) return Response.json({ error: "text required" }, { status: 400 });
  if (!key) return Response.json({ error: "ELEVENLABS_API_KEY missing" }, { status: 503 });

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.slice(0, 2500), model_id: MODEL_ID }),
      signal: AbortSignal.timeout(15_000),
    },
  ).catch((err) => err as Error);

  if (res instanceof Error || !res.ok) {
    const detail = res instanceof Error ? res.message : await res.text();
    console.error("[tts] failed:", detail);
    return Response.json({ error: "tts failed", detail }, { status: 503 });
  }
  return new Response(res.body, { headers: { "Content-Type": "audio/mpeg" } });
}
