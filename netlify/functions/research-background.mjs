import { openBlobStore } from './lib/blob-store.mjs';
import { isOrderId, readConfig, tokensEqual, warnIfAppEnvUnset } from './lib/order-machine.mjs';
import { runPaidResearch } from './lib/research-runner.mjs';
import { createResendMailer, deliveryConfigured } from './lib/resend.mjs';

warnIfAppEnvUnset(process.env);

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export default async function researchBackground(request) {
  if (request.method !== 'POST') return json({ error: 'method' }, 405);
  const config = readConfig(process.env);
  const presented = request.headers.get('x-research-token') || '';
  if (!config.researchTriggerToken || !tokensEqual(presented, config.researchTriggerToken)) {
    return json({ error: 'unauthorized' }, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_payload' }, 400);
  }
  const namespace = body?.namespace === 'test' ? 'test' : body?.namespace === 'preview' ? 'preview' : body?.namespace === 'live' ? 'live' : '';
  if (!namespace || !isOrderId(body?.orderId)) return json({ error: 'bad_order' }, 400);
  if (namespace === 'test' && !config.allowTestNamespace) return json({ error: 'test_namespace_disabled' }, 403);
  let store;
  try {
    store = await openBlobStore();
  } catch {
    return json({ error: 'store_unconfigured' }, 503);
  }
  const mailer = deliveryConfigured(config)
    ? createResendMailer({ apiKey: config.resendApiKey, from: config.resendFrom })
    : null;
  try {
    const result = await runPaidResearch({
      store,
      config,
      orderId: body.orderId,
      namespace,
      now: Date.now(),
      mailer,
    });
    return json(result.body, result.status);
  } catch {
    return json({ error: 'research_failed' }, 500);
  }
}

export const config = { path: '/api/research-background' };
