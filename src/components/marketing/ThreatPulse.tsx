import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';

type ThreatTag = 'AI' | 'Cyber' | 'Deepfake' | 'Scam';

interface ThreatItem {
  title: string;
  url: string;
  source: string;
  date: string;
  summary?: string;
  tag?: ThreatTag;
}

const FILTERS: Array<['all' | ThreatTag, string]> = [
  ['all', 'All'],
  ['AI', 'AI'],
  ['Cyber', 'Cyber'],
  ['Deepfake', 'Deepfakes'],
  ['Scam', 'Scams'],
];

interface ThreatStat {
  label: string;
  value: number;
  source: string;
  url: string;
  asOf: string;
}

interface ThreatFile {
  asOf?: string | null;
  stats?: ThreatStat[];
  items?: ThreatItem[];
}

function updatedLabel(asOfValue: string | null | undefined, now: number) {
  const parsed = Date.parse(asOfValue ?? '');
  if (Number.isNaN(parsed)) return null;
  const mins = Math.max(0, Math.floor((now - parsed) / 60000));
  if (mins < 1) return 'Updated just now';
  if (mins === 1) return 'Updated 1 min ago';
  return `Updated ${mins} min ago`;
}

function asOf(value: string) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
}

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const format = (n: number) => n.toLocaleString('en-US');
    el.textContent = format(value);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      io.disconnect();
      const started = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - started) / 720);
        const eased = 1 - (1 - t) ** 3;
        el.textContent = format(Math.round(value * eased));
        if (t < 1) frame = window.requestAnimationFrame(tick);
      };
      el.textContent = format(0);
      frame = window.requestAnimationFrame(tick);
    }, { threshold: 0.45 });
    io.observe(el);
    return () => {
      window.cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [value]);

  return <p ref={ref} className="display text-5xl text-white sm:text-6xl">{value.toLocaleString('en-US')}</p>;
}

export function ThreatPulse() {
  const [data, setData] = useState<ThreatFile | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>('all');
  const [now, setNow] = useState(() => Date.now());
  const [open, setOpen] = useState<ThreatItem | null>(null);
  const close = useCallback(() => setOpen(null), []);

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
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const stats = data?.stats ?? [];
  const items = data?.items ?? [];
  const shown = filter === 'all' ? items : items.filter((item) => item.tag === filter);
  const fresh = updatedLabel(data?.asOf, now);

  return (
    <section className="threat-band" id="pulse">
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
        <p className="eyebrow eyebrow-light flex items-center gap-3">
          <span className="live-dot" aria-hidden="true" />
          {fresh ?? 'Live feed'}
        </p>
        <h2 className="rise display mt-4 text-4xl text-white sm:text-6xl">Global threat pulse</h2>
        <p className="rise mt-5 max-w-2xl text-lg text-white/70">
          AI-powered scams move quickly. These counts and headlines come from public sources, refreshed about every 15 minutes.
        </p>
        {stats.length > 0 && (
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[20px] border border-[#c6b48a]/35 bg-[#c6b48a]/25 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <li
                key={`${stat.source}-${stat.label}`}
                className="rise min-h-40 bg-[#12141a] p-6"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <CountUp value={stat.value} />
                <p className="mt-4 text-sm text-white/85">{stat.label}</p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#c6b48a]">
                  <a href={stat.url}>{stat.source}</a>
                  {' · as of '}
                  {asOf(stat.asOf)}
                </p>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter headlines">
            {FILTERS.map(([value, label]) => (
              <button key={value} type="button" className="btn-ghost" aria-pressed={filter === value} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>
        )}
        {shown.length > 0 && (
          <ul className="mt-4 divide-y divide-white/10 border-y border-white/15">
            {shown.map((item, index) => (
              <li key={item.url} className="rise" style={{ transitionDelay: `${index * 45}ms` }}>
                <button type="button" className="threat-hit" onClick={() => setOpen(item)}>
                  <span className="text-lg text-white">
                    {item.tag && <span className="mr-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#c6b48a]">{item.tag}</span>}
                    {item.title}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-white/55">
                    {item.source} · {item.date || 'Date not in source'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {filter !== 'all' && !shown.length && (
          <p className="mt-4 text-sm text-white/60">No {filter.toLowerCase()} headlines in this pull.</p>
        )}
        {!stats.length && !items.length && (
          <p className="mt-10 text-sm text-white/60">
            {failed || data ? 'No public threat data was available.' : 'Loading public threat data.'}
          </p>
        )}
        <p className="mt-8 text-sm text-white/50">
          URLhaus, ThreatFox, VentureBeat, and Reuters did not return a keyless feed, so they are not shown.
        </p>
      </div>
      {open && (
        <Modal title={open.title} kicker={open.source} onClose={close}>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-frost">
            {open.tag ? `${open.tag} · ` : ''}{open.source} · {open.date || 'Date not in source'}
          </p>
          <p>{open.summary || 'This source did not include a summary.'}</p>
          <a className="btn-accent w-full sm:w-auto" href={open.url} target="_blank" rel="noopener noreferrer">Read at source</a>
          <button className="btn-ghost w-full sm:w-auto" type="button" onClick={close}>Close</button>
        </Modal>
      )}
    </section>
  );
}
