export const DAILY_CATEGORIES = ['AI', 'Cybersecurity', 'AI tools', 'Use cases'] as const;

export type DailyCategory = (typeof DAILY_CATEGORIES)[number];

export interface DailyItem {
  title: string;
  url: string;
  source: string;
  date: string;
  summary: string;
  tag?: string;
  published?: string;
  image?: string;
}

const USE_CASE = /\b(use case|case study|in production|helps teams|deployed at)\b/i;
const AI_TOOL = /\b(chatgpt|claude|gemini|copilot|midjourney|cursor|perplexity|llm|ai tool|openai|anthropic|open-source model)\b/i;
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

const SECURITY = /\b(cyber\w*|hack\w*|ransom\w*|malware|breach\w*|phish\w*|vulnerab\w*|cisa|exploit\w*|scams?|frauds?|deepfakes?|privacy|passwords?|credentials?|impersonat\w*|spyware|botnets?|zero-day|zero day|prompt injection|jailbreaks?|data leaks?|security)\b/i;
const GOSSIP = /\b(jensen|huang|celebrity|gossip|plot against|earnings|funding round|billionaire|stock price|valuation|raises \$)\b/i;
const OFF_BEAT = /\b(broken roads|land records|box office|recipe|touchdown|championship)\b/i;

const LEAD_SOURCES = ['CISA', 'BleepingComputer', 'The Hacker News', 'Krebs on Security', 'Dark Reading', 'SecurityWeek', 'The Record'];

/** Keep a headline only when it is about security, scams, deepfakes, privacy, or an AI tool. */
export function isDailyRelevant(item: Pick<DailyItem, 'title' | 'summary' | 'tag'>): boolean {
  if (!isPublishable(item)) return false;
  const text = `${item.title} ${item.summary}`;
  if (OFF_BEAT.test(text)) return false;
  if (GOSSIP.test(text) && !SECURITY.test(text)) return false;
  if (SECURITY.test(text)) return true;
  if ((item.tag === 'Cyber' || item.tag === 'Scam' || item.tag === 'Deepfake') && /deepfake|scam|phish|fraud/i.test(text)) return true;
  if (AI_TOOL.test(text)) return true;
  return false;
}

export function rankDaily(items: DailyItem[]): DailyItem[] {
  const rank = (source: string) => {
    const index = LEAD_SOURCES.findIndex((name) => source.toLowerCase().includes(name.toLowerCase()));
    return index === -1 ? LEAD_SOURCES.length : index;
  };
  return items.filter(isDailyRelevant).sort((left, right) => {
    const sourceOrder = rank(left.source) - rank(right.source);
    if (sourceOrder !== 0) return sourceOrder;
    const leftTime = Date.parse(left.published || left.date || '');
    const rightTime = Date.parse(right.published || right.date || '');
    return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
  });
}

export function freshness(value: string, now = Date.now()): { label: string; fresh: boolean } | null {
  const time = Date.parse(value);
  if (!value || Number.isNaN(time)) return null;
  const delta = now - time;
  if (delta < 0) return null;
  const minutes = Math.max(1, Math.round(delta / 60000));
  const dated = value.includes('T');
  if (minutes < 60) return { label: `${minutes} min ago`, fresh: dated && minutes <= 180 };
  const hours = Math.round(minutes / 60);
  if (hours < 48) return { label: `${hours} hr ago`, fresh: dated && hours <= 3 };
  const days = Math.round(hours / 24);
  return { label: `${days} day${days === 1 ? '' : 's'} ago`, fresh: false };
}

export interface CountStat {
  label: string;
  value: number;
  source: string;
  url: string;
}

export function strongStats(stats: CountStat[]): CountStat[] {
  return stats.flatMap((stat) => {
    if (stat.value < 2 || !stat.url.startsWith('http')) return [];
    if (/known exploited vulnerabilities/i.test(stat.label)) {
      return [{ ...stat, label: 'Known exploited vulnerabilities' }];
    }
    if (/cves published/i.test(stat.label)) {
      return [{ ...stat, label: 'New CVEs this week' }];
    }
    return [];
  });
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
    const record = item as DailyItem;
    const row: DailyItem = {
      title: cleanText(item.title),
      url: item.url.trim(),
      source: cleanText(item.source),
      date: typeof item.date === 'string' ? item.date : '',
      summary: cleanText(typeof item.summary === 'string' ? item.summary : ''),
      tag: typeof item.tag === 'string' ? item.tag : undefined,
    };
    if (typeof record.published === 'string' && record.published.includes('T')) row.published = record.published;
    if (typeof record.image === 'string' && record.image.startsWith('https://')) row.image = record.image;
    return isDailyRelevant(row) ? [row] : [];
  });
}
