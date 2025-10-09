export const createId = () => Math.random().toString(36).slice(2, 11);

export const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRisk = (value: number) => `${Math.round(value)}%`;

export const averageRiskScore = (scores: number[]) => {
  if (!scores.length) return 0;
  const total = scores.reduce((sum, score) => sum + score, 0);
  return Math.round((total / scores.length) * 10) / 10;
};
