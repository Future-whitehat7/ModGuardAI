import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';

interface ThreatItem {
  title: string;
  url: string;
  source: string;
  date: string;
  summary?: string;
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
  const [aiOnly, setAiOnly] = useState(false);
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
  }, []);

  const stats = data?.stats ?? [];
  const items = data?.items ?? [];
  const shown = aiOnly ? items.filter((item) => item.ai) : items;
  const aiCount = items.filter((item) => item.ai).length;

  return (
    <section className="threat-band" id="pulse">
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
        <p className="eyebrow eyebrow-light flex items-center gap-3">
          <span className="live-dot" aria-hidden="true" />
          Live feed
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
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-ghost" aria-pressed={aiOnly} onClick={() => setAiOnly((value) => !value)}>
              {aiOnly ? 'All headlines' : `AI headlines (${aiCount})`}
            </button>
            <p className="text-sm text-white/60">The AI tag is a keyword match on the title, not a label from the publisher.</p>
          </div>
        )}
        {shown.length > 0 && (
          <ul className="mt-4 divide-y divide-white/10 border-y border-white/15">
            {shown.map((item, index) => (
              <li key={item.url} className="rise" style={{ transitionDelay: `${index * 45}ms` }}>
                <button type="button" className="threat-hit" onClick={() => setOpen(item)}>
                  <span className="text-lg text-white">
                    {item.ai && <span className="mr-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#c6b48a]">AI</span>}
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
        {aiOnly && !shown.length && (
          <p className="mt-4 text-sm text-white/60">No headline in this pull has an AI keyword in the title.</p>
        )}
        {!stats.length && !items.length && (
          <p className="mt-10 text-sm text-white/60">
            {failed || data ? 'No public threat data was available.' : 'Loading public threat data.'}
          </p>
        )}
        <p className="mt-8 text-sm text-white/50">URLhaus and ThreatFox require an API key, so those counts are not shown.</p>
      </div>
      {open && (
        <Modal title={open.title} kicker={open.source} onClose={close}>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-frost">
            {open.ai ? 'AI · ' : ''}{open.source} · {open.date || 'Date not in source'}
          </p>
          <p>{open.summary || 'This source did not include a summary.'}</p>
          <a className="btn-accent w-full sm:w-auto" href={open.url} target="_blank" rel="noopener noreferrer">Read at source</a>
          <button className="btn-ghost w-full sm:w-auto" type="button" onClick={close}>Close</button>
        </Modal>
      )}
    </section>
  );
}
