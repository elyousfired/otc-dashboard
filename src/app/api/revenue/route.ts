import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://otcdesks.cash/api/revenue', {
      next: { revalidate: 0 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return NextResponse.json({ error: 'upstream error' }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
