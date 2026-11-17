import { collectBuzz } from './lib/buzz.mjs';
import { collectThreats } from './lib/collect.mjs';

const TTL = 15 * 60 * 1000;
let cached = { at: 0, body: null };

export default async () => {
  const now = Date.now();
  if (!cached.body || now - cached.at > TTL) {
    const [news, buzz] = await Promise.all([
      collectThreats(now).catch(() => null),
      collectBuzz(process.env).catch(() => ({ posts: [], live: [], skipped: ['buzz'] })),
    ]);
    const body = {
      asOf: news?.asOf ?? buzz.asOf ?? new Date(now).toISOString(),
      news: Array.isArray(news?.items) ? news.items : [],
      stats: Array.isArray(news?.stats) ? news.stats : [],
      posts: Array.isArray(buzz?.posts) ? buzz.posts : [],
      live: Array.isArray(buzz?.live) ? buzz.live : [],
      skipped: Array.isArray(buzz?.skipped) ? buzz.skipped : [],
    };
    if (body.news.length || body.posts.length) cached = { at: now, body };
  }
  const body = cached.body ?? { asOf: null, news: [], stats: [], posts: [], live: [], skipped: [] };
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
};

export const config = { path: '/api/daily' };
