import { NextResponse } from 'next/server';

type JarvisRequest = {
  message?: string;
  history?: { role: string; content: string }[];
};

const encoder = new TextEncoder();
const sseFrame = (data: string) => `data: ${data}\n\n`;

export async function POST(request: Request) {
  const body = (await request.json()) as JarvisRequest;
  const message = body.message ?? '';
  const history = Array.isArray(body.history) ? body.history : [];

  if (!message.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const apiKey = process.env.NOVA_OPENAI_KEY;

  if (!apiKey) {
    const demoWords = 'API key not configured. Running in demo mode.'.split(' ');
    const demoStream = new ReadableStream({
      async start(controller) {
        for (const word of demoWords) {
          controller.enqueue(encoder.encode(sseFrame(word + ' ')));
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(demoStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        {
          role: 'system',
          content: 'You are Jarvis, the AI assistant for N.O.V.A. Be concise and direct.',
        },
        ...history,
        { role: 'user', content: message },
      ],
    }),
  });

  if (!openAIResponse.ok || !openAIResponse.body) {
    return NextResponse.json({ error: 'Failed to stream from model' }, { status: 500 });
  }

  return new Response(openAIResponse.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
