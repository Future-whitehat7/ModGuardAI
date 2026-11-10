import { openBlobStore } from './blob-store.mjs';
import {
  completeWebhook,
  createIntake,
  operatorCommand,
  readConfig,
  readStatus,
  warnIfAppEnvUnset,
} from './order-machine.mjs';
import { kickResearch } from './research-runner.mjs';
import { createResendMailer, deliveryConfigured } from './resend.mjs';

warnIfAppEnvUnset(process.env);

function mailerFor(config) {
  if (!deliveryConfigured(config)) return null;
  return createResendMailer({ apiKey: config.resendApiKey, from: config.resendFrom });
}

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
  return withStore((store, config) => completeWebhook({
    store,
    config,
    rawBody,
    signature: request.headers.get('stripe-signature') || '',
    now: Date.now(),
    kick: (target) => kickResearch(config, target),
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
  return withStore(async (store, config) => {
    const result = await operatorCommand({
      store,
      config,
      authorization: request.headers.get('authorization') || '',
      body,
      now: Date.now(),
      mailer: mailerFor(config),
    });
    if (!result.kick) return result;
    const kicked = await kickResearch(config, result.kick);
    if (!kicked.ok) return { status: 503, body: { error: kicked.error || 'research_not_started', queued: false } };
    return result;
  });
}
