export interface GiveBackHire {
  name: string;
  role: string;
  partner: string;
}

export function readHires(value: unknown): GiveBackHire[] {
  if (typeof value !== 'object' || value === null) return [];
  const rows = (value as { hires?: unknown }).hires;
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((item) => {
    if (typeof item !== 'object' || item === null) return [];
    const row = item as Record<string, unknown>;
    if (typeof row.name !== 'string' || !row.name.trim()) return [];
    return [{
      name: row.name.trim(),
      role: typeof row.role === 'string' ? row.role : '',
      partner: typeof row.partner === 'string' ? row.partner : '',
    }];
  });
}
