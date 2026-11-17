export interface Contributor {
  name: string;
  handle: string;
  focus: string;
}

export interface ShippedWork {
  title: string;
  by: string;
  url: string;
}

export interface Hackathon {
  name: string;
  startsAt: string;
  host: string;
  participants: number | null;
}

export interface CommunityBoard {
  contributors: Contributor[];
  shipped: ShippedWork[];
  hackathons: Hackathon[];
}

const empty: CommunityBoard = { contributors: [], shipped: [], hackathons: [] };

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function readBoard(value: unknown): CommunityBoard {
  if (typeof value !== 'object' || value === null) return empty;
  const record = value as Record<string, unknown>;
  const contributors = Array.isArray(record.contributors)
    ? record.contributors.flatMap((item) => {
      if (typeof item !== 'object' || item === null) return [];
      const row = item as Record<string, unknown>;
      const name = text(row.name);
      if (!name) return [];
      return [{ name, handle: text(row.handle), focus: text(row.focus) }];
    })
    : [];
  const shipped = Array.isArray(record.shipped)
    ? record.shipped.flatMap((item) => {
      if (typeof item !== 'object' || item === null) return [];
      const row = item as Record<string, unknown>;
      const title = text(row.title);
      const by = text(row.by);
      if (!title || !by) return [];
      return [{ title, by, url: text(row.url) }];
    })
    : [];
  const hackathons = Array.isArray(record.hackathons)
    ? record.hackathons.flatMap((item) => {
      if (typeof item !== 'object' || item === null) return [];
      const row = item as Record<string, unknown>;
      const name = text(row.name);
      if (!name) return [];
      const participants = typeof row.participants === 'number' && row.participants >= 0 ? row.participants : null;
      return [{ name, startsAt: text(row.startsAt), host: text(row.host), participants }];
    })
    : [];
  return { contributors, shipped, hackathons };
}

export function countdown(startsAt: string, now: number): string | null {
  const time = Date.parse(startsAt);
  if (!startsAt || Number.isNaN(time) || time <= now) return null;
  const minutes = Math.round((time - now) / 60000);
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes - days * 60 * 24) / 60);
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ${hours} hr`;
  if (hours > 0) return `${hours} hr`;
  return `${Math.max(1, minutes)} min`;
}
