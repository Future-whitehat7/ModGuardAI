import { openBlobStore } from './lib/blob-store.mjs';

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

function reply(status, body) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export default async (req) => {
  const url = new URL(req.url);
  const pair = url.searchParams.get('pair') || '';
  if (!/^[a-z0-9-]{1,40}$/.test(pair)) return reply(400, { total: null });
  let store;
  try {
    store = await openBlobStore();
  } catch {
    return reply(200, { total: null });
  }
  const key = `community-duel:${pair}`;
  try {
    const current = (await store.get(key)) ?? { total: 0, scam: 0 };
    if (req.method === 'GET') {
      return reply(200, { total: current.total > 0 ? current.total : null, scam: current.scam ?? 0 });
    }
    if (req.method !== 'POST') return reply(405, { total: null });
    const body = await req.json();
    const next = {
      total: (current.total ?? 0) + 1,
      scam: (current.scam ?? 0) + (body?.scam === true ? 1 : 0),
    };
    await store.set(key, next);
    return reply(200, { total: next.total, scam: next.scam });
  } catch {
    return reply(200, { total: null });
  }
};

export const config = { path: '/api/scam-vote' };
