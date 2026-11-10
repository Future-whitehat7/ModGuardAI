import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import {
  EXPECTED_AMOUNT_CENTS,
  PAYMENT_LINK_URL,
  applyStripeEvent,
  completeWebhook,
  createIntake,
  handleWebhookRequest,
  memoryStore,
  operatorCommand,
  payLinkForOrder,
  readConfig,
  readStatus,
} from '../netlify/functions/lib/order-machine.mjs';
import { runPaidResearch } from '../netlify/functions/lib/research-runner.mjs';

const NOW = 1_700_000_000_000;
const SECRET = 'whsec_test_only';
const LINK = 'plink_test_existing_199';

function config(overrides = {}) {
  return readConfig({
    APP_ENV: 'preview',
    STRIPE_WEBHOOK_SECRET: SECRET,
    STRIPE_PAYMENT_LINK_ID: LINK,
    OPERATOR_TOKEN: 'operator-test-token',
    ALLOW_TEST_NAMESPACE: '1',
    ...overrides,
  });
}

function intakeBody(tier = '199') {
  return {
    name: 'Example Creator',
    email: 'example-creator@example.com',
    role: 'creator',
    tier,
    accounts: { website: 'https://example.com/example_creator_not_real' },
    knownFakes: 'https://example.com/synthetic-fake-profile',
    dmsForMoney: 'no',
    consents: { accounts: true, deliverable: true, limits: true },
  };
}

function session(orderId, overrides = {}) {
  return {
    object: 'checkout.session',
    id: 'cs_test_1',
    mode: 'payment',
    livemode: false,
    currency: 'usd',
    amount_total: EXPECTED_AMOUNT_CENTS,
    payment_link: LINK,
    payment_status: 'paid',
    client_reference_id: orderId,
    ...overrides,
  };
}

function event(id, type, orderId, overrides) {
  return { id, type, data: { object: session(orderId, overrides) } };
}

function sign(raw, secret = SECRET, timestamp = Math.floor(NOW / 1000)) {
  const v1 = createHmac('sha256', secret).update(`${timestamp}.${raw}`).digest('hex');
  return `t=${timestamp},v1=${v1}`;
}

async function storedOrder(store, created) {
  return store.get(`order:${created.body.namespace}:${created.body.orderId}`);
}

test('a stored intake returns one access token and a payment link that only carries the order id', async () => {
  const store = memoryStore();
  const created = await createIntake({ store, config: config(), body: intakeBody(), now: NOW });
  assert.equal(created.status, 201);
  assert.match(created.body.orderId, /^ord_[a-f0-9]{32}$/);
  assert.equal(created.body.payment, 'unverified');
  assert.equal(created.body.payUrl, payLinkForOrder(created.body.orderId));
  assert.equal(created.body.payUrl.includes(created.body.accessToken), false);
  assert.equal(created.body.payUrl.startsWith(PAYMENT_LINK_URL), true);
  const saved = await storedOrder(store, created);
  assert.equal(JSON.stringify(saved).includes(created.body.accessToken), false);
  const status = await readStatus({ store, accessToken: created.body.accessToken });
  assert.equal(status.status, 200);
  assert.equal(status.body.state, 'awaiting_payment');
  assert.equal(status.body.evidence, null);
});

test('the 499 option is stored and does not receive the $199 payment link', async () => {
  const store = memoryStore();
  const created = await createIntake({ store, config: config(), body: intakeBody('499'), now: NOW });
  assert.equal(created.status, 201);
  assert.equal(created.body.payUrl, null);
  assert.equal(created.body.state, 'awaiting_manual_payment');
});

test('order id alone and a wrong token cannot read an intake', async () => {
  const store = memoryStore();
  const created = await createIntake({ store, config: config(), body: intakeBody(), now: NOW });
  const byId = await readStatus({ store, accessToken: created.body.orderId });
  const wrong = await readStatus({ store, accessToken: 'not-the-token' });
  const missing = await readStatus({ store, accessToken: '' });
  assert.equal(byId.status, 401);
  assert.equal(wrong.status, 401);
  assert.equal(missing.status, 401);
  assert.equal(byId.body.error, wrong.body.error);
});

