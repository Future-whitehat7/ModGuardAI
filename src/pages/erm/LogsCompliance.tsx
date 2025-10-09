import React, { useMemo, useState } from 'react';
import { Download, Filter, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { useERM } from './ERMContext';
import { formatDate } from './utils';

const unique = (values: string[]) => Array.from(new Set(values));

export const LogsCompliance: React.FC = () => {
  const { logs } = useERM();
  const [roleFilter, setRoleFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');
  const [search, setSearch] = useState('');

  const roles = useMemo(() => unique(logs.map((log) => log.role)), [logs]);
  const tags = useMemo(() => unique(logs.map((log) => log.complianceTag)), [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesRole = roleFilter === 'All' || log.role === roleFilter;
      const matchesTag = tagFilter === 'All' || log.complianceTag === tagFilter;
      const matchesSearch = search
        ? `${log.actor} ${log.action} ${log.details}`.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesRole && matchesTag && matchesSearch;
    });
  }, [logs, roleFilter, tagFilter, search]);

  const exportAsCsv = () => {
    const header = ['Timestamp', 'Actor', 'Role', 'Action', 'Target', 'Details', 'Compliance Tag'];
    const rows = filteredLogs.map((log) => [
      new Date(log.timestamp).toISOString(),
      log.actor,
      log.role,
      log.action,
      log.target,
      log.details,
      log.complianceTag,
    ]);
    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'modguardai-logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsPdf = () => {
    const popup = window.open('', '_blank', 'width=900,height=700');
    if (!popup) return;
    popup.document.write(`
      <html>
        <head>
          <title>ModGuardAI Compliance Log</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: #e2e8f0; }
            h1 { font-size: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid rgba(148, 163, 184, 0.4); padding: 8px; font-size: 12px; }
            th { background: rgba(56, 189, 248, 0.1); }
          </style>
        </head>
        <body>
          <h1>ModGuardAI Compliance Log Export</h1>
          <p>Generated ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Role</th>
                <th>Action</th>
                <th>Target</th>
                <th>Details</th>
                <th>Compliance Tag</th>
              </tr>
            </thead>
            <tbody>
              ${filteredLogs
                .map(
                  (log) => `
                  <tr>
                    <td>${new Date(log.timestamp).toLocaleString()}</td>
                    <td>${log.actor}</td>
                    <td>${log.role}</td>
                    <td>${log.action}</td>
                    <td>${log.target}</td>
                    <td>${log.details}</td>
                    <td>${log.complianceTag}</td>
                  </tr>
                `,
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Logs & compliance</h1>
          <p className="mt-1 text-sm text-slate-400">
            Every action is captured to maintain an immutable audit trail for governance and regulatory review.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-300" /> Chain-of-custody intact
          </span>
          <a
            href="https://modguard.ai/privacy"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-slate-300 transition hover:border-cyan-500 hover:text-cyan-200"
          >
            <LinkIcon className="h-4 w-4 text-cyan-300" /> Privacy policy
          </a>
        </div>
      </header>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <label className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-2">
              <Filter className="h-4 w-4 text-cyan-300" />
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="bg-transparent text-slate-100 focus:outline-none"
              >
                <option value="All">All roles</option>
                {roles.map((role) => (
                  <option key={role} value={role} className="bg-slate-900">
                    {role}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-2">
              <Filter className="h-4 w-4 text-cyan-300" />
              <select
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                className="bg-transparent text-slate-100 focus:outline-none"
              >
                <option value="All">All tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag} className="bg-slate-900">
                    {tag}
                  </option>
                ))}
              </select>
            </label>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search actions or details"
              className="rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 text-xs text-slate-300">
            <button
              onClick={exportAsCsv}
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 transition hover:border-cyan-500 hover:text-cyan-200"
            >
              <Download className="h-4 w-4 text-cyan-300" /> Export CSV
            </button>
            <button
              onClick={exportAsPdf}
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 transition hover:border-cyan-500 hover:text-cyan-200"
            >
              <Download className="h-4 w-4 text-amber-300" /> Export PDF
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr className="border-b border-slate-900/60">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Compliance tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDate(log.timestamp)}</td>
                  <td className="px-4 py-3 text-slate-200">{log.actor}</td>
                  <td className="px-4 py-3 text-slate-400">{log.role}</td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3 text-slate-400">{log.target}</td>
                  <td className="px-4 py-3 text-slate-400">{log.details}</td>
                  <td className="px-4 py-3 text-slate-400">{log.complianceTag}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                    No log entries match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
