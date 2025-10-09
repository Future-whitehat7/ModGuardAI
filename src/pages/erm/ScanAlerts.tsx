import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CircleDashed,
  Download,
  Loader2,
  Play,
  ShieldAlert,
} from 'lucide-react';
import { useERM } from './ERMContext';
import { AlertRecord, ExecutiveProfile } from './types';
import { formatDate, formatRisk } from './utils';

const statusStyles: Record<string, string> = {
  Open: 'bg-rose-500/10 text-rose-300 border border-rose-500/40',
  'In Review': 'bg-amber-500/10 text-amber-300 border border-amber-500/40',
  Resolved: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40',
  'False Positive': 'bg-slate-700/40 text-slate-200 border border-slate-600/60',
};

export const ScanAlerts: React.FC = () => {
  const {
    alerts,
    profiles,
    startScan,
    updateAlertStatus,
    markAlertFalsePositive,
    logAction,
    role,
  } = useERM();
  const location = useLocation();
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [assignUser, setAssignUser] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Review' | 'Resolved' | 'False Positive'>('All');
  const actionable = role === 'Admin' || role === 'Analyst';
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const alertId = params.get('alert');
    if (alertId) {
      setSelectedAlertId(alertId);
    }
  }, [location.search]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => (statusFilter === 'All' ? true : alert.status === statusFilter));
  }, [alerts, statusFilter]);

  const selectedAlert = filteredAlerts.find((alert) => alert.id === selectedAlertId) ?? filteredAlerts[0] ?? null;

  useEffect(() => {
    if (filteredAlerts.length && !selectedAlertId) {
      setSelectedAlertId(filteredAlerts[0].id);
    }
  }, [filteredAlerts, selectedAlertId]);

  const profileLookup = useMemo(() => {
    const map = new Map<string, ExecutiveProfile>();
    profiles.forEach((profile) => map.set(profile.id, profile));
    return map;
  }, [profiles]);

  const handleStartScan = async () => {
    setIsScanning(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    startScan();
    setIsScanning(false);
  };

  const handleAssign = (alert: AlertRecord) => {
    if (!actionable) return;
    if (!assignUser.trim()) return;
    updateAlertStatus(alert.id, alert.status, { assignedTo: assignUser.trim() });
    logAction({
      actor: assignUser.trim(),
      action: 'Assigned to alert',
      target: `Alert #${alert.id.slice(-6)}`,
      details: 'Analyst assigned for deeper review.',
      complianceTag: 'Alert handling',
      role,
    });
    setAssignUser('');
  };

  const handleStatusChange = (alert: AlertRecord, status: AlertRecord['status']) => {
    if (!actionable) return;
    updateAlertStatus(alert.id, status);
  };

  const handleFalsePositive = (alert: AlertRecord) => {
    if (!actionable) return;
    markAlertFalsePositive(alert.id, 'Analyst confirmed reference asset mismatch.');
  };

  const assignable = actionable;

  const generateTakedownPacket = (alert: AlertRecord) => {
    if (!actionable) return;
    const profile = profileLookup.get(alert.profileId);
    const payload = {
      alertId: alert.id,
      profile: profile?.fullName,
      platform: alert.platform,
      riskScore: alert.riskScore,
      generatedAt: new Date().toISOString(),
    };
    logAction({
      actor: 'System',
      action: 'Generated takedown packet',
      target: `Alert #${alert.id.slice(-6)}`,
      details: JSON.stringify(payload, null, 2),
      complianceTag: 'Legal response',
      role,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-slate-100">Scan & alerts</h1>
              <p className="text-xs text-slate-500">Trigger synthetic media detection sweeps and manage triage.</p>
            </div>
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Start scan
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-cyan-300" /> Synthetic media engine ready
            </div>
            <div>Viewer role is read-only. Analysts/Admins can action alerts.</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Alert queue</div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All statuses</option>
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
              <option value="False Positive">False Positive</option>
            </select>
          </div>
          <div className="divide-y divide-slate-900/60">
            {filteredAlerts.map((alert) => {
              const profile = profileLookup.get(alert.profileId);
              const isSelected = selectedAlert?.id === alert.id;
              return (
                <button
                  key={alert.id}
                  className={`w-full px-6 py-4 text-left transition ${
                    isSelected ? 'bg-cyan-500/10 shadow-inner shadow-cyan-900/30' : 'hover:bg-slate-900/40'
                  }`}
                  onClick={() => setSelectedAlertId(alert.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                        <AlertOctagon className="h-4 w-4 text-amber-300" />
                        {profile?.fullName ?? 'Unknown profile'}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {alert.platform} • {formatDate(alert.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[alert.status]}`}>
                        {alert.status}
                      </span>
                      <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
                        {formatRisk(alert.riskScore)}
                      </span>
                    </div>
                  </div>
                  {alert.assignedTo && (
                    <div className="mt-2 text-xs text-slate-500">Assigned to {alert.assignedTo}</div>
                  )}
                </button>
              );
            })}
            {filteredAlerts.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                No alerts match this filter. Run a scan to populate new incidents.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/60">
        {selectedAlert ? (
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-900/60 px-8 py-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Alert detail</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-50">{formatRisk(selectedAlert.riskScore)} risk</div>
                  <div className="text-sm text-slate-400">
                    {profileLookup.get(selectedAlert.profileId)?.fullName} • {selectedAlert.platform}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {(['Open', 'In Review', 'Resolved'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedAlert, status)}
                      disabled={!actionable}
                      className={`rounded-full border px-3 py-1 font-semibold transition ${
                        selectedAlert.status === status
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200'
                          : 'border-slate-800 text-slate-400 hover:border-cyan-500 hover:text-cyan-200'
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid flex-1 gap-6 overflow-y-auto px-8 py-6 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <ShieldAlert className="h-4 w-4 text-cyan-300" /> Detection summary
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{selectedAlert.detection.summary}</p>
                  <div className="mt-4 text-xs text-slate-500">
                    Confidence score:{' '}
                    <span className="font-semibold text-cyan-200">{Math.round(selectedAlert.detection.confidence * 100)}%</span>
                  </div>
                  <div className="mt-4 space-y-2 text-xs">
                    {selectedAlert.detection.breakdown.map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>{item.label}</span>
                          <span className="text-slate-200">{Math.round(item.score * 100)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                            style={{ width: `${Math.min(Math.round(item.score * 100), 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <CircleDashed className="h-4 w-4 text-amber-300" /> Frame anomalies
                  </div>
                  <div className="mt-4 space-y-3 text-xs">
                    {selectedAlert.detection.anomalies.map((anomaly) => (
                      <div
                        key={anomaly.id}
                        className="rounded-xl border border-slate-800/80 bg-slate-950/40 px-4 py-3"
                      >
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Frame {anomaly.frame}</span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                              anomaly.severity === 'High'
                                ? 'bg-rose-500/10 text-rose-300'
                                : anomaly.severity === 'Medium'
                                ? 'bg-amber-500/10 text-amber-300'
                                : 'bg-emerald-500/10 text-emerald-300'
                            }`}
                          >
                            {anomaly.severity}
                          </span>
                        </div>
                        <p className="mt-2 text-slate-400">{anomaly.description}</p>
                      </div>
                    ))}
                    {selectedAlert.detection.anomalies.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-6 text-center text-slate-500">
                        No anomalies detected. Monitor for new frames.
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-5">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Action panel</div>
                  <div className="mt-4 space-y-3 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <BadgeCheck className="h-4 w-4 text-emerald-300" /> Assign to analyst
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={assignUser}
                          onChange={(event) => setAssignUser(event.target.value)}
                          placeholder="Analyst name"
                          disabled={!assignable}
                          className="flex-1 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
                        />
                        <button
                          onClick={() => handleAssign(selectedAlert)}
                          disabled={!assignable || !assignUser.trim()}
                          className="rounded-lg border border-cyan-500 px-3 py-2 font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFalsePositive(selectedAlert)}
                      disabled={!actionable}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-left text-slate-300 transition hover:border-rose-500/40 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-rose-300" /> Mark false positive
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => generateTakedownPacket(selectedAlert)}
                      disabled={!actionable}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-left text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-cyan-300" /> Generate takedown packet
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        logAction({
                          actor: role,
                          action: 'Logged manual action',
                          target: `Alert #${selectedAlert.id.slice(-6)}`,
                          details: 'Analyst note stored for compliance.',
                          complianceTag: 'Chain-of-custody',
                        })
                      }
                      className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-left text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
                    >
                      <span className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-slate-300" /> Log manual action
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-5 text-xs text-slate-400">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <ShieldAlert className="h-4 w-4 text-cyan-300" /> Chain-of-custody notes
                  </div>
                  <p className="mt-3">
                    Evidence captured and stored in immutable audit log. Link reference clips and export logs via compliance
                    center for regulatory review.
                  </p>
                </section>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-10 text-sm text-slate-500">
            Select an alert from the queue to review detection details.
          </div>
        )}
      </div>
    </div>
  );
};
