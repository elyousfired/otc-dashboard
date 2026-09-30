'use client';

import {
  ComposedChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { DailyEntry } from '@/lib/api';
import { formatOtc } from '@/lib/utils';

function fmtDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fmtSolVal(v: number) {
  return `${v.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} SOL`;
}

const COLORS = {
  toHolders: '#3b82f6',
  toPot: '#8b5cf6',
  toBuyback: '#f59e0b',
  toProtocol: '#6b7280',
};

const LABELS: Record<string, string> = {
  toHolders: 'To Holders',
  toPot: 'Desk Pot',
  toBuyback: 'Buyback',
  toProtocol: 'Protocol',
};

interface BreakdownTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
}

function BreakdownTooltip({ active, payload, label }: BreakdownTooltipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div
      style={{
        background: '#0d0d14',
        border: '1px solid #1a1a2e',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 12,
        minWidth: 195,
      }}
    >
      <div style={{ color: '#e4e4ed', fontWeight: 600, marginBottom: 8 }}>
        {label}
      </div>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 3,
          }}
        >
          <span style={{ color: p.color }}>
            {LABELS[p.dataKey] || p.dataKey}
          </span>
          <span
            style={{
              color: '#e4e4ed',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fmtSolVal(p.value)}
          </span>
        </div>
      ))}
      <div
        style={{
          borderTop: '1px solid #1a1a2e',
          marginTop: 6,
          paddingTop: 6,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: '#6b6b80' }}>Total</span>
        <span
          style={{
            color: '#e4e4ed',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {fmtSolVal(total)}
        </span>
      </div>
    </div>
  );
}

interface DayByDayTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { label: string; spentSol: number; burnedRaw: number };
  }>;
}

function DayByDayTooltip({ active, payload }: DayByDayTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div
      style={{
        background: '#0d0d14',
        border: '1px solid #1a1a2e',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 12,
        minWidth: 185,
      }}
    >
      <div style={{ color: '#e4e4ed', fontWeight: 600, marginBottom: 8 }}>
        {item.label}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 4,
        }}
      >
        <span style={{ color: '#3b82f6' }}>SOL Deployed</span>
        <span
          style={{
            color: '#e4e4ed',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {fmtSolVal(item.spentSol)}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ color: '#f59e0b' }}>OTC Destroyed</span>
        <span
          style={{
            color: '#e4e4ed',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatOtc(item.burnedRaw)} OTC
        </span>
      </div>
    </div>
  );
}

export default function RevenueChart({
  daily,
  totalBuybackSpent,
}: {
  daily: DailyEntry[];
  otcPrice?: number;
  totalBuybackSpent?: number;
}) {
  const today = new Date().toISOString().slice(0, 10);

  // 1 SOL = 1e9 lamports (9 decimals)
  const dataSOL = daily.map((e) => ({
    label: fmtDate(e.day),
    day: e.day,
    toHolders: Number((e.toHolders / 1e9).toFixed(2)),
    toPot: Number((e.toPot / 1e9).toFixed(2)),
    toBuyback: Number((e.toBuyback / 1e9).toFixed(2)),
    toProtocol: Number((e.toProtocol / 1e9).toFixed(2)),
    spentSol: Number((e.spent / 1e9).toFixed(2)),
    burnedRaw: e.burned,
    isToday: e.day === today,
  }));

  const daysWithSpent = daily.filter((e) => e.spent > 0).length;
  const totalSpentLamports =
    totalBuybackSpent ?? daily.reduce((s, e) => s + e.spent, 0);
  const avgSpentSol =
    daysWithSpent > 0 ? totalSpentLamports / 1e9 / daysWithSpent : 0;

  const totalEarnedSol = daily.reduce((s, e) => s + e.earned / 1e9, 0);
  const avgEarnedSol = daily.length > 0 ? totalEarnedSol / daily.length : 0;

  const tickInterval = Math.max(0, Math.floor(dataSOL.length / 8) - 1);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Left: Daily revenue breakdown in SOL */}
      <div className="card">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-[14px] font-semibold">
              Daily revenue breakdown
            </h2>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">
              How each day&apos;s fees were distributed — in SOL
            </p>
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            Average{' '}
            <span className="tnum font-semibold text-[var(--text)]">
              {avgEarnedSol.toFixed(1)} SOL
            </span>
            /day
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={dataSOL} barCategoryGap="20%" barGap={1}>
            <CartesianGrid
              vertical={false}
              stroke="#1a1a2e"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#6b6b80' }}
              axisLine={{ stroke: '#1a1a2e' }}
              tickLine={false}
              interval={tickInterval}
            />
            <YAxis
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(1)}K SOL` : `${v} SOL`
              }
              tick={{ fontSize: 10, fill: '#6b6b80' }}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <Tooltip
              content={<BreakdownTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              formatter={(v) => LABELS[v] || v}
            />
            <Bar
              dataKey="toHolders"
              stackId="a"
              fill={COLORS.toHolders}
              radius={[0, 0, 0, 0]}
              maxBarSize={18}
            />
            <Bar
              dataKey="toPot"
              stackId="a"
              fill={COLORS.toPot}
              maxBarSize={18}
            />
            <Bar
              dataKey="toBuyback"
              stackId="a"
              fill={COLORS.toBuyback}
              maxBarSize={18}
            />
            <Bar
              dataKey="toProtocol"
              stackId="a"
              fill={COLORS.toProtocol}
              radius={[2, 2, 0, 0]}
              maxBarSize={18}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Right: Day by day SOL spent buying OTC (exact match with OTC revenue page) */}
      <div className="card">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-[14px] font-semibold">
              Day by day (SOL spent on buybacks)
            </h2>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">
              SOL spent buying OTC each day. Everything bought is burned, so
              this is also what was destroyed.
            </p>
          </div>
          <span className="shrink-0 text-[11px] text-[var(--text-muted)]">
            Average{' '}
            <span className="tnum font-semibold text-[var(--text)]">
              {avgSpentSol.toFixed(2)} SOL
            </span>{' '}
            across {daysWithSpent} days
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dataSOL} barCategoryGap="20%">
            <CartesianGrid
              vertical={false}
              stroke="#1a1a2e"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#6b6b80' }}
              axisLine={{ stroke: '#1a1a2e' }}
              tickLine={false}
              interval={tickInterval}
            />
            <YAxis
              tickFormatter={(v: number) => `${v} SOL`}
              tick={{ fontSize: 10, fill: '#6b6b80' }}
              axisLine={false}
              tickLine={false}
              width={58}
            />
            <Tooltip
              content={<DayByDayTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            {avgSpentSol > 0 && (
              <ReferenceLine
                y={avgSpentSol}
                stroke="rgba(245,158,11,0.45)"
                strokeDasharray="6 4"
                strokeWidth={1.5}
                label={{
                  value: `avg ${avgSpentSol.toFixed(2)} SOL`,
                  position: 'insideTopRight',
                  fill: '#6b6b80',
                  fontSize: 10,
                  dy: -8,
                }}
              />
            )}
            <Bar dataKey="spentSol" radius={[3, 3, 0, 0]} maxBarSize={18}>
              {dataSOL.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.isToday ? '#fbbf24' : '#f59e0b'}
                  opacity={d.isToday ? 1 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
