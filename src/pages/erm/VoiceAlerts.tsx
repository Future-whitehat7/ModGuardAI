import React, { useState } from 'react';
import { PhoneCall, PhoneForwarded, Plus, Radio, Trash2 } from 'lucide-react';
import { useERM } from './ERMContext';
import { formatDate } from './utils';

export const VoiceAlerts: React.FC = () => {
  const {
    phoneContacts,
    addPhoneContact,
    deletePhoneContact,
    voiceAgent,
    updateVoiceAgent,
    recordTestCall,
    callHistory,
    role,
  } = useERM();

  const [contactForm, setContactForm] = useState({ label: '', phoneNumber: '', alertLevel: 'High' });
  const [agentForm, setAgentForm] = useState(voiceAgent);
  const [testTarget, setTestTarget] = useState('');
  const isAdmin = role === 'Admin';

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin) return;
    if (!/^\+\d{10,15}$/.test(contactForm.phoneNumber)) return;
    addPhoneContact({
      label: contactForm.label.trim(),
      phoneNumber: contactForm.phoneNumber,
      alertLevel: contactForm.alertLevel as 'High' | 'Medium',
    });
    setContactForm({ label: '', phoneNumber: '', alertLevel: 'High' });
  };

  const handleAgentSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin) return;
    updateVoiceAgent(agentForm);
  };

  const handleTestCall = () => {
    if (!isAdmin) return;
    const target = phoneContacts.find((contact) => contact.id === testTarget);
    if (!target) return;
    recordTestCall({ label: target.label, phoneNumber: target.phoneNumber });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Voice alerting</h1>
          <p className="mt-1 text-sm text-slate-400">
            Configure ElevenLabs powered calling to notify executive security teams during high severity detections.
          </p>
        </div>
        <div className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs text-slate-400">
          <Radio className="mr-2 inline h-4 w-4 text-cyan-300" /> Voice channel {isAdmin ? 'armed for dispatch' : 'read only'}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">Alert recipients</h2>
            {isAdmin && (
              <span className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-400">
                E.164 format required
              </span>
            )}
          </div>
          <form onSubmit={handleContactSubmit} className="mt-4 grid gap-4 md:grid-cols-[2fr_2fr_1fr_auto]">
            <input
              type="text"
              value={contactForm.label}
              onChange={(event) => setContactForm((prev) => ({ ...prev, label: event.target.value }))}
              placeholder="Label"
              required
              disabled={!isAdmin}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
            />
            <input
              type="tel"
              value={contactForm.phoneNumber}
              onChange={(event) => setContactForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
              placeholder="+15555551234"
              required
              disabled={!isAdmin}
              pattern="\+\d{10,15}"
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
            />
            <select
              value={contactForm.alertLevel}
              onChange={(event) => setContactForm((prev) => ({ ...prev, alertLevel: event.target.value }))}
              disabled={!isAdmin}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
            <button
              type="submit"
              disabled={!isAdmin}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </form>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-900/60">
                  <th className="px-4 py-3">Label</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Alert level</th>
                  <th className="px-4 py-3">Added</th>
                  {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {phoneContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-4 py-3 text-slate-200">{contact.label}</td>
                    <td className="px-4 py-3 text-slate-400">{contact.phoneNumber}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          contact.alertLevel === 'High'
                            ? 'bg-rose-500/10 text-rose-300'
                            : 'bg-amber-500/10 text-amber-300'
                        }`}
                      >
                        {contact.alertLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(contact.createdAt)}</td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deletePhoneContact(contact.id)}
                          className="rounded-full border border-rose-900 px-3 py-1 text-xs font-semibold text-rose-300 transition hover:border-rose-500"
                          aria-label={`Delete ${contact.label}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {phoneContacts.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="px-4 py-12 text-center text-sm text-slate-500">
                      No voice alert recipients configured.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleAgentSave} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="text-lg font-semibold text-slate-100">Voice agent</h2>
            <p className="mt-2 text-xs text-slate-500">
              Map to your ElevenLabs agent and voice configuration. System prompt guides the escalation language.
            </p>
            <label className="mt-4 block text-xs uppercase tracking-wide text-slate-500">Agent ID</label>
            <input
              type="text"
              value={agentForm.agentId}
              onChange={(event) => setAgentForm((prev) => ({ ...prev, agentId: event.target.value }))}
              disabled={!isAdmin}
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
            />
            <label className="mt-4 block text-xs uppercase tracking-wide text-slate-500">Voice ID</label>
            <input
              type="text"
              value={agentForm.voiceId}
              onChange={(event) => setAgentForm((prev) => ({ ...prev, voiceId: event.target.value }))}
              disabled={!isAdmin}
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
            />
            <label className="mt-4 block text-xs uppercase tracking-wide text-slate-500">System prompt</label>
            <textarea
              value={agentForm.systemPrompt}
              onChange={(event) => setAgentForm((prev) => ({ ...prev, systemPrompt: event.target.value }))}
              rows={5}
              disabled={!isAdmin}
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!isAdmin}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save configuration
            </button>
          </form>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">Test call</h2>
              <PhoneCall className="h-5 w-5 text-cyan-300" />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Trigger a simulated ElevenLabs call to validate routing before production activation.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <select
                value={testTarget}
                onChange={(event) => setTestTarget(event.target.value)}
                disabled={!isAdmin}
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
              >
                <option value="">Select contact</option>
                {phoneContacts.map((contact) => (
                  <option key={contact.id} value={contact.id} className="bg-slate-900">
                    {contact.label} ({contact.phoneNumber})
                  </option>
                ))}
              </select>
              <button
                onClick={handleTestCall}
                disabled={!isAdmin || !testTarget}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <PhoneForwarded className="h-4 w-4" /> Send test call
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <h2 className="text-lg font-semibold text-slate-100">Call history</h2>
        <p className="mt-2 text-xs text-slate-500">Placeholder responses until ElevenLabs webhook integration is configured.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr className="border-b border-slate-900/60">
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {callHistory.map((call) => (
                <tr key={call.id}>
                  <td className="px-4 py-3 text-slate-200">{call.label}</td>
                  <td className="px-4 py-3 text-slate-400">{call.phoneNumber}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        call.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : call.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-300'
                          : 'bg-rose-500/10 text-rose-300'
                      }`}
                    >
                      {call.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDate(call.timestamp)}</td>
                  <td className="px-4 py-3 text-xs text-cyan-300">
                    {call.transcriptUrl ? <a href={call.transcriptUrl}>View transcript</a> : 'Pending'}
                  </td>
                </tr>
              ))}
              {callHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">
                    No test calls recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
