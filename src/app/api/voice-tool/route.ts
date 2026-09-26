import { approvedUpdate, passQuestion, wardInfo, type AgentEvent } from "@/lib/agent-tools";
import { getPatient } from "@/data/seed";

// POST /api/voice-tool  { patientId, caller, tool, args }  ->  { result, events }
// Runs the voice agent's client tools on the server (the browser just forwards the call).
export async function POST(req: Request) {
  const { patientId = "", caller = "", tool, args = {} } = (await req.json()) as {
    patientId?: string;
    caller?: string;
    tool?: string;
    args?: { question?: string };
  };
  if (!getPatient(patientId)) return Response.json({ error: "unknown patient" }, { status: 400 });
  const events: AgentEvent[] = [];
  let result: string;
  if (tool === "get_approved_update") {
    result = await approvedUpdate(patientId);
    events.push({ tool, label: "Read the approved update" });
  } else if (tool === "get_ward_info") {
    result = wardInfo();
    events.push({ tool, label: "Checked ward info" });
  } else if (tool === "pass_question_to_doctor" && args.question) {
    result = await passQuestion(patientId, caller, args.question, events);
  } else {
    return Response.json({ error: "unknown tool" }, { status: 400 });
  }
  return Response.json({ result, events });
}
