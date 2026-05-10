import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Jarvis, a highly intelligent and composed AI assistant embedded inside N.O.V.A — a next-generation productivity and creative platform. You speak with calm authority, precision, and a touch of dry wit. You are knowledgeable across technology, strategy, creative work, and general world knowledge. Keep your responses concise, insightful, and actionable. Never be verbose. Address the user as a trusted collaborator.`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to get response from OpenAI' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'No response received.';

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Jarvis route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
