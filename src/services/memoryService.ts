// N.O.V.A Memory Service — Persistent cross-session memory
// Uses AsyncStorage to remember facts, preferences, and context about the user

import AsyncStorage from '@react-native-async-storage/async-storage';

const MEMORY_KEY = 'nova_memory_v2';
const MAX_MEMORIES = 80;

export type MemoryEntry = {
  id: string;
  content: string;
  timestamp: number;
  category: 'preference' | 'fact' | 'project' | 'general';
};

export async function saveMemory(content: string, category: MemoryEntry['category'] = 'general'): Promise<void> {
  const existing = await loadAllMemories();
  const entry: MemoryEntry = {
    id: `mem-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
    content,
    timestamp: Date.now(),
    category,
  };
  const updated = [entry, ...existing].slice(0, MAX_MEMORIES);
  await AsyncStorage.setItem(MEMORY_KEY, JSON.stringify(updated));
}

export async function loadAllMemories(): Promise<MemoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(MEMORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function deleteMemory(id: string): Promise<void> {
  const existing = await loadAllMemories();
  await AsyncStorage.setItem(MEMORY_KEY, JSON.stringify(existing.filter(m => m.id !== id)));
}

export async function clearAllMemories(): Promise<void> {
  await AsyncStorage.removeItem(MEMORY_KEY);
}

export async function buildMemoryContext(): Promise<string> {
  const memories = await loadAllMemories();
  if (memories.length === 0) return '';
  const lines = memories
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 30)
    .map(m => `- [${m.category}] ${m.content}`);
  return `\n\n=== WHAT N.O.V.A REMEMBERS ABOUT THE USER ===\n${lines.join('\n')}\n=== END MEMORY ===`;
}

// Auto-extract and save memory from conversation
export function extractMemoryFromMessage(userText: string): { shouldSave: boolean; content: string; category: MemoryEntry['category'] } | null {
  const lower = userText.toLowerCase();
  // Explicit remember request
  if (lower.startsWith('remember') || lower.includes('please remember') || lower.includes('don\'t forget')) {
    const content = userText.replace(/^remember\s*/i, '').replace(/please remember\s*/i, '').trim();
    return { shouldSave: true, content, category: 'general' };
  }
  // Project mentions
  if (lower.includes('i\'m working on') || lower.includes('i am working on') || lower.includes('my project')) {
    return { shouldSave: true, content: userText, category: 'project' };
  }
  // Preferences
  if (lower.includes('i prefer') || lower.includes('i like') || lower.includes('i love') || lower.includes('i hate') || lower.includes('i always')) {
    return { shouldSave: true, content: userText, category: 'preference' };
  }
  // Personal facts
  if (lower.includes('my name is') || lower.includes('i am a') || lower.includes('i\'m a') || lower.includes('i live in') || lower.includes('i work as')) {
    return { shouldSave: true, content: userText, category: 'fact' };
  }
  return null;
}
