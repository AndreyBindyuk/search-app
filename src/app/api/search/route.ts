import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { SearchItem, SearchResponse } from '@/lib/searchTypes';

export const runtime = 'nodejs';

async function loadData(): Promise<SearchItem[]> {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as SearchItem[];
}

// Simulate variable network latency and occasional errors
function randomDelay(min = 180, max = 800) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  const delay = randomDelay();
  await new Promise((r) => setTimeout(r, delay));

  // Optional: simulate rare error (~3%) to verify error UI
  if (Math.random() < 0.03) {
    return NextResponse.json({ message: 'Randomized error' }, { status: 500 });
  }

  const data = await loadData();

  const items = q
    ? data.filter((it) =>
        it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q)
      )
    : [];

  const body: SearchResponse = { query: q, items };
  return NextResponse.json(body, { status: 200 });
}
