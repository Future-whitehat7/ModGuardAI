import { useEffect, useState } from 'react';
import { rankDaily, readDailyItems, strongStats, type DailyItem } from '../../lib/daily';
import { selectPublicPosts, type PublicPost } from '../../lib/buzzQuality';

export type BuzzPost = PublicPost;

export interface DailyStat {
  label: string;
  value: number;
  source: string;
  url: string;
}

export interface DailyFeed {
  asOf: string;
  news: DailyItem[];
  stats: DailyStat[];
  posts: BuzzPost[];
  live: string[];
}

function isPost(value: unknown): value is BuzzPost {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.platform === 'string'
    && typeof record.author === 'string'
    && typeof record.text === 'string'
    && typeof record.url === 'string'
    && record.url.startsWith('https://');
}

function readPosts(value: unknown): BuzzPost[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isPost(item)) return [];
    const post: BuzzPost = {
      platform: item.platform,
      author: item.author,
      text: item.text,
      url: item.url,
      time: item.time,
    };
    if (typeof item.avatar === 'string' && item.avatar.startsWith('https://')) post.avatar = item.avatar;
    if (typeof item.likes === 'number') post.likes = item.likes;
    if (typeof item.replies === 'number') post.replies = item.replies;
    if (typeof item.reposts === 'number') post.reposts = item.reposts;
    return [post];
  });
}

function readStats(value: unknown): DailyStat[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== 'object' || item === null) return [];
    const record = item as Record<string, unknown>;
    if (typeof record.label !== 'string' || typeof record.value !== 'number' || typeof record.url !== 'string') return [];
    return [{
      label: record.label,
      value: record.value,
      source: typeof record.source === 'string' ? record.source : '',
      url: record.url,
    }];
  });
}

async function readJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(url);
  return response.json() as Promise<unknown>;
}

export function useDailyFeed() {
  const [feed, setFeed] = useState<DailyFeed | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      let news: DailyItem[] = [];
      let stats: DailyStat[] = [];
      let posts: BuzzPost[] = [];
      let live: string[] = [];
      let asOf = '';
      try {
        const liveFeed = await readJson('/api/daily') as Record<string, unknown>;
        news = rankDaily(readDailyItems(liveFeed.news));
        stats = strongStats(readStats(liveFeed.stats));
        posts = selectPublicPosts(readPosts(liveFeed.posts));
        live = Array.isArray(liveFeed.live) ? liveFeed.live.filter((item) => typeof item === 'string') : [];
        asOf = typeof liveFeed.asOf === 'string' ? liveFeed.asOf : '';
      } catch {
        // The scheduled file is the same public feed when the function is not running.
      }
      if (!news.length) {
        try {
          const cached = await readJson('/threats.json') as Record<string, unknown>;
          news = rankDaily(readDailyItems(cached.items));
          if (!stats.length) stats = strongStats(readStats(cached.stats));
          if (!asOf && typeof cached.asOf === 'string') asOf = cached.asOf;
        } catch {
          news = [];
        }
      }
      if (!posts.length) {
        try {
          const cached = await readJson('/buzz.json') as Record<string, unknown>;
          posts = selectPublicPosts(readPosts(cached.posts));
          if (!live.length && Array.isArray(cached.live)) {
            live = cached.live.filter((item) => typeof item === 'string');
          }
        } catch {
          posts = [];
        }
      }
      if (!cancelled) {
        setFeed({ asOf, news, stats, posts, live });
        setReady(true);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { feed, ready };
}
