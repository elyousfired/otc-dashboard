'use client';

import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import type { DailyEntry } from '@/lib/api';
import { formatUsdAxis } from '@/lib/utils';

function fmtDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const COLORS = {
  toHolders:  '#3b82f6',
  toPot:      '#8b5cf6',
  toBuyback:  '#f59e0b',
  toProtocol: '#6b7280',
};

const LABELS: Record<string, string> = {
  toHolders:  'To Holders',
  toPot:      'Desk Pot',
  toBuyback:  'Buyback',
  toProtocol: 'Protocol',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div style={{
      background: '#0d0d14',
      border: '1px solid #1a1a2e',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
      minWidth: 180,
    }}>
      <div style={{ color: '#e4e4ed', fontWeight: 600, marginBottom: 8 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 3 }}>
          <span style={{ color: p.color }}>{LABELS[p.dataKey] || p.dataKey}</span>
          <span style={{ color: '#e4e4ed', fontVariantNumeric: 'tabular-nums' }}>
            {formatUsdAxis(p.value)}
          </span>
        </div>
      ))}
      <div style={{ borderTop: '1px solid #1a1a2e', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#6b6b80' }}>Total</span>
        <span style={{ color: '#e4e4ed', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {formatUsdAxis(total)}
        </span>
      </div>
    </div>
  );
}

export default function RevenueChart({ daily, otcPrice }: { daily: DailyEntry[]; otcPrice: number }) {
  const data = daily.map((e) => ({
    label: fmtDate(e.day),
    toHolders:  Math.round((e.toHolders  / 1e6) * otcPrice * 170), // approx SOL→USD using ~170 SOL price
    toPot:      Math.round((e.toPot      / 1e6) * otcPrice * 170),
    toBuyback:  Math.round((e.toBuyback  / 1e6) * otcPrice * 170),
    toProtocol: Math.round((e.toProtocol / 1e6) * otcPrice * 170),
  }));

  // Use lamports directly divided by 1e6 to get SOL, then display as SOL
  const dataSOL = daily.map((e) => ({
    label: fmtDate(e.day),
    day: e.day,
    toHolders:  Math.round(e.toHolders  / 1e6),
    toPot:      Math.round(e.toPot      / 1e6),
    toBuyback:  Math.round(e.toBuyback  / 1e6),
    toProtocol: Math.round(e.toProtocol / 1e6),
  }));

  const tickInterval = Math.max(0, Math.floor(dataSOL.length / 8) - 1);

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-[14px] font-semibold">Daily revenue breakdown</h2>
        <p className="mt-1 text-[11px] text-[var(--text-muted)]">
          How each day's fees were distributed — in SOL
        </p>
      </div>
      <ResponsiveContainer width="100%" height={270}>
        <ComposedChart data={dataSOL} barCategoryGap="20%" barGap={1}>
          <CartesianGrid vertical={false} stroke="#1a1a2e" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#6b6b80' }}
            axisLine={{ stroke: '#1a1a2e' }}
            tickLine={false}
            interval={tickInterval}
          />
          <YAxis
            tickFormatter={(v) => `${v} SOL`}
            tick={{ fontSize: 10, fill: '#6b6b80' }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
            formatter={(v) => LABELS[v] || v}
          />
          <Bar dataKey="toHolders"  stackId="a" fill={COLORS.toHolders}  radius={[0,0,0,0]} maxBarSize={20} />
          <Bar dataKey="toPot"      stackId="a" fill={COLORS.toPot}      maxBarSize={20} />
          <Bar dataKey="toBuyback"  stackId="a" fill={COLORS.toBuyback}  maxBarSize={20} />
          <Bar dataKey="toProtocol" stackId="a" fill={COLORS.toProtocol} radius={[2,2,0,0]} maxBarSize={20} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
