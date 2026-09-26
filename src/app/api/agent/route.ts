import { getClient, hasAnthropicKey, MODEL, textOf } from "@/lib/ai";
import { makeAgentTools, type AgentEvent } from "@/lib/agent-tools";
import { findFallback } from "@/data/fallbacks";
import { DEMO_USER, getPatient } from "@/data/seed";

// AI calls can take 5-20s; give them room on Vercel.
export const maxDuration = 60;

type Turn = { role: "user" | "assistant"; content: string };

function systemFor(patientName: string, firstName: string, caller: string) {
  return `You are MindPeace, a warm voice assistant for the family of ${patientName}, a patient on Ward 4B at Hospital São Rafael, Lisbon.
You are speaking with ${caller}. Today is Saturday 26 September 2026.

RULES
- Medical information: ONLY what get_approved_update returns (approved by ${DEMO_USER.name}). Call it before answering anything about ${firstName}'s condition, plan or discharge.
- Practical questions (visiting, parking, location): use get_ward_info.
- Any medical question the approved update does not answer (diagnoses, test results, "is it cancer", prognosis): do not guess or hint. Say kindly that ${DEMO_USER.shortName} will answer personally, then call log_question_for_doctor AND book_callback_slot, and tell them the callback time.
- Never invent or estimate dates. Only repeat the approved expected discharge.
- This is spoken aloud: 2-3 short sentences, warm and calm, no lists, no markdown, no emojis, no filler phrases.
- When you pass a question on, first say briefly that you've passed it to ${DEMO_USER.shortName}, then give the callback time.`;
}

// POST /api/agent  { patientId, caller, messages: [{role, content}] }  ->  { text, events, source }
// `events` lists what the agent did (tool calls), shown as chips in the UI.
export async function POST(req: Request) {
  const { patientId = "maria", caller = "Ana Ferreira (daughter)", messages = [] } = (await req.json()) as {
    patientId?: string;
    caller?: string;
    messages?: Turn[];
  };
  const patient = getPatient(patientId);
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content;
  if (!patient || !lastUser) return Response.json({ error: "patientId and messages required" }, { status: 400 });
  if (!hasAnthropicKey()) {
    return Response.json({ text: findFallback(lastUser), events: [], source: "fallback" });
  }

  const events: AgentEvent[] = [];
  try {
    const runner = getClient().beta.messages.toolRunner({
      model: MODEL,
      max_tokens: 4000,
      output_config: { effort: "low" },
      max_iterations: 6,
      system: systemFor(patient.name, patient.firstName, caller),
      tools: makeAgentTools(patientId, caller, events),
      messages,
    });
    let last;
    for await (const message of runner) last = message;
    return Response.json({ text: last ? textOf(last.content) : "", events, source: "live" });
  } catch (err) {
    console.error("[agent] falling back:", err);
    return Response.json({ text: findFallback(lastUser), events, source: "fallback", error: String(err) });
  }
}
