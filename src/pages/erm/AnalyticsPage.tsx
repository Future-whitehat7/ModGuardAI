import React, { useMemo, useState } from 'react';
import { CalendarRange, PieChart, TrendingUp } from 'lucide-react';
import { useERM } from './ERMContext';
import { formatRisk } from './utils';

const ranges = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 14 days', value: '14' },
  { label: 'Last 30 days', value: '30' },
];

export const AnalyticsPage: React.FC = () => {
  const { scanMetrics, platformMetrics, alerts } = useERM();
  const [selectedRange, setSelectedRange] = useState('7');

  const filteredScans = useMemo(() => {
    const days = parseInt(selectedRange, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return scanMetrics.filter((metric) => new Date(metric.date) >= cutoff).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [scanMetrics, selectedRange]);

  const totalScans = filteredScans.reduce((sum, metric) => sum + metric.scans, 0);
  const averageRisk = filteredScans.length
    ? Math.round((filteredScans.reduce((sum, metric) => sum + metric.averageRisk, 0) / filteredScans.length) * 10) / 10
    : 0;

  const maxScanCount = Math.max(...filteredScans.map((metric) => metric.scans), 10);

  const linePath = useMemo(() => {
    if (filteredScans.length <= 1) return '';
    return filteredScans
      .map((metric, index) => {
        const x = (index / (filteredScans.length - 1)) * 100;
        const y = 100 - (metric.scans / maxScanCount) * 100;
        return `${x},${y}`;
      })
      .join(' ');
  }, [filteredScans, maxScanCount]);

  const totalPlatformCount = platformMetrics.reduce((sum, metric) => sum + metric.count, 0);

  const highSeverity = alerts.filter((alert) => alert.riskScore >= 75);
  const resolved = alerts.filter((alert) => alert.status === 'Resolved');

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Analytics & insights</h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitor detection volume, risk trends, and platform exposure to inform executive protection strategies.
          </p>
        </div>
        <label className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm text-slate-200">
          <CalendarRange className="h-4 w-4 text-cyan-300" />
          <span className="text-xs uppercase tracking-wide text-slate-500">Range</span>
          <select
            value={selectedRange}
            onChange={(event) => setSelectedRange(event.target.value)}
            className="bg-transparent text-sm text-slate-100 focus:outline-none"
          >
            {ranges.map((range) => (
              <option key={range.value} value={range.value} className="bg-slate-900">
                {range.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">Total scans</div>
          <div className="mt-3 text-3xl font-semibold text-slate-50">{totalScans}</div>
          <div className="mt-4 text-xs text-slate-500">Across selected period</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">Average risk</div>
          <div className="mt-3 text-3xl font-semibold text-slate-50">{formatRisk(averageRisk)}</div>
          <div className="mt-4 text-xs text-slate-500">Weighted by detection results</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">High severity alerts</div>
          <div className="mt-3 text-3xl font-semibold text-slate-50">{highSeverity.length}</div>
          <div className="mt-4 text-xs text-slate-500">Resolved {resolved.length}</div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Scans over time</h2>
              <p className="text-xs text-slate-500">Monitor cadence and coverage of detection sweeps.</p>
            </div>
            <TrendingUp className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="mt-6 h-64 rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4">
            {filteredScans.length > 1 ? (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                <polyline
                  points={linePath}
                  fill="none"
                  stroke="url(#scanGradient)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="scanGradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </svg>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Not enough data to visualise trend.
              </div>
            )}
          </div>
          <div className="mt-4 grid gap-3 text-xs text-slate-400 md:grid-cols-4">
            {filteredScans.map((metric) => (
              <div key={metric.date} className="rounded-xl border border-slate-900/60 bg-slate-950/40 px-3 py-2">
                <div className="text-slate-200">{new Date(metric.date).toLocaleDateString()}</div>
                <div className="mt-1 text-slate-400">{metric.scans} scans</div>
                <div className="text-[10px] uppercase text-slate-500">Avg risk {formatRisk(metric.averageRisk)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">Platform distribution</h2>
              <PieChart className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {platformMetrics.map((metric) => {
                const percentage = totalPlatformCount ? Math.round((metric.count / totalPlatformCount) * 100) : 0;
                return (
                  <div key={metric.platform}>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{metric.platform}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-900">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-300">
            <h2 className="text-lg font-semibold text-slate-100">Operational insights</h2>
            <ul className="mt-4 space-y-3 text-xs text-slate-400">
              <li>Escalate platforms exceeding 30% of total incidents.</li>
              <li>Balance scan frequency to maintain consistent risk baseline.</li>
              <li>Feed resolved alerts into training data to reduce false positives.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
