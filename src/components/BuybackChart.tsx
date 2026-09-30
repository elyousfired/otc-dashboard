'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';
import type { DailyEntry } from '@/lib/api';
import { formatUsdAxis } from '@/lib/utils';

interface Props {
  daily: DailyEntry[];
  otcPrice: number;
}

function fmtDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const bought = payload.find(p => p.dataKey === 'bought')?.value ?? 0;
  const burned = payload.find(p => p.dataKey === 'burned')?.value ?? 0;
  return (
    <div style={{
      background: '#0d0d14',
      border: '1px solid #1a1a2e',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
      minWidth: 160,
    }}>
      <div style={{ color: '#e4e4ed', fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
        <span style={{ color: '#3b82f6' }}>🔵 Bought</span>
        <span style={{ color: '#e4e4ed', fontVariantNumeric: 'tabular-nums' }}>{formatUsdAxis(bought)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ color: '#f59e0b' }}>🟠 Burned</span>
        <span style={{ color: '#e4e4ed', fontVariantNumeric: 'tabular-nums' }}>{formatUsdAxis(burned)}</span>
      </div>
    </div>
  );
}

export default function BuybackChart({ daily, otcPrice }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const data = daily.map((e) => ({
    label: fmtDate(e.day),
    day: e.day,
    bought: Math.round((e.bought / 1e6) * otcPrice),
    burned: Math.round((e.burned / 1e6) * otcPrice),
    isToday: e.day === today,
  }));

  const complete = data.filter((d) => !d.isToday && d.bought > 0);
  const avgBought = complete.length
    ? complete.reduce((s, d) => s + d.bought, 0) / complete.length
    : 0;

  const tickInterval = Math.max(0, Math.floor(data.length / 9));

  return (
    <div className="card">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[14px] font-semibold">Daily buyback & burn</h2>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            What each day spent buying $OTC, beside the value it destroyed.
            Average is per day across {complete.length} complete days.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-[var(--text-muted)]">
            Daily avg{' '}
            <span className="font-semibold text-[var(--text)]">{formatUsdAxis(avgBought)}</span>
          </span>
          <div className="flex items-center gap-3">
            <Legend color="#3b82f6" label="Bought" />
            <Legend color="#f59e0b" label="Burned" />
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={270}>
        <BarChart data={data} barGap={2} barCategoryGap="22%">
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#6b6b80' }}
            axisLine={{ stroke: '#1a1a2e' }}
            tickLine={false}
            interval={tickInterval}
          />
          <YAxis
            tickFormatter={formatUsdAxis}
            tick={{ fontSize: 10, fill: '#6b6b80' }}
            axisLine={false}
            tickLine={false}
            width={58}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          {avgBought > 0 && (
            <ReferenceLine
              y={avgBought}
              stroke="rgba(59,130,246,0.35)"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: `avg/day ${formatUsdAxis(avgBought)}`,
                position: 'insideTopRight',
                fill: '#6b6b80',
                fontSize: 10,
                dy: -8,
              }}
            />
          )}
          <Bar dataKey="bought" radius={[2, 2, 0, 0]} maxBarSize={13}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.isToday ? '#60a5fa' : '#3b82f6'} opacity={0.9} />
            ))}
          </Bar>
          <Bar dataKey="burned" radius={[2, 2, 0, 0]} maxBarSize={13}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.isToday ? '#fbbf24' : '#f59e0b'} opacity={0.9} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: color }} />
      {label}
    </span>
  );
}