test('a test intake is invisible to a live-namespace status token and is gated', async () => {
  const store = memoryStore();
  const denied = await createIntake({
    store,
    config: config({ ALLOW_TEST_NAMESPACE: '0' }),
    body: intakeBody(),
    namespaceHeader: 'test',
    now: NOW,
  });
  assert.equal(denied.status, 403);
  const created = await createIntake({
    store,
    config: config(),
    body: intakeBody(),
    namespaceHeader: 'test',
    now: NOW,
  });
  assert.equal(created.body.namespace, 'test');
  const preview = await createIntake({ store, config: config(), body: intakeBody(), now: NOW });
  assert.equal(preview.body.namespace, 'preview');
  assert.notEqual(created.body.orderId, preview.body.orderId);
});

test('missing webhook config does not mark an order paid', async () => {
  const store = memoryStore();
  const created = await createIntake({ store, config: config(), body: intakeBody(), now: NOW });
  const raw = JSON.stringify(event('evt_1', 'checkout.session.completed', created.body.orderId));
  const result = await handleWebhookRequest({
    store,
    config: config({ STRIPE_WEBHOOK_SECRET: '', STRIPE_PAYMENT_LINK_ID: '' }),
    rawBody: raw,
    signature: sign(raw),
    now: NOW,
  });
  assert.equal(result.status, 503);
  assert.equal((await storedOrder(store, created)).state, 'awaiting_payment');
});

test('a bad signature, wrong amount, and unknown reference do not verify payment', async () => {
  const store = memoryStore();
  const created = await createIntake({ store, config: config(), body: intakeBody(), now: NOW });
  const raw = JSON.stringify(event('evt_bad', 'checkout.session.completed', created.body.orderId));
  const bad = await handleWebhookRequest({
    store,
    config: config(),
    rawBody: raw,
    signature: sign(raw, 'whsec_other'),
    now: NOW,
  });
  assert.equal(bad.status, 400);
  const wrongAmount = event('evt_amount', 'checkout.session.completed', created.body.orderId, { amount_total: 100 });
  const amount = await applyStripeEvent({ store, config: config(), event: wrongAmount, now: NOW });
  assert.equal(amount.body.reason, 'wrong_amount');
  const forged = event('evt_forged', 'checkout.session.completed', 'ord_' + 'ab'.repeat(16));
  const missing = await applyStripeEvent({ store, config: config(), event: forged, now: NOW });
  assert.equal(missing.body.reason, 'missing_intake');
  assert.equal(await store.get(`order:preview:${forged.data.object.client_reference_id}`), null);
  assert.equal((await storedOrder(store, created)).payment.verified, false);
  assert.equal(JSON.stringify(amount.body).includes('example-creator@example.com'), false);
});

test('a matching signed session pays once, and replay or a later expiry does not undo it', async () => {
  const store = memoryStore();
  const created = await createIntake({ store, config: config(), body: intakeBody(), now: NOW });
  const paidEvent = event('evt_paid', 'checkout.session.completed', created.body.orderId);
  const raw = JSON.stringify(paidEvent);
  const first = await handleWebhookRequest({ store, config: config(), rawBody: raw, signature: sign(raw), now: NOW });
  const second = await handleWebhookRequest({ store, config: config(), rawBody: raw, signature: sign(raw), now: NOW + 1000 });
  const expired = await applyStripeEvent({
    store,
    config: config(),
    event: event('evt_exp', 'checkout.session.expired', created.body.orderId),
    now: NOW + 2000,
  });
  const failed = await applyStripeEvent({
    store,
    config: config(),
    event: event('evt_fail', 'checkout.session.async_payment_failed', created.body.orderId),
    now: NOW + 3000,
  });
  const order = await storedOrder(store, created);
  assert.equal(first.body.result, 'paid');
  assert.equal(second.body.duplicate, true);
  assert.equal(expired.body.result, 'ignored_after_paid');
  assert.equal(failed.body.result, 'ignored_after_paid');
  assert.equal(order.state, 'paid');
  assert.equal(order.payment.verified, true);
  assert.equal(order.evidence, null);
  assert.equal(order.processedEventIds.filter((id) => id === 'evt_paid').length, 1);
});

