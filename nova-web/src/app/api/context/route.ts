import { NextResponse } from 'next/server';
import { getMemories } from '@/lib/abyss-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const route = searchParams.get('route') ?? '';
  const memories = getMemories();
  const count = memories.length;

  if (route === '/jarvis') {
    return NextResponse.json({
      title: 'Recent Memory Hits',
      items: memories.slice(0, 3).map((m) => `${m.title}: ${m.excerpt}`),
    });
  }

  if (route === '/abyss') {
    return NextResponse.json({
      title: 'Abyss Status',
      items: [
        `${count} memories stored`,
        `Last updated: ${memories[0]?.timestamp ?? 'N/A'}`,
      ],
    });
  }

  if (route === '/chats') {
    return NextResponse.json({
      title: 'Chat Summary',
      items: ['5 conversations', '7 unread messages', 'Last active: 10:12'],
    });
  }

  if (route === '/settings') {
    return NextResponse.json({
      title: 'Active Preferences',
      items: ['Theme: Dark', 'Notifications: On', 'Plan: Free'],
    });
  }

  if (route === '/') {
    return NextResponse.json({
      title: 'System Status',
      items: ['Jarvis: Online', `Abyss: ${count} entries`, 'Auth: Active'],
    });
  }

  return NextResponse.json({
    title: 'Context',
    items: ['No context available for this section.'],
  });
}
