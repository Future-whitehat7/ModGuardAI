export const DAILY_CATEGORIES = ['AI', 'Cybersecurity', 'AI tools', 'Use cases'] as const;

export type DailyCategory = (typeof DAILY_CATEGORIES)[number];

export interface DailyItem {
  title: string;
  url: string;
  source: string;
  date: string;
  summary: string;
  tag?: string;
}

const USE_CASE = /\b(use case|case study|in production|helps teams|deployed at)\b/i;
const AI_TOOL = /\b(chatgpt|claude|gemini|copilot|midjourney|cursor|perplexity|ai tool|llm app|open-source model)\b/i;
const AI_TOPIC = /\b(artificial intelligence|\bai\b|openai|machine learning|generative|deepfake|llm)\b/i;
const CYBER_TOPIC = /\b(cyber|hack(?:ed|ing|er)?|ransom|malware|breach|phish|vulnerabilit|cisa|exploit|scam|fraud)\b/i;

/** A category only when the headline or the feed tag supports it. */
export function dailyCategory(item: Pick<DailyItem, 'title' | 'summary' | 'tag'>): DailyCategory | null {
  const text = `${item.title} ${item.summary}`;
  if (USE_CASE.test(text)) return 'Use cases';
  if (AI_TOOL.test(text)) return 'AI tools';
  if (item.tag === 'AI' || item.tag === 'Deepfake' || AI_TOPIC.test(text)) return 'AI';
  if (item.tag === 'Cyber' || item.tag === 'Scam' || CYBER_TOPIC.test(text)) return 'Cybersecurity';
  return null;
}

const HELD_BACK = /\b(sexual|nude|explicit)\b[\s\S]{0,80}\b(student|school|minor|child|teen|underage)\b|\b(student|school|minor|child|teen|underage)\b[\s\S]{0,80}\b(sexual|nude|explicit)\b/i;

export function cleanText(value: string) {
  let text = value.replace(/<[^>]+>/g, ' ');
  for (let pass = 0; pass < 2; pass += 1) {
    text = text
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&#(\d+);/g, (_, digits: string) => {
        const code = Number(digits);
        return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : '';
      });
  }
  return text.replace(/\s+/g, ' ').trim();
}

export function isPublishable(item: Pick<DailyItem, 'title' | 'summary'>) {
  return !HELD_BACK.test(`${item.title} ${item.summary}`);
}

export function isDailyItem(value: unknown): value is DailyItem {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.title === 'string'
    && record.title.trim().length > 0
    && typeof record.url === 'string'
    && record.url.startsWith('http')
    && typeof record.source === 'string';
}

export function sponsoredCard<T extends { name: string; href: string; message: string }>(sponsor: T | null | undefined): T | null {
  if (!sponsor?.name || !sponsor.message) return null;
  const href = sponsor.href;
  if (!href.startsWith('https://') && !href.startsWith('/')) return null;
  return sponsor;
}

export function readDailyItems(items: unknown): DailyItem[] {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    if (!isDailyItem(item)) return [];
    const row = {
      title: cleanText(item.title),
      url: item.url.trim(),
      source: cleanText(item.source),
      date: typeof item.date === 'string' ? item.date : '',
      summary: cleanText(typeof item.summary === 'string' ? item.summary : ''),
      tag: typeof item.tag === 'string' ? item.tag : undefined,
    };
    return isPublishable(row) ? [row] : [];
  });
}
