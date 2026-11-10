export type RadarBadgeKind = 'news' | 'kev' | 'cvss' | 'epss';

export interface RadarBadge {
  kind: RadarBadgeKind;
  label: string;
}

export interface RadarSource {
  title?: string;
  url?: string;
  source?: string;
  date?: string;
  summary?: string;
  cvss?: number | null;
  epss?: number | null;
  kev?: boolean | null;
}

const SUMMARY_LIMIT = 180;

function finiteIn(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

/** Badge only when the feed itself carries CVSS, EPSS, or KEV. Otherwise the row is news. */
export function radarBadge(item: RadarSource): RadarBadge {
  if (item.kev === true) return { kind: 'kev', label: 'KEV' };
  if (finiteIn(item.cvss, 0, 10)) return { kind: 'cvss', label: `CVSS ${item.cvss.toFixed(1)}` };
  if (finiteIn(item.epss, 0, 1)) return { kind: 'epss', label: `EPSS ${(item.epss * 100).toFixed(1)}%` };
  return { kind: 'news', label: 'News' };
}

export function radarSummary(summary: string | undefined) {
  const text = (summary ?? '').replace(/\s+/g, ' ').trim();
  if (text.length <= SUMMARY_LIMIT) return text;
  return `${text.slice(0, SUMMARY_LIMIT - 1).trim()}…`;
}

export interface RadarRow {
  title: string;
  url: string;
  source: string;
  date: string;
  summary: string;
  badge: RadarBadge;
}

export function toRadarRow(item: RadarSource): RadarRow | null {
  const title = (item.title ?? '').trim();
  const url = (item.url ?? '').trim();
  if (!title || !url.startsWith('http')) return null;
  return {
    title,
    url,
    source: (item.source ?? '').trim(),
    date: (item.date ?? '').trim(),
    summary: radarSummary(item.summary),
    badge: radarBadge(item),
  };
}
