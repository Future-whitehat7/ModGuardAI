import { collectThreats } from './lib/collect.mjs';

const TTL = 15 * 60 * 1000;
let cached = { at: 0, body: null };

export default async () => {
  const now = Date.now();
  if (!cached.body || now - cached.at > TTL) {
    try {
      const fresh = await collectThreats(now);
      if (fresh.stats.length || fresh.items.length) cached = { at: now, body: fresh };
    } catch {
      // Keep the last good payload. The client also falls back to /threats.json.
    }
  }
  const body = cached.body ?? { asOf: null, stats: [], pulses: [], items: [], dots: [], skipped: ['No public data available.'] };
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=900, s-maxage=900',
    },
  });
};

export const config = { path: '/pulse.json' };
