// GET /api/voice-session  ->  { signedUrl }
// Short-lived signed URL for the ElevenLabs voice agent. The API key never reaches the browser.
export async function GET() {
  const key = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  if (!key || !agentId) return Response.json({ error: "voice agent not configured" }, { status: 503 });
  const res = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`, {
    headers: { "xi-api-key": key },
    signal: AbortSignal.timeout(10_000),
  }).catch((err) => err as Error);
  if (res instanceof Error || !res.ok) {
    console.error("[voice-session] failed:", res instanceof Error ? res.message : await res.text());
    return Response.json({ error: "voice session failed" }, { status: 503 });
  }
  const { signed_url } = (await res.json()) as { signed_url: string };
  return Response.json({ signedUrl: signed_url });
}
