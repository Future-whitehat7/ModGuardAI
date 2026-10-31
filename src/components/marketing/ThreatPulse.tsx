import { useEffect, useState } from 'react';

interface ThreatItem {
  title: string;
  url: string;
  source: string;
  date: string;
  ai?: boolean;
}

interface ThreatStat {
  label: string;
  value: number;
  source: string;
  url: string;
  asOf: string;
}

interface ThreatFile {
  stats?: ThreatStat[];
  items?: ThreatItem[];
}

function asOf(value: string) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
}

export function ThreatPulse() {
  const [data, setData] = useState<ThreatFile | null>(null);
  const [failed, setFailed] = useState(false);
  const [aiOnly, setAiOnly] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const live = await fetch('/pulse.json');
        if (live.ok) {
          const json = await live.json() as ThreatFile;
          if (json.stats || json.items) return json;
        }
      } catch {
        // Static file from the last build.
      }
      const fallback = await fetch('/threats.json');
      if (!fallback.ok) throw new Error('missing');
      return fallback.json() as Promise<ThreatFile>;
    };
    load().then(setData).catch(() => setFailed(true));
  }, []);

  const stats = data?.stats ?? [];
  const items = data?.items ?? [];
  const shown = aiOnly ? items.filter((item) => item.ai) : items;
  const aiCount = items.filter((item) => item.ai).length;

  return (
    <section className="chapter border-t border-ice/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-frost">Pulse</p>
        <h2 className="display mt-3 text-4xl text-ice sm:text-6xl">Global threat pulse</h2>
        <p className="mt-4 max-w-2xl text-lg text-frost">
          Public counts and headlines, refreshed about every 15 minutes.
        </p>
        {stats.length > 0 && (
          <ul className="mt-8 grid gap-px overflow-hidden rounded-[20px] border border-[#E6E6E1] bg-[#E6E6E1] sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <li key={`${stat.source}-${stat.label}`} className="min-h-36 bg-white p-5">
                <p className="display text-5xl text-ice">{stat.value.toLocaleString('en-US')}</p>
                <p className="mt-3 text-sm text-ice">{stat.label}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-frost">
                  <a href={stat.url}>{stat.source}</a>
                  {' · as of '}
                  {asOf(stat.asOf)}
                </p>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-ghost" aria-pressed={aiOnly} onClick={() => setAiOnly((value) => !value)}>
              {aiOnly ? 'All headlines' : `AI headlines (${aiCount})`}
            </button>
            <p className="text-sm text-frost">The AI tag is a keyword match on the title, not a label from the publisher.</p>
          </div>
        )}
        {shown.length > 0 && (
          <ul className="mt-4 divide-y divide-[#E6E6E1] border-y border-[#E6E6E1]">
            {shown.map((item) => (
              <li key={item.url}>
                <a className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8" href={item.url}>
                  <span className="text-lg text-ice">
                    {item.ai && <span className="mr-3 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">AI</span>}
                    {item.title}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-frost">
                    {item.source} · {item.date || 'Date not in source'}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
        {aiOnly && !shown.length && (
          <p className="mt-4 text-sm text-frost">No headline in this pull has an AI keyword in the title.</p>
        )}
        {!stats.length && !items.length && (
          <p className="mt-8 text-sm text-frost">
            {failed || data ? 'No public threat data was available.' : 'Loading public threat data.'}
          </p>
        )}
        <p className="mt-6 text-sm text-frost">URLhaus and ThreatFox require an API key, so those counts are not shown.</p>
      </div>
    </section>
  );
}
