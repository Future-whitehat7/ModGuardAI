export const chapterRegions = ['Gulf', 'Nigeria', 'India', 'US', 'Anywhere'] as const;

export interface Chapter {
  school: string;
  country: string;
}

export function readChapters(value: unknown): Chapter[] {
  if (typeof value !== 'object' || value === null) return [];
  const rows = (value as { chapters?: unknown }).chapters;
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((item) => {
    if (typeof item !== 'object' || item === null) return [];
    const row = item as Record<string, unknown>;
    if (typeof row.school !== 'string' || !row.school.trim()) return [];
    return [{
      school: row.school.trim(),
      country: typeof row.country === 'string' ? row.country : '',
    }];
  });
}