test('an unpaid completion waits, a later success pays, and expiry before payment can still be paid', async () => {
  const store = memoryStore();
  const created = await createIntake({ store, config: config(), body: intakeBody(), now: NOW });
  const waiting = await applyStripeEvent({
    store,
    config: config(),
    event: event('evt_wait', 'checkout.session.completed', created.body.orderId, { payment_status: 'unpaid' }),
    now: NOW,
  });
  assert.equal((await storedOrder(store, created)).state, 'payment_pending');
  assert.equal(waiting.body.result, 'payment_pending');
  await applyStripeEvent({
    store,
    config: config(),
    event: event('evt_ok', 'checkout.session.async_payment_succeeded', created.body.orderId, { payment_status: 'paid' }),
    now: NOW + 1,
  });
  assert.equal((await storedOrder(store, created)).state, 'paid');

  const other = await createIntake({ store, config: config(), body: intakeBody(), now: NOW });
  await applyStripeEvent({
    store,
    config: config(),
    event: event('evt_old', 'checkout.session.expired', other.body.orderId),
    now: NOW,
  });
  assert.equal((await storedOrder(store, other)).state, 'expired');
  await applyStripeEvent({
    store,
    config: config(),
    event: event('evt_late', 'checkout.session.completed', other.body.orderId),
    now: NOW + 5,
  });
  assert.equal((await storedOrder(store, other)).state, 'paid');
});

test('a live-mode event is rejected on the preview config', async () => {
  const store = memoryStore();
  const created = await createIntake({ store, config: config(), body: intakeBody(), now: NOW });
  const result = await applyStripeEvent({
    store,
    config: config(),
    event: event('evt_live', 'checkout.session.completed', created.body.orderId, { livemode: true }),
    now: NOW,
  });
  assert.equal(result.body.reason, 'wrong_environment');
  assert.equal((await storedOrder(store, created)).state, 'awaiting_payment');
});

