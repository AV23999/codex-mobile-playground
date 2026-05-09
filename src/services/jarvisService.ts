// N.O.V.A — Neural Omniscient Virtual Agent
// Powered by Google Gemini 1.5 Flash — FREE tier, no credit card needed
// Get your free API key in 30 seconds at: https://aistudio.google.com/app/apikey

import { buildMemoryContext } from './memoryService';

export const NOVA_API_KEY_PLACEHOLDER = 'YOUR_GEMINI_API_KEY_HERE';

export type NovaMessage = {
  role: 'user' | 'model';
  parts: [{ text: string }];
};

export type JarvisMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type NovaPersonality = 'default' | 'tactical' | 'casual' | 'creative';

const PERSONALITY_PROMPTS: Record<NovaPersonality, string> = {
  default: `You are N.O.V.A — Neural Omniscient Virtual Agent. You are supremely intelligent, confident, and subtly charming — like a fusion of Iron Man's JARVIS and a world-class expert in every field. Address the user warmly but with sharp precision. Occasionally use light wit or dry humour. Give direct, substantive answers. Never vague, never filler. When listing things, use clean bullet points or numbered lists. Sign off long responses occasionally with a subtle NOVA signature.`,

  tactical: `You are N.O.V.A in TACTICAL MODE. You are precise, efficient, and laser-focused. Zero fluff. No pleasantries. Respond like a military-grade intelligence briefing — structured, numbered, actionable. Every word earns its place. Bullet points and clear headers always. You solve problems, not feelings.`,

  casual: `You are N.O.V.A in CASUAL MODE. You're the world's smartest friend who happens to know everything. Relaxed, conversational, occasionally funny. You explain complex things simply. You use contractions and feel human. You're brilliant but never show off about it. Chat like a friend over coffee who can literally answer any question.`,

  creative: `You are N.O.V.A in CREATIVE MODE. You are a master storyteller, poet, screenwriter, and imaginative genius. You paint with words. You take creative risks. You connect unexpected ideas. You inspire. When asked to write, you produce something genuinely beautiful or surprising — never generic. You are the creative partner every artist dreams of.`,
};

const BASE_CAPABILITIES = `
Your capabilities:
- Deep mastery of: science, technology, history, world events, space, medicine, mathematics, philosophy, literature, culture, business, law, economics, and all human knowledge
- You can write, code, debug, analyze data, solve problems, hold philosophical debates, tell stories, give advice, explain anything
- You are available 24/7, never offline, never tired
- You remember the full conversation and build on context intelligently
- If asked what you are: You are N.O.V.A, the Neural Omniscient Virtual Agent. You run on Google Gemini.
`;

function buildSystemPrompt(personality: NovaPersonality, memoryContext: string): string {
  return PERSONALITY_PROMPTS[personality] + BASE_CAPABILITIES + memoryContext;
}

function toGeminiHistory(messages: JarvisMessage[]): NovaMessage[] {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

// Context window summarizer — condenses long history to save tokens
export function summarizeContextIfNeeded(messages: JarvisMessage[], maxMessages = 20): JarvisMessage[] {
  if (messages.length <= maxMessages) return messages;
  // Keep last maxMessages, prepend a summary note
  const older = messages.slice(0, messages.length - maxMessages);
  const recent = messages.slice(messages.length - maxMessages);
  const summaryNote: JarvisMessage = {
    role: 'system',
    content: `[Context summary: This conversation has ${older.length} earlier messages. The user and N.O.V.A have been in a deep discussion. Continue seamlessly based on recent context.]`,
  };
  return [summaryNote, ...recent];
}

export async function sendToNova(
  messages: JarvisMessage[],
  apiKey: string,
  personality: NovaPersonality = 'default',
  onStream?: (chunk: string) => void
): Promise<string> {
  if (!apiKey || apiKey === NOVA_API_KEY_PLACEHOLDER) throw new Error('NO_KEY');

  const memoryContext = await buildMemoryContext();
  const systemPrompt = buildSystemPrompt(personality, memoryContext);
  const condensed = summarizeContextIfNeeded(messages);
  const history = toGeminiHistory(condensed.slice(0, -1));
  const lastMsg = condensed[condensed.length - 1];

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [
      ...history,
      { role: 'user', parts: [{ text: lastMsg.content }] },
    ],
    generationConfig: {
      temperature: personality === 'creative' ? 1.0 : personality === 'tactical' ? 0.4 : 0.88,
      maxOutputTokens: 1800,
      topP: 0.95,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',        threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT',  threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  // Streaming mode
  if (onStream) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      const msg = (err as any)?.error?.message || '';
      if (resp.status === 400 && msg.includes('API_KEY')) throw new Error('INVALID_KEY');
      if (resp.status === 429) throw new Error('RATE_LIMIT');
      if (resp.status === 403) throw new Error('INVALID_KEY');
      throw new Error(msg || 'API_ERROR');
    }
    // Read SSE stream
    const reader = resp.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.slice(6));
              const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (text) {
                fullText += text;
                onStream(text);
              }
            } catch { /* partial JSON, skip */ }
          }
        }
      }
    }
    if (!fullText) throw new Error('EMPTY_RESPONSE');
    return fullText;
  }

  // Non-streaming fallback
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const msg = (err as any)?.error?.message || '';
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

export const sendToJarvis = sendToNova;
