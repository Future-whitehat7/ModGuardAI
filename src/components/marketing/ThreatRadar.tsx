import { useEffect, useState } from 'react';
import { toRadarRow, type RadarRow, type RadarSource } from '../../lib/radarBadge';
import { VaultBoundary } from './VaultBoundary';

const PREVIEW_COUNT = 6;

interface ThreatStat {
  label: string;
  value: number;
  source: string;
  url: string;
}

interface ThreatFile {
  asOf?: string | null;
  stats?: ThreatStat[];
  items?: unknown[];
}

function isStat(value: unknown): value is ThreatStat {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.label === 'string'
    && typeof record.value === 'number'
    && typeof record.source === 'string'
    && typeof record.url === 'string';
}

function readFile(value: unknown): { asOf: string; stats: ThreatStat[]; rows: RadarRow[] } | null {
  if (typeof value !== 'object' || value === null) return null;
  const record = value as ThreatFile;
  const stats = Array.isArray(record.stats) ? record.stats.filter(isStat) : [];
  const rows = Array.isArray(record.items)
    ? record.items.flatMap((item) => {
      if (typeof item !== 'object' || item === null) return [];
      const row = toRadarRow(item as RadarSource);
      return row ? [row] : [];
    })
    : [];
  if (!stats.length && !rows.length) return null;
  return { asOf: typeof record.asOf === 'string' ? record.asOf : '', stats, rows };
}

function RadarRows({ rows }: { rows: RadarRow[] }) {
  return (
    <ul className="radar-list">
      {rows.map((row) => (
        <li key={row.url}>
          <article>
            <p className="radar-meta">
              <span className={`radar-badge radar-badge-${row.badge.kind}`}>{row.badge.label}</span>
              {row.date ? <time dateTime={row.date}>{row.date}</time> : null}
              {row.source ? <span>{row.source}</span> : null}
            </p>
            <h3><a href={row.url}>{row.title}</a></h3>
            {row.summary ? <p>{row.summary}</p> : null}
          </article>
        </li>
      ))}
    </ul>
  );
}

function ThreatRadarBody() {
  const [data, setData] = useState<{ asOf: string; stats: ThreatStat[]; rows: RadarRow[] } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(url);
      return readFile(await response.json());
    };
    const run = async () => {
      try {
        const live = await load('/pulse.json');
        if (!cancelled && live) {
          setData(live);
          return;
        }
      } catch {
        // Local preview has no scheduled function. The cached file is the same feed.
      }
      try {
        const cached = await load('/threats.json');
        if (!cancelled && cached) setData(cached);
        else if (!cancelled) setFailed(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return <p className="radar-empty">The public feed is not available right now.</p>;
  if (!data) return <p className="radar-empty">Loading the public feed.</p>;

  const preview = data.rows.slice(0, PREVIEW_COUNT);
  const rest = data.rows.slice(PREVIEW_COUNT);

  return (
    <>
      {data.asOf ? <p className="radar-asof">Feed time {data.asOf}</p> : null}
      {data.stats.length > 0 ? (
        <ul className="radar-stats">
          {data.stats.map((stat) => (
            <li key={stat.label}>
              <a href={stat.url}>
                <span className="num">{stat.value.toLocaleString('en-US')}</span>
                <span>{stat.label}</span>
                <span className="radar-source">{stat.source}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <RadarRows rows={preview} />
      {rest.length > 0 ? (
        <details className="radar-more">
          <summary>View all</summary>
          <RadarRows rows={rest} />
        </details>
      ) : null}
    </>
  );
}

export function ThreatRadar() {
  return (
    <section className="threat-radar" aria-labelledby="threat-radar-title">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <details className="radar-fold">
          <summary id="threat-radar-title">Threat radar</summary>
          <p className="mt-3 max-w-2xl text-base">
            Headlines from the public feeds this site already collects. A severity badge appears only when that item includes CVSS, EPSS, or KEV data.
          </p>
          <VaultBoundary fallback={<p className="radar-empty">The feed could not be shown.</p>}>
            <ThreatRadarBody />
          </VaultBoundary>
        </details>
      </div>
    </section>
  );
}
