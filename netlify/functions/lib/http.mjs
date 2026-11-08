import { readConfig, createIntake, readStatus, handleWebhookRequest, operatorCommand } from './order-machine.mjs';
import { openBlobStore } from './blob-store.mjs';

function json(result) {
  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

async function withStore(work) {
  let store;
  try {
    store = await openBlobStore();
  } catch {
    return json({ status: 503, body: { error: 'store_unconfigured' } });
  }
  try {
    return json(await work(store, readConfig(process.env)));
  } catch {
    return json({ status: 500, body: { error: 'unavailable' } });
  }
}

export async function intakeFunction(request) {
  if (request.method !== 'POST') return json({ status: 405, body: { error: 'method' } });
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ status: 400, body: { error: 'bad_payload' } });
  }
  return withStore((store, config) => createIntake({
    store,
    config,
    body,
    namespaceHeader: request.headers.get('x-modguard-namespace'),
    idempotencyKey: request.headers.get('idempotency-key'),
    now: Date.now(),
  }));
}

export async function statusFunction(request) {
  if (request.method !== 'GET') return json({ status: 405, body: { error: 'method' } });
  const header = request.headers.get('authorization') || '';
  const accessToken = header.startsWith('Bearer ') ? header.slice(7) : '';
  return withStore((store) => readStatus({ store, accessToken }));
}

export async function webhookFunction(request) {
  if (request.method !== 'POST') return json({ status: 405, body: { error: 'method' } });
  const rawBody = await request.text();
  return withStore((store, config) => handleWebhookRequest({
    store,
    config,
    rawBody,
    signature: request.headers.get('stripe-signature') || '',
    now: Date.now(),
  }));
}

export async function operatorFunction(request) {
  if (request.method !== 'POST') return json({ status: 405, body: { error: 'method' } });
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ status: 400, body: { error: 'bad_payload' } });
  }
  return withStore((store, config) => operatorCommand({
    store,
    config,
    authorization: request.headers.get('authorization') || '',
    body,
    now: Date.now(),
  }));
}
