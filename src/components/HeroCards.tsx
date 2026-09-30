'use client';

import type { RevenueData } from '@/lib/api';
import { formatSol, formatUsd, formatOtc } from '@/lib/utils';

export default function HeroCards({ data }: { data: RevenueData }) {
  const { sol, buyback, otc, volume, desks } = data;

  const cards = [
    {
      label: 'Total Revenue',
      value: formatSol(sol.earned) + ' SOL',
      sub: formatUsd(volume.all, true) + ' all-time volume',
    },
    {
      label: 'Paid to Holders',
      value: formatSol(sol.distributed) + ' SOL',
      sub: '67.5% of every fee → stock rewards',
    },
    {
      label: 'OTC Burned',
      value: formatOtc(buyback.burned + desks.burned) + ' OTC',
      sub: `${buyback.burns.toLocaleString()} burns · ${desks.count.toLocaleString()} desks minted`,
      orange: true,
    },
    {
      label: 'Volume 24h',
      value: formatUsd(volume.d1, true),
      sub: formatUsd(volume.d7, true) + ' past 7 days',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="card">
          <div className="stat-label">{c.label}</div>
          <div className={`stat-value ${c.orange ? 'text-[var(--chart-orange)]' : ''}`}>
            {c.value}
          </div>
          <div className="stat-sub">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