test('delivery requires paid state, operator evidence, and explicit approval, and does not send mail', async () => {
  const store = memoryStore();
  const cfg = config();
  const created = await createIntake({ store, config: cfg, body: intakeBody(), now: NOW });
  const early = await operatorCommand({
    store,
    config: cfg,
    authorization: 'Bearer operator-test-token',
    body: { action: 'save-evidence', namespace: 'preview', orderId: created.body.orderId, evidence: { summary: 'Reviewed', items: [{ url: 'https://example.com/a', finding: 'The handle does not match.' }] } },
    now: NOW,
  });
  assert.equal(early.status, 409);
  await applyStripeEvent({
    store,
    config: cfg,
    event: event('evt_pay', 'checkout.session.completed', created.body.orderId),
    now: NOW,
  });
  const empty = await operatorCommand({
    store,
    config: cfg,
    authorization: 'Bearer operator-test-token',
    body: { action: 'save-evidence', namespace: 'preview', orderId: created.body.orderId, evidence: { summary: '', items: [] } },
    now: NOW,
  });
  assert.equal(empty.status, 400);
  const unauth = await operatorCommand({
    store,
    config: cfg,
    authorization: 'Bearer wrong',
    body: { action: 'approve', namespace: 'preview', orderId: created.body.orderId },
    now: NOW,
  });
  assert.equal(unauth.status, 401);
  const saved = await operatorCommand({
    store,
    config: cfg,
    authorization: 'Bearer operator-test-token',
    body: {
      action: 'save-evidence',
      namespace: 'preview',
      orderId: created.body.orderId,
      evidence: { summary: 'Reviewed the supplied URL.', items: [{ url: 'https://example.com/synthetic-fake-profile', finding: 'The profile is not the official example.' }] },
    },
    now: NOW + 1,
  });
  assert.equal(saved.body.state, 'evidence_recorded');
  const skipped = await operatorCommand({
    store,
    config: cfg,
    authorization: 'Bearer operator-test-token',
    body: { action: 'prepare-delivery', namespace: 'preview', orderId: created.body.orderId },
    now: NOW + 2,
  });
  assert.equal(skipped.status, 409);
  await operatorCommand({
    store,
    config: cfg,
    authorization: 'Bearer operator-test-token',
    body: { action: 'approve', namespace: 'preview', orderId: created.body.orderId },
    now: NOW + 3,
  });
  const ready = await operatorCommand({
    store,
    config: cfg,
    authorization: 'Bearer operator-test-token',
    body: { action: 'prepare-delivery', namespace: 'preview', orderId: created.body.orderId },
    now: NOW + 4,
  });
  const again = await operatorCommand({
    store,
    config: cfg,
    authorization: 'Bearer operator-test-token',
    body: { action: 'prepare-delivery', namespace: 'preview', orderId: created.body.orderId },
    now: NOW + 5,
  });
  assert.equal(ready.body.state, 'delivery_ready');
  assert.equal(ready.body.emailSent, false);
  assert.equal(ready.body.deliverySent, false);
  assert.equal(again.body.replay, true);
  const customer = await readStatus({ store, accessToken: created.body.accessToken });
  assert.equal(customer.body.evidence.summary, 'Reviewed the supplied URL.');
  assert.equal(customer.body.deliverySent, false);
  assert.equal(customer.body.emailStatus, 'skipped_unconfigured');
  assert.equal(customer.body.evidence.items[0].reportSteps.length > 0, true);
});

function profileHtml(title) {
  return `<!doctype html><html><head><title>${title}</title><meta property="og:title" content="${title}" /></head><body>${title}</body></html>`;
}

function researchFetch(url) {
  const href = String(url);
  if (href.includes('examplecreat0r')) {
    return new Response(profileHtml('Example Creat0r'), { status: 200, headers: { 'content-type': 'text/html' } });
  }
  if (href.includes('notrealhandle')) return new Response('missing', { status: 404, headers: { 'content-type': 'text/html' } });
  return new Response('unexpected', { status: 599 });
}

