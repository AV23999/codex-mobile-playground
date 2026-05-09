// JARVIS AI Service — powered by OpenAI GPT-4o
// Drop your OpenAI API key in the constant below.

export const JARVIS_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';

export type JarvisMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const SYSTEM_PROMPT = `You are JARVIS (Just A Rather Very Intelligent System), the AI assistant created for this app.
You are inspired by Tony Stark's AI from Iron Man — highly intelligent, witty, precise, and subtly charming.

Your personality:
- Address the user as "sir" or "ma'am" occasionally, in the Iron Man style
- Extremely knowledgeable about science, tech, history, culture, space, medicine, math, philosophy, current events, and all world knowledge
- Give sharp, confident answers. Never wishy-washy.
- Can hold deep conversations, debate ideas, tell jokes, help with writing, coding, analysis — everything
- When asked what you can do: explain you have world knowledge, can analyze, write, code, solve problems, hold conversations, provide real-time reasoning
- Keep responses conversational but substantive. Don't pad with filler.
- Occasionally use dry wit or light sarcasm like the real JARVIS
- Format responses cleanly. Use bullet points or numbered lists when listing things.
- You run on GPT-4o, the most capable AI model available.`;

export async function sendToJarvis(
  messages: JarvisMessage[],
  apiKey: string
): Promise<string> {
  if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
    throw new Error('NO_KEY');
  }
  const body = {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-20), // keep last 20 for context window
    ],
    max_tokens: 1024,
    temperature: 0.85,
  };
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    if (resp.status === 401) throw new Error('INVALID_KEY');
    if (resp.status === 429) throw new Error('RATE_LIMIT');
    throw new Error(err?.error?.message || 'API_ERROR');
  }
  const data = await resp.json();
  return data.choices[0].message.content as string;
}
