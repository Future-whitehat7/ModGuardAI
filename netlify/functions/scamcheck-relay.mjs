/** Same-origin relay to the existing ScamCheck service. Nothing is stored here. */

const TARGETS = {
  message: 'https://scamcheck.modguardai.org/api/check',
  statement: 'https://scamcheck.modguardai.org/api/charges',
};

const LIMITS = {
  message: 6000,
  statement: 8000,
};

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

function reply(status, body) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export function prepareRelay(input) {
  const kind = input?.kind;
  const target = TARGETS[kind];
  if (!target) return { error: 'Choose a message or a statement.', status: 400 };
  const text = typeof input.text === 'string' ? input.text : '';
  const image = typeof input.image === 'string' && input.image.length > 0 ? input.image : undefined;
  if (text.length > LIMITS[kind]) return { error: 'That is too long to check.', status: 400 };
  if (image && (!image.startsWith('data:image/') || image.length > 5_500_000)) {
    return { error: 'Screenshot must be an image under 4 MB.', status: 400 };
  }
  if (!text.trim() && !image) return { error: 'Paste something to check.', status: 400 };
  return { target, body: image ? { text, image } : { text } };
}

export default async (req) => {
  if (req.method !== 'POST') return reply(405, { error: 'Method not allowed' });
  let input;
  try {
    input = await req.json();
  } catch {
    return reply(400, { error: 'Paste something to check.' });
  }
  const prepared = prepareRelay(input);
  if (prepared.error) return reply(prepared.status, { error: prepared.error });
  try {
    const upstream = await fetch(prepared.target, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(prepared.body),
      signal: AbortSignal.timeout(20000),
    });
    const payload = await upstream.text();
    return new Response(payload, {
      status: upstream.status,
      headers: JSON_HEADERS,
    });
  } catch {
    return reply(502, { error: 'ScamCheck is unavailable right now.' });
  }
};

export const config = { path: '/api/scamcheck' };
