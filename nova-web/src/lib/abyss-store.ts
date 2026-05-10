import fs from 'node:fs';
import path from 'node:path';

export type Memory = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  timestamp: string;
};

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'abyss.json');

const readStore = (): Memory[] => {
  if (!fs.existsSync(dataFilePath)) return [];
  const raw = fs.readFileSync(dataFilePath, 'utf8');
  try {
    const parsed = JSON.parse(raw) as Memory[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStore = (entries: Memory[]) => {
  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  fs.writeFileSync(dataFilePath, JSON.stringify(entries, null, 2), 'utf8');
};

export function getMemories(): Memory[] {
  return readStore();
}

export function addMemory(entry: Omit<Memory, 'id' | 'timestamp'>): Memory {
  const memories = readStore();
  const newEntry: Memory = {
    ...entry,
    id: Date.now().toString(),
    timestamp: new Date().toLocaleString(),
  };
  memories.unshift(newEntry);
  writeStore(memories);
  return newEntry;
}

export function deleteMemory(id: string): void {
  const memories = readStore();
  writeStore(memories.filter((memory) => memory.id !== id));
}
