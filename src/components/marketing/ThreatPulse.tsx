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

interface ThreatPulsePoint {
  country: string;
  code: string;
  count: number;
  x: number | null;
  y: number | null;
  source: string;
  url: string;
  asOf: string;
}

interface ThreatFile {
  stats?: ThreatStat[];
  pulses?: ThreatPulsePoint[];
  items?: ThreatItem[];
  dots?: Array<{ name: string; x: number; y: number }>;
  skipped?: string[];
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
        if (live.ok) return live.json() as Promise<ThreatFile>;
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
  const pulses = data?.pulses ?? [];
  const mapped = pulses.filter((item) => item.x != null && item.y != null);
  const items = data?.items ?? [];
  const ticker = aiOnly ? items.filter((item) => item.ai) : items;
  const aiCount = items.filter((item) => item.ai).length;

  return (
    <section className="chapter border-t border-ice/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-frost">Pulse</p>
        <h2 className="display mt-3 text-4xl text-ice sm:text-6xl">Global threat pulse</h2>
        <p className="mt-4 max-w-2xl text-lg text-frost">
          Public counts and headlines, refreshed about every 15 minutes. A blue pulse is drawn only when the source includes a country code.
        </p>
        {stats.length > 0 && (
          <ul className="mt-8 grid gap-px overflow-hidden rounded-[20px] border border-[#E6E6E1] bg-[#E6E6E1] sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <li key={`${stat.source}-${stat.label}`} className="min-h-36 bg-white p-5">
                <p className="display text-4xl text-ice">{stat.value.toLocaleString('en-US')}</p>
                <p className="mt-2 text-sm text-ice">{stat.label}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-frost">
                  <a href={stat.url}>{stat.source}</a>
                  {' · as of '}
                  {asOf(stat.asOf)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="glass relative mt-8 aspect-[2/1] overflow-hidden">
          <svg viewBox="0 0 100 50" className="h-full w-full" role="img" aria-label="Dotted world map">
            {(data?.dots ?? []).map((dot) => (
              <circle key={dot.name} cx={dot.x} cy={dot.y} r="0.35" fill="#B9BDC6" />
            ))}
            {mapped.map((item) => (
              <a key={item.code} href={item.url}>
                <circle className="pulse-dot" cx={item.x ?? 0} cy={item.y ?? 0} r="0.7" fill="#2B4BFF" />
                <circle cx={item.x ?? 0} cy={item.y ?? 0} r="0.45" fill="#2B4BFF" />
              </a>
            ))}
          </svg>
          {!stats.length && !items.length && (
            <p className="absolute inset-x-0 bottom-4 text-center text-sm text-frost">
              {failed || data ? 'No public threat data was available.' : 'Loading public threat data.'}
            </p>
          )}
        </div>
        {pulses.length > 0 && (
          <ul className="mt-6 space-y-3">
            {pulses.map((item) => (
              <li key={item.code} className="text-sm">
                <a className="underline decoration-[#E6E6E1] underline-offset-4" href={item.url}>{item.country}</a>
                <span className="text-frost">
                  {' · '}{item.count} online {item.count === 1 ? 'host' : 'hosts'}
                  {' · '}{item.source}
                  {' · as of '}{asOf(item.asOf)}
                  {item.x == null ? ' · country code is not on this map' : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-ghost" aria-pressed={aiOnly} onClick={() => setAiOnly((value) => !value)}>
              {aiOnly ? 'All headlines' : `AI headlines (${aiCount})`}
            </button>
            <p className="text-sm text-frost">The AI tag is a keyword match on the title, not a label from the publisher.</p>
          </div>
        )}
        {ticker.length > 0 && (
          <div className="mt-4 overflow-hidden border-y border-[#E6E6E1] py-3">
            <div className="ticker">
              {[0, 1].map((copy) => (
                <p key={copy} className="flex gap-8 text-sm">
                  {ticker.map((item) => (
                    <a key={`${copy}-${item.url}`} href={item.url}>
                      {item.ai ? 'AI · ' : ''}{item.title} · {item.source} · {item.date || 'Date not in source'}
                    </a>
                  ))}
                </p>
              ))}
            </div>
          </div>
        )}
        {aiOnly && !ticker.length && (
          <p className="mt-4 text-sm text-frost">No headline in this pull has an AI keyword in the title.</p>
        )}
        <p className="mt-4 text-sm text-frost">URLhaus and ThreatFox require an API key, so those counts are not shown.</p>
      </div>
    </section>
  );
}
