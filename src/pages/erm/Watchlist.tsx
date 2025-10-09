import React, { useMemo, useState } from 'react';
import { FilePlus2, Plus, Search, Trash2, UploadCloud } from 'lucide-react';
import { useERM } from './ERMContext';
import { ExecutiveProfile } from './types';
import { createId, formatDate } from './utils';

const priorityWeight: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

interface FormState {
  id?: string;
  fullName: string;
  title: string;
  organization: string;
  priority: ExecutiveProfile['priority'];
  notes: string;
  photos: FileList | null;
  videos: FileList | null;
  voiceSamples: FileList | null;
}

const defaultFormState: FormState = {
  fullName: '',
  title: '',
  organization: '',
  priority: 'Medium',
  notes: '',
  photos: null,
  videos: null,
  voiceSamples: null,
};

const toMediaReferences = (files: FileList | null, type: 'photo' | 'video' | 'voice') => {
  if (!files) return [];
  return Array.from(files).map((file) => ({
    id: createId(),
    name: file.name,
    size: file.size,
    type,
  }));
};

export const Watchlist: React.FC = () => {
  const { profiles, addProfile, updateProfile, deleteProfile, role } = useERM();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'lastScan'>('priority');
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [formOpen, setFormOpen] = useState(false);

  const filteredProfiles = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const filtered = normalized
      ? profiles.filter((profile) =>
          [profile.fullName, profile.title, profile.organization]
            .join(' ')
            .toLowerCase()
            .includes(normalized),
        )
      : profiles;

    return filtered
      .slice()
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.fullName.localeCompare(b.fullName);
        }
        if (sortBy === 'priority') {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return new Date(b.lastScan).getTime() - new Date(a.lastScan).getTime();
      });
  }, [profiles, search, sortBy]);

  const isReadOnly = role !== 'Admin';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isReadOnly) return;

    const profilePayload = {
      fullName: formState.fullName.trim(),
      title: formState.title.trim(),
      organization: formState.organization.trim(),
      priority: formState.priority,
      notes: formState.notes.trim(),
      photos: toMediaReferences(formState.photos, 'photo'),
      videos: toMediaReferences(formState.videos, 'video'),
      voiceSamples: toMediaReferences(formState.voiceSamples, 'voice'),
    };

    if (!profilePayload.fullName || !profilePayload.title || !profilePayload.organization) {
      return;
    }

    if (formState.id) {
      updateProfile(formState.id, { ...profilePayload });
    } else {
      addProfile(profilePayload);
    }

    setFormState(defaultFormState);
    setFormOpen(false);
  };

  const handleEdit = (profile: ExecutiveProfile) => {
    setFormState({
      id: profile.id,
      fullName: profile.fullName,
      title: profile.title,
      organization: profile.organization,
      priority: profile.priority,
      notes: profile.notes,
      photos: null,
      videos: null,
      voiceSamples: null,
    });
    setFormOpen(true);
  };

  const handleReset = () => {
    setFormState(defaultFormState);
    setFormOpen(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Watchlist management</h1>
          <p className="mt-1 text-sm text-slate-400">
            Maintain an auditable inventory of executives under synthetic media surveillance.
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => {
              setFormState(defaultFormState);
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
          >
            <Plus className="h-4 w-4" /> Add profile
          </button>
        )}
      </header>

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, title, or organization"
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            Sort by
            <select
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
            >
              <option value="priority">Priority</option>
              <option value="name">Name</option>
              <option value="lastScan">Last scan</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase tracking-wider text-slate-500">
              <tr className="border-b border-slate-800/80">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Last scan</th>
                {!isReadOnly && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-900/40">
                  <td className="px-4 py-3 text-slate-100">{profile.fullName}</td>
                  <td className="px-4 py-3">{profile.title}</td>
                  <td className="px-4 py-3">{profile.organization}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        profile.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-300'
                          : profile.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-300'
                          : 'bg-emerald-500/10 text-emerald-300'
                      }`}
                    >
                      {profile.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{formatDate(profile.lastScan)}</td>
                  {!isReadOnly && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(profile)}
                          className="rounded-full border border-slate-800 px-3 py-1 text-xs font-semibold text-cyan-200 transition hover:border-cyan-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProfile(profile.id)}
                          className="rounded-full border border-rose-900 px-3 py-1 text-xs font-semibold text-rose-300 transition hover:border-rose-500"
                          aria-label={`Delete ${profile.fullName}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredProfiles.length === 0 && (
                <tr>
                  <td colSpan={isReadOnly ? 5 : 6} className="px-4 py-12 text-center text-sm text-slate-500">
                    No profiles match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={`rounded-3xl border border-slate-800 bg-slate-950/70 transition-all ${
          formOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <form className="grid gap-6 px-6 py-8 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">
              {formState.id ? 'Update profile' : 'Create new profile'}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isReadOnly}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FilePlus2 className="h-4 w-4" /> Save profile
              </button>
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Full name</span>
            <input
              type="text"
              value={formState.fullName}
              onChange={(event) => setFormState((prev) => ({ ...prev, fullName: event.target.value }))}
              required
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Title</span>
            <input
              type="text"
              value={formState.title}
              onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
              required
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Organization</span>
            <input
              type="text"
              value={formState.organization}
              onChange={(event) => setFormState((prev) => ({ ...prev, organization: event.target.value }))}
              required
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Priority</span>
            <select
              value={formState.priority}
              onChange={(event) => setFormState((prev) => ({ ...prev, priority: event.target.value as ExecutiveProfile['priority'] }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>

          <label className="md:col-span-2 space-y-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Notes</span>
            <textarea
              value={formState.notes}
              onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
              rows={3}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed"
            />
          </label>

          <div className="grid gap-4 md:col-span-2 md:grid-cols-3">
            {([
              {
                label: 'Upload reference photos',
                key: 'photos',
                accept: 'image/*',
                type: 'photo' as const,
              },
              {
                label: 'Upload reference videos',
                key: 'videos',
                accept: 'video/*',
                type: 'video' as const,
              },
              {
                label: 'Upload voice sample',
                key: 'voiceSamples',
                accept: 'audio/*',
                type: 'voice' as const,
              },
            ] as const).map((input) => {
              const fileList = formState[input.key];
              const attached = toMediaReferences(fileList, input.type).length;
              return (
                <label key={input.key} className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">{input.label}</span>
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 bg-slate-900/50 px-4 py-6 text-center">
                    <UploadCloud className="h-5 w-5 text-cyan-300" />
                    <span className="text-xs text-slate-500">Drag & drop or browse files</span>
                    <input
                      type="file"
                      accept={input.accept}
                      multiple={input.type !== 'voice'}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          [input.key]: event.target.files,
                        }))
                      }
                      disabled={isReadOnly}
                      className="hidden"
                    />
                    <span className="text-[10px] uppercase tracking-wide text-slate-600">
                      {attached} file(s) attached
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </form>
      </div>
    </div>
  );
};
