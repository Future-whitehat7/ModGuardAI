import { collectThreats } from './lib/collect.mjs';

export default async () => {
  const payload = await collectThreats();
  return new Response(JSON.stringify({ ok: true, asOf: payload.asOf, items: payload.items.length }), {
    headers: { 'content-type': 'application/json' },
  });
};

export const config = { schedule: '*/15 * * * *' };