test('a signed payment researches the submitted links and emails the buyer plus each operator', async () => {
  const store = memoryStore();
  const sent = [];
  const mailer = {
    async send(message) {
      sent.push(message);
      return { ok: true, id: `email_${sent.length}` };
    },
  };
  const cfg = config({
    RESEND_API_KEY: 're_test_only',
    RESEND_FROM: 'research@example.com',
    DELIVERY_SEND_ENABLED: '1',
    OPERATOR_EMAIL: 'owner@example.com, second-operator@example.com',
    PUBLIC_SITE_URL: 'https://example.com',
    RESEARCH_TRIGGER_TOKEN: 'trigger-test',
  });
  const body = intakeBody();
  body.accounts = { instagram: 'https://instagram.com/examplecreator' };
  body.knownFakes = 'https://instagram.com/examplecreat0r\nhttps://www.tiktok.com/@notrealhandle';
  const created = await createIntake({ store, config: cfg, body, now: NOW });
  const raw = JSON.stringify(event('evt_auto', 'checkout.session.completed', created.body.orderId));
  const result = await completeWebhook({
    store,
    config: cfg,
    rawBody: raw,
    signature: sign(raw),
    now: NOW,
    kick: async (target) => {
      const research = await runPaidResearch({
        store,
        config: cfg,
        orderId: target.orderId,
        namespace: target.namespace,
        now: NOW,
        mailer,
        fetchImpl: researchFetch,
        resolveImpl: async () => ['93.184.216.34'],
      });
      assert.equal(research.body.emailSent, true);
      return { ok: true };
    },
  });
  assert.equal(result.body.result, 'paid');
  const customerMessages = sent.filter((message) => message.to === 'example-creator@example.com');
  assert.equal(customerMessages.map((message) => message.kind).join(','), 'confirmation,results');
  const resultsMail = customerMessages[1];
  assert.match(resultsMail.html, /examplecreat0r/);
  assert.match(resultsMail.html, /Data confidence/);
  assert.match(resultsMail.html, /https:\/\/help\.instagram\.com\//);
  assert.match(resultsMail.html, /access=/);
  assert.match(resultsMail.text, /not a determination/i);
  assert.equal(resultsMail.html.toLowerCase().includes('modguard'), false);
  assert.equal(resultsMail.text.toLowerCase().includes('modguard'), false);
  assert.equal(resultsMail.pdfText.toLowerCase().includes('modguard'), false);
  assert.equal(resultsMail.attachments[0].filename, 'account-research.pdf');
  assert.equal(Buffer.from(resultsMail.attachments[0].contentBase64, 'base64').subarray(0, 4).toString(), '%PDF');
  assert.match(resultsMail.html, new RegExp(created.body.accessToken));
  const operators = sent.filter((message) => message.kind === 'operator').map((message) => message.to);
  assert.deepEqual(operators, ['owner@example.com', 'second-operator@example.com']);
  assert.match(sent.find((message) => message.to === 'owner@example.com').text, new RegExp(created.body.orderId));
  assert.match(sent.find((message) => message.to === 'second-operator@example.com').text, /example-creator@example.com/);
  assert.equal(sent.find((message) => message.kind === 'operator').text.includes(created.body.accessToken), false);
  const status = await readStatus({ store, accessToken: created.body.accessToken });
  assert.equal(status.body.report, 'delivery_ready');
  assert.equal(status.body.emailSent, true);
  assert.equal(status.body.evidence.items.length, 2);
  assert.equal(status.body.evidence.items[0].httpStatus, 200);
  assert.equal(status.body.offers.length, 2);
  assert.equal(status.body.offers[0].placeholder, true);
  assert.equal(status.body.offers.some((offer) => /\$\d/.test(offer.price)), false);
  const again = await runPaidResearch({
    store,
    config: cfg,
    orderId: created.body.orderId,
    namespace: created.body.namespace,
    now: NOW + 10,
    mailer,
    fetchImpl: researchFetch,
    resolveImpl: async () => ['93.184.216.34'],
  });
  assert.equal(again.body.replay, true);
  assert.equal(sent.filter((message) => message.kind === 'results').length, 1);
});

test('a failed operator address is recorded and the next run sends only that address', async () => {
  const store = memoryStore();
  const sent = [];
  const mailer = {
    async send(message) {
      if (message.kind === 'operator' && message.to === 'second-operator@example.com' && !sent.some((item) => item.to === message.to && item.kind === 'operator')) {
        sent.push({ ...message, failed: true });
        return { ok: false, error: 'resend_503', id: null };
      }
      sent.push(message);
      return { ok: true, id: 'ok' };
    },
  };
  const cfg = config({
    RESEND_API_KEY: 're_test_only',
    RESEND_FROM: 'research@example.com',
    DELIVERY_SEND_ENABLED: '1',
    OPERATOR_EMAIL: 'owner@example.com, second-operator@example.com, not-an-email',
    PUBLIC_SITE_URL: 'https://modguardai.org',
  });
  const created = await createIntake({ store, config: cfg, body: intakeBody(), now: NOW });
  await applyStripeEvent({
    store,
    config: cfg,
    event: event('evt_ops', 'checkout.session.completed', created.body.orderId),
    now: NOW,
  });
  await runPaidResearch({
    store,
    config: cfg,
    orderId: created.body.orderId,
    namespace: 'preview',
    now: NOW,
    mailer,
    fetchImpl: async () => new Response('missing', { status: 404, headers: { 'content-type': 'text/html' } }),
    resolveImpl: async () => ['93.184.216.34'],
  });
  const order = await storedOrder(store, created);
  assert.equal(order.delivery.operator.status, 'partial');
  assert.equal(order.delivery.results.sent, true);
  assert.equal(order.delivery.operator.recipients.find((item) => item.to === 'not-an-email').error, 'invalid_address');
  const before = sent.filter((message) => message.kind === 'operator' && message.to === 'owner@example.com' && !message.failed).length;
  await runPaidResearch({
    store,
    config: cfg,
    orderId: created.body.orderId,
    namespace: 'preview',
    now: NOW + 20,
    mailer,
    fetchImpl: async () => new Response('missing', { status: 404, headers: { 'content-type': 'text/html' } }),
    resolveImpl: async () => ['93.184.216.34'],
  });
  const ownerSends = sent.filter((message) => message.kind === 'operator' && message.to === 'owner@example.com' && !message.failed);
  const secondSends = sent.filter((message) => message.kind === 'operator' && message.to === 'second-operator@example.com' && !message.failed);
  assert.equal(ownerSends.length, before);
  assert.equal(secondSends.length, 1);
  assert.equal((await storedOrder(store, created)).delivery.operator.status, 'partial');
});

test('a failed customer send is recorded and the next run retries it', async () => {
  const store = memoryStore();
  let failResults = true;
  const sent = [];
  const mailer = {
    async send(message) {
      if (message.kind === 'results' && failResults) {
        failResults = false;
        return { ok: false, error: 'resend_503', id: null };
      }
      sent.push(message);
      return { ok: true, id: 'ok' };
    },
  };
  const cfg = config({
    RESEND_API_KEY: 're_test_only',
    RESEND_FROM: 'research@example.com',
    DELIVERY_SEND_ENABLED: '1',
    PUBLIC_SITE_URL: 'https://modguardai.org',
  });
  const created = await createIntake({ store, config: cfg, body: intakeBody(), now: NOW });
  await applyStripeEvent({
    store,
    config: cfg,
    event: event('evt_retry', 'checkout.session.completed', created.body.orderId),
    now: NOW,
  });
  const first = await runPaidResearch({
    store,
    config: cfg,
    orderId: created.body.orderId,
    namespace: 'preview',
    now: NOW,
    mailer,
    fetchImpl: async () => new Response('missing', { status: 404, headers: { 'content-type': 'text/html' } }),
    resolveImpl: async () => ['93.184.216.34'],
  });
  assert.equal(first.body.emailSent, false);
  assert.equal(first.body.emailStatus, 'failed');
  const failed = await readStatus({ store, accessToken: created.body.accessToken });
  assert.equal(failed.body.report, 'email_failed');
  assert.equal(failed.body.evidence.items.length > 0, true);
  const second = await runPaidResearch({
    store,
    config: cfg,
    orderId: created.body.orderId,
    namespace: 'preview',
    now: NOW + 5,
    mailer,
    fetchImpl: async () => {
      throw new Error('should reuse stored research');
    },
    resolveImpl: async () => ['93.184.216.34'],
  });
  assert.equal(second.body.emailSent, true);
  assert.equal(sent.filter((message) => message.kind === 'results').length, 1);
});

test('production without APP_ENV refuses a signed live event out loud', async () => {
  const store = memoryStore();
  const created = await createIntake({ store, config: config(), body: intakeBody(), now: NOW });
  const logs = [];
  const original = console.error;
  console.error = (...parts) => {
    logs.push(parts.join(' '));
  };
  try {
    const raw = JSON.stringify(event('evt_unset', 'checkout.session.completed', created.body.orderId, { livemode: true }));
    const result = await handleWebhookRequest({
      store,
      config: config({ APP_ENV: '', CONTEXT: 'production' }),
      rawBody: raw,
      signature: sign(raw),
      now: NOW,
    });
    assert.equal(result.status, 500);
    assert.equal(result.body.error, 'app_env_unset');
    assert.match(logs.join('\n'), /APP_ENV is unset/);
    assert.equal((await storedOrder(store, created)).state, 'awaiting_payment');
  } finally {
    console.error = original;
  }
});
