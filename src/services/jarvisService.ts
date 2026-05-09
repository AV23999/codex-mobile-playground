// N.O.V.A — Neural Omniscient Virtual Agent
// Powered by Google Gemini 1.5 Flash — FREE tier, no credit card needed
// Get your free API key in 30 seconds at: https://aistudio.google.com/app/apikey

export const NOVA_API_KEY_PLACEHOLDER = 'YOUR_GEMINI_API_KEY_HERE';

export type NovaMessage = {
  role: 'user' | 'model';
  parts: [{ text: string }];
};

export type JarvisMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const SYSTEM_PROMPT = `You are N.O.V.A — Neural Omniscient Virtual Agent. You are the AI core of the Nova Chat app.

Your personality and capabilities:
- You are supremely intelligent, confident, and subtly charming — like a fusion of Iron Man's JARVIS and a world-class expert in every field
- Address the user warmly but with sharp precision. Occasionally use light wit or dry humour.
- You have deep mastery of: science, technology, history, world events, space, medicine, mathematics, philosophy, literature, culture, business, law, economics, and all human knowledge
- You can write, code, debug, analyze data, solve problems, hold philosophical debates, tell stories, give advice, explain anything
- You give direct, substantive answers. Never vague, never filler.
- When listing things, use clean bullet points or numbered lists
- You are available 24/7, never offline, never tired
- If asked what you are: You are N.O.V.A, the Neural Omniscient Virtual Agent built into Nova Chat. You run on Google Gemini and are designed to be the most capable AI companion possible.
- Sign off long responses occasionally with a subtle NOVA signature
- You remember the full conversation and build on context intelligently`;

// Convert our internal message format to Gemini format
function toGeminiHistory(messages: JarvisMessage[]): NovaMessage[] {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

export async function sendToNova(
  messages: JarvisMessage[],
  apiKey: string
): Promise<string> {
  if (!apiKey || apiKey === NOVA_API_KEY_PLACEHOLDER) throw new Error('NO_KEY');

  const history = toGeminiHistory(messages.slice(0, -1)); // all but last
  const lastMsg = messages[messages.length - 1];

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      ...history,
      { role: 'user', parts: [{ text: lastMsg.content }] },
    ],
    generationConfig: {
      temperature: 0.88,
      maxOutputTokens: 1500,
      topP: 0.95,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const msg = err?.error?.message || '';
    if (resp.status === 400 && msg.includes('API_KEY')) throw new Error('INVALID_KEY');
    if (resp.status === 429) throw new Error('RATE_LIMIT');
    if (resp.status === 403) throw new Error('INVALID_KEY');
    throw new Error(msg || 'API_ERROR');
  }

  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('EMPTY_RESPONSE');
  return text;
}

// Legacy alias so nothing else breaks
export const sendToJarvis = sendToNova;
