import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Play, ShieldCheck, UserPlus2 } from 'lucide-react';
import { useERM } from './ERMContext';
import { formatDate, formatRisk } from './utils';

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { profiles, alerts, averageRisk, startScan } = useERM();

  const recentAlerts = alerts.slice(0, 4);
  const openAlerts = alerts.filter((alert) => alert.status === 'Open');

  const metrics = [
    {
      label: 'Profiles Monitored',
      value: profiles.length,
      change: '+2 this week',
    },
    {
      label: 'Active Alerts',
      value: openAlerts.length,
      change: `${Math.max(openAlerts.length - 2, 0)} escalations pending`,
    },
    {
      label: 'Average Risk Score',
      value: formatRisk(averageRisk),
      change: 'Across last 24h scans',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-2xl shadow-cyan-900/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">Executive Risk Monitor</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-50 md:text-4xl">
              Real-time deepfake intelligence for executive protection teams
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-400">
              Monitor high-value leaders, run synthetic media sweeps, and coordinate rapid takedowns from one secure control
              plane.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <button
                onClick={() => startScan()}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 font-medium text-cyan-200 transition hover:bg-cyan-500/20"
              >
                <Play className="h-4 w-4" /> Start Global Scan
              </button>
              <button
                onClick={() => navigate('/erm/watchlist')}
                className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 font-medium text-slate-300 transition hover:border-cyan-500 hover:text-cyan-200"
              >
                <UserPlus2 className="h-4 w-4" /> Add Executive Profile
              </button>
            </div>
          </div>
          <div className="flex w-full max-w-sm items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="w-full">
              <div className="text-xs uppercase tracking-wider text-slate-500">Threat posture</div>
              <div className="mt-4 h-40 w-full rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-4">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Average risk</div>
                    <div className="mt-1 text-4xl font-semibold text-slate-50">{formatRisk(averageRisk)}</div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Voice cloning</span>
                      <span className="text-cyan-300">High watch</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Face morphing</span>
                      <span className="text-amber-300">Elevated</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Metadata tampering</span>
                      <span className="text-emerald-300">Stable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-inner shadow-slate-900/60"
          >
            <div className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</div>
            <div className="mt-3 text-3xl font-semibold text-slate-50">{metric.value}</div>
            <div className="mt-4 text-xs text-slate-500">{metric.change}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">Recent alerts</h2>
              <button
                onClick={() => navigate('/erm/scan')}
                className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                View all alerts
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {recentAlerts.map((alert) => {
                const profile = profiles.find((item) => item.id === alert.profileId);
                return (
                  <div
                    key={alert.id}
                    className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4 transition hover:border-cyan-500/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <AlertTriangle className="h-4 w-4 text-amber-300" />
                          <span>{profile?.fullName ?? 'Unknown profile'}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {alert.platform} • {formatDate(alert.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-rose-500/10 px-3 py-1 text-sm font-semibold text-rose-300">
                          {formatRisk(alert.riskScore)} risk
                        </span>
                        <button
                          onClick={() => navigate(`/erm/scan?alert=${alert.id}`)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
                        >
                          Inspect <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{alert.detection.summary}</p>
                  </div>
                );
              })}
              {recentAlerts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center text-sm text-slate-500">
                  No alerts in the last 24 hours. Continue monitoring to maintain coverage.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="text-lg font-semibold text-slate-100">Compliance snapshot</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                SOC2 controls enforced • Audit trail enabled
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                Privacy impact assessment updated May 2024
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                Legal takedown templates ready for 15 jurisdictions
              </li>
            </ul>
            <button
              onClick={() => navigate('/erm/logs')}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:border-cyan-400"
            >
              Review evidence trail
            </button>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="text-lg font-semibold text-slate-100">Rapid actions</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <button
                onClick={() => navigate('/erm/scan')}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-900 bg-slate-900/40 px-4 py-3 transition hover:border-cyan-500/40"
              >
                <span>View incident queue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/erm/watchlist')}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-900 bg-slate-900/40 px-4 py-3 transition hover:border-cyan-500/40"
              >
                <span>Manage executive profiles</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/erm/voice')}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-900 bg-slate-900/40 px-4 py-3 transition hover:border-cyan-500/40"
              >
                <span>Configure voice alerts</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
