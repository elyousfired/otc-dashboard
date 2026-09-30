'use client';

import type { RewardsData } from '@/lib/api';
import { formatCompact } from '@/lib/utils';

export default function StatsBar({ rewards, totalCoins }: { rewards: RewardsData; totalCoins: number }) {
  const stats = [
    { label: 'Coins launched', value: formatCompact(totalCoins) },
    { label: 'Paying coins', value: formatCompact(rewards.paying) },
    { label: 'Distributions', value: formatCompact(rewards.payouts) },
    { label: 'Wallets paid', value: formatCompact(rewards.holdersPaid) },
    { label: 'Reward assets', value: rewards.assets.toString() },
  ];

  return (
    <div className="card flex flex-wrap items-center justify-between gap-4">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="tnum text-[20px] font-semibold">{s.value}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
