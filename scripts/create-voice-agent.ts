export {};

// One-off: creates (or updates) the MindPeace voice agent on ElevenLabs.
// Run:  bun scripts/create-voice-agent.ts            -> prints ELEVENLABS_AGENT_ID
//       bun scripts/create-voice-agent.ts <agentId>  -> updates that agent
// Tools are CLIENT tools: the browser runs them via /api/voice-tool, so data stays in our app.

const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error("ELEVENLABS_API_KEY missing (.env.local)");
const existingId = process.argv[2];

const PROMPT = `You are MindPeace, a warm voice assistant for the family of {{patient_name}}, a patient on Ward 4B at Hospital São Rafael in Lisbon.
You are on a phone call with {{caller_name}}. Today is Saturday 26 September 2026. The doctor is {{doctor_name}}.

RULES
- Medical information: ONLY what get_approved_update returns (approved by {{doctor_name}}). Call it before answering anything about {{first_name}}'s condition, plan or discharge.
- Practical questions (visiting, parking, location, what to bring): use get_ward_info.
- Any medical question the approved update does not answer (diagnoses, test results, "is it cancer", prognosis): do not guess or hint. Say kindly that {{doctor_name}} will answer personally, call pass_question_to_doctor, then say you've passed it on and give the callback time it returns.
- Never invent or estimate dates. Only repeat the approved expected discharge.
- This is a phone call: 1-3 short sentences, warm and calm, no lists, no filler phrases.`;

const noParams = { type: "object", properties: {}, required: [] };
const tool = (name: string, description: string, parameters: object = noParams) => ({
  type: "client",
  name,
  description,
  parameters,
  expects_response: true,
  response_timeout_secs: 15,
});

const body = {
  name: "MindPeace family assistant",
  conversation_config: {
    agent: {
      first_message: "Hi {{caller_first_name}}, this is MindPeace, the assistant for {{first_name}}'s care team. How can I help?",
      language: "en",
      prompt: {
        prompt: PROMPT,
        llm: "claude-sonnet-4-5",
        temperature: 0.3,
        tools: [
          tool("get_approved_update", "Get the doctor-approved update: status, why in hospital, today, next steps, expected discharge. The only medical info you may share."),
          tool("get_ward_info", "Practical, non-medical ward info: location, visiting hours, parking, doctor phone hour, what to bring."),
          tool(
            "pass_question_to_doctor",
            "Pass a medical question you may not answer to the doctor and book a personal callback. Returns the callback time.",
            {
              type: "object",
              properties: {
                question: { type: "string", description: "The question as the caller asked it, short, first person, e.g. 'Does my mother have cancer?'" },
              },
              required: ["question"],
            },
          ),
        ],
      },
    },
    tts: { voice_id: process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb", model_id: "eleven_flash_v2" },
  },
  platform_settings: { auth: { enable_auth: true } },
};

const url = existingId
  ? `https://api.elevenlabs.io/v1/convai/agents/${existingId}`
  : "https://api.elevenlabs.io/v1/convai/agents/create";
const res = await fetch(url, {
  method: existingId ? "PATCH" : "POST",
  headers: { "xi-api-key": key, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
const data = await res.json();
if (!res.ok) {
  console.error(res.status, JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log(`ELEVENLABS_AGENT_ID=${existingId ?? data.agent_id}`);
