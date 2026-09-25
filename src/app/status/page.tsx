import { hasAnthropicKey, MODEL } from "@/lib/ai";
import { getSupabase, hasSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Morning check: open /status on the live URL and everything should be green.

async function checkSupabase(): Promise<[boolean, string]> {
  const sb = getSupabase();
  if (!sb) return [false, "env vars missing"];
  // A table-less request: a 2xx/4xx answer proves URL + key reach the project.
  const { error } = await sb.from("_status_probe").select("*").limit(1);
  const reachable = !error || error.code === "PGRST205" || error.code === "42P01";
  return [reachable, reachable ? "reachable" : error.message];
}

export default async function StatusPage() {
  const [dbOk, dbMsg] = hasSupabase() ? await checkSupabase() : [false, "env vars missing"];
  const hasEleven = Boolean(process.env.ELEVENLABS_API_KEY);
  const checks: [string, boolean, string][] = [
    ["Anthropic API key", hasAnthropicKey(), hasAnthropicKey() ? `model: ${MODEL}` : "missing → AI uses fallbacks"],
    ["ElevenLabs API key", hasEleven, hasEleven ? "ok" : "missing → browser voice"],
    ["Supabase", dbOk, dbMsg],
    ["Deployment", true, process.env.VERCEL_URL ?? "local"],
  ];

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Status</h1>
      <ul className="flex flex-col gap-3">
        {checks.map(([name, ok, detail]) => (
          <li key={name} className="flex items-center justify-between rounded-lg border p-3">
            <span>
              {ok ? "🟢" : "🔴"} {name}
            </span>
            <span className="text-sm text-muted-foreground">{detail}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
