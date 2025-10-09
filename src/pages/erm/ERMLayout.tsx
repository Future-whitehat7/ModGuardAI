import React, { ReactNode, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ActivitySquare,
  AlertTriangle,
  BarChart3,
  BellRing,
  FileText,
  Home,
  Menu,
  PhoneCall,
  ShieldCheck,
  UserCog,
  X,
} from 'lucide-react';
import { useERM } from './ERMContext';

interface ERMLayoutProps {
  children: ReactNode;
}

const navigation = [
  { label: 'Home', to: '/erm', icon: Home },
  { label: 'Watchlist', to: '/erm/watchlist', icon: ShieldCheck },
  { label: 'Scan & Alerts', to: '/erm/scan', icon: AlertTriangle },
  { label: 'Analytics', to: '/erm/analytics', icon: BarChart3 },
  { label: 'Logs & Compliance', to: '/erm/logs', icon: FileText },
  { label: 'Voice Alerts', to: '/erm/voice', icon: PhoneCall },
];

export const ERMLayout: React.FC<ERMLayoutProps> = ({ children }) => {
  const { role, setRole, alerts, profiles } = useERM();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openAlerts = alerts.filter((alert) => alert.status === 'Open').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-800 bg-slate-950/95 backdrop-blur-lg transition-transform duration-300 lg:static lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-6">
            <div>
              <div className="text-sm uppercase tracking-widest text-cyan-400">ModGuardAI</div>
              <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-100">
                <ActivitySquare className="h-5 w-5 text-cyan-400" />
                ERM Console
              </div>
            </div>
            <button
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-2 space-y-1 px-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive: navActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      navActive || isActive
                        ? 'bg-cyan-500/10 text-cyan-300 shadow-lg shadow-cyan-900/20'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900/80 text-cyan-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                  {item.to === '/erm/scan' && openAlerts > 0 && (
                    <span className="ml-auto rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-semibold text-rose-50">
                      {openAlerts}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-10 border-t border-slate-800 px-6 py-6 text-xs text-slate-500">
            Secure. Auditable. Real-time threat intelligence for {profiles.length} executives.
          </div>
        </aside>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl border border-slate-800 p-2 text-slate-300 transition hover:border-cyan-500 hover:text-cyan-300 lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Toggle navigation"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <div className="text-xs uppercase tracking-widest text-slate-500">Executive Risk Monitor</div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    <span>{profiles.length} watchlisted profiles</span>
                    <span className="text-slate-600">•</span>
                    <BellRing className="h-4 w-4 text-amber-300" />
                    <span>{openAlerts} open alerts</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400">
                  Last sync {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                  <UserCog className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs uppercase tracking-wide text-slate-500">Role</span>
                  <select
                    className="bg-transparent text-sm font-medium text-slate-100 focus:outline-none"
                    value={role}
                    onChange={(event) => setRole(event.target.value as typeof role)}
                  >
                    <option className="bg-slate-900" value="Admin">
                      Admin
                    </option>
                    <option className="bg-slate-900" value="Analyst">
                      Analyst
                    </option>
                    <option className="bg-slate-900" value="Viewer">
                      Viewer
                    </option>
                  </select>
                </label>
              </div>
            </div>
          </header>

          <main className="flex-1 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
            <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
