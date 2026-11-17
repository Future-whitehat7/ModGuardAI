export interface HireEntry {
  date: string;
  partner: string;
  privatePartner: boolean;
  role: string;
  region: string;
  confirmedBy: string;
}

export interface HireLog {
  updated: string;
  hires: HireEntry[];
}

export const emptyLog: HireLog = { updated: '', hires: [] };

export const principle =
  'Partners commit to hiring 1–2% of roles from early-career ModGuard community members. This is a stated principle, not a contract or a job guarantee.';

export const eligible = [
  'You are an early-career community member. This is about career stage, not age. Anyone of any age who is starting or changing into this field qualifies.',
  'You are 18 or older.',
  'You have done verified work in the community, such as a shipped sprint project, verified finds in the games, or a Guardian Card level.',
  'You have opted in to be introduced to partners, and you can opt out any time.',
  'You can be anywhere in the world.',
];

export const counting = [
  'We count per partner, per calendar year.',
  'The base number is the roles the partner actually fills that year, not open postings.',
  'A hire counts when an eligible member is hired into one of those roles through a ModGuard introduction, and both the partner and the member confirm it.',
  'Worked example, not a real partner: a partner that fills 100 roles in a year meets the principle by hiring 1 to 2 eligible members.',
  'Only confirmed hires count. Nothing is estimated or projected.',
];

export const emptyHireCopy =
  'No hires yet. An entry appears here only after a partner confirms a hire and the member agrees to be listed.';

export function partnerLabel(entry: HireEntry) {
  return entry.privatePartner ? 'Partner (private)' : entry.partner;
}

export function readHireLog(value: unknown): HireLog {
  if (typeof value !== 'object' || value === null) return emptyLog;
  const record = value as { updated?: unknown; hires?: unknown };
  const updated = typeof record.updated === 'string' ? record.updated : '';
  const hires = Array.isArray(record.hires) ? record.hires.flatMap((item) => {
    if (typeof item !== 'object' || item === null) return [];
    const row = item as Record<string, unknown>;
    if (typeof row.date !== 'string' || !row.date.trim()) return [];
    if (typeof row.role !== 'string' || typeof row.region !== 'string' || typeof row.confirmedBy !== 'string') return [];
    const partner = typeof row.partner === 'string' ? row.partner.trim() : '';
    return [{
      date: row.date.trim(),
      partner,
      privatePartner: row.privatePartner === true || partner.length === 0,
      role: row.role,
      region: row.region,
      confirmedBy: row.confirmedBy,
    }];
  }) : [];
  return { updated, hires };
}
