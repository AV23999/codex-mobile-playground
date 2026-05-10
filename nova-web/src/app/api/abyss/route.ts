import { NextResponse } from 'next/server';
import { addMemory, deleteMemory, getMemories } from '@/lib/abyss-store';

export async function GET() {
  return NextResponse.json(getMemories());
}

export async function POST(request: Request) {
  const body = await request.json();
  const title = typeof body?.title === 'string' ? body.title : '';
  const category = typeof body?.category === 'string' ? body.category : 'General';
  const excerpt = typeof body?.excerpt === 'string' ? body.excerpt : '';
  const content = typeof body?.content === 'string' ? body.content : excerpt;

  if (!title.trim() || !excerpt.trim()) {
    return NextResponse.json(
      { error: 'Title and excerpt are required' },
      { status: 400 },
    );
  }

  const newEntry = addMemory({ title, category, excerpt, content });
  return NextResponse.json(newEntry, { status: 201 });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const id = typeof body?.id === 'string' ? body.id : '';

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  deleteMemory(id);
  return NextResponse.json({ ok: true });
}
