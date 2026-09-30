import { NextResponse } from 'next/server';

// Exact verified historical daily token launch counts from OTC platform (UTC days)
const HISTORICAL_DAILY: Array<{ day: string; count: number }> = [
  { day: '2026-09-01', count: 556 },
  { day: '2026-09-02', count: 1211 },
  { day: '2026-09-03', count: 445 },
  { day: '2026-09-04', count: 232 },
  { day: '2026-09-05', count: 279 },
  { day: '2026-09-06', count: 270 },
  { day: '2026-09-07', count: 2891 },
  { day: '2026-09-08', count: 4746 },
  { day: '2026-09-09', count: 4468 },
  { day: '2026-09-10', count: 3643 },
  { day: '2026-09-11', count: 2121 },
  { day: '2026-09-12', count: 1500 },
  { day: '2026-09-13', count: 468 },
  { day: '2026-09-14', count: 600 },
  { day: '2026-09-15', count: 487 },
  { day: '2026-09-16', count: 127 },
  { day: '2026-09-17', count: 255 },
  { day: '2026-09-18', count: 113 },
  { day: '2026-09-19', count: 144 },
  { day: '2026-09-20', count: 162 },
  { day: '2026-09-21', count: 166 },
  { day: '2026-09-22', count: 145 },
  { day: '2026-09-23', count: 104 },
  { day: '2026-09-24', count: 77 },
  { day: '2026-09-25', count: 37 },
  { day: '2026-09-26', count: 14 },
  { day: '2026-09-27', count: 26 },
  { day: '2026-09-28', count: 18 },
  { day: '2026-09-29', count: 228 },
];

// Total counter value at 2026-09-30T00:00:00Z
const TOTAL_BEFORE_SEP_30 = 25592;

export async function GET() {
  try {
    const res = await fetch('https://otcdesks.cash/api/coins', {
      next: { revalidate: 0 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return NextResponse.json({ error: 'upstream error' }, { status: res.status });
    const data = await res.json();

    const total: number = data.total ?? 0;
    const todayStr = new Date().toISOString().slice(0, 10);
    const launchedSinceSep30 = Math.max(0, total - TOTAL_BEFORE_SEP_30);

    const daily = [
      ...HISTORICAL_DAILY,
      {
        day: todayStr >= '2026-09-30' ? todayStr : '2026-09-30',
        count: launchedSinceSep30,
      },
    ];

    return NextResponse.json(
      { ...data, daily },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
