import { askClaude } from "@/lib/ai";

// POST /api/ai  { prompt: string, system?: string }  ->  { text, source, error? }
export async function POST(req: Request) {
  const { prompt, system } = (await req.json()) as { prompt?: string; system?: string };
  if (!prompt) return Response.json({ error: "prompt required" }, { status: 400 });
  return Response.json(await askClaude(prompt, system));
}
