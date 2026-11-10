import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { verifyStripeSignature } from './stripe-signature.mjs';

export const PAYMENT_LINK_URL = 'https://buy.stripe.com/28E6oIgDKc8S8NfdAD4ZG07';
export const EXPECTED_AMOUNT_CENTS = 19900;
export const EXPECTED_CURRENCY = 'usd';
export const EXPECTED_PRODUCT_ID = 'prod_VXv9gdCuSuHkK3';

const ORDER_ID = /^ord_[a-f0-9]{32}$/;
const STRIPE_EVENTS = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
]);

export function readConfig(env) {
  const appEnv = env.APP_ENV === 'production' ? 'production' : 'preview';
  return {
    appEnv,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET || '',
    paymentLinkId: env.STRIPE_PAYMENT_LINK_ID || '',
    operatorToken: env.OPERATOR_TOKEN || '',
    allowTestNamespace: appEnv !== 'production' && env.ALLOW_TEST_NAMESPACE === '1',
    resendApiKey: env.RESEND_API_KEY || '',
    resendFrom: env.RESEND_FROM || '',
    deliverySendEnabled: env.DELIVERY_SEND_ENABLED === '1',
  };
}

export function paymentsConfigured(config) {
  return Boolean(config.webhookSecret && config.paymentLinkId);
}

export function memoryStore() {
  const data = new Map();
  return {
    async get(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null;
    },
    async set(key, value) {
      data.set(key, structuredClone(value));
    },
  };
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function newId(prefix) {
  return `${prefix}${randomBytes(16).toString('hex')}`;
}

function orderKey(namespace, orderId) {
  return `order:${namespace}:${orderId}`;
}

function refKey(orderId) {
  return `ref:${orderId}`;
}

function accessKey(hash) {
  return `access:${hash}`;
}

function eventKey(eventId) {
  return `event:${eventId}`;
}

function audit(order, action, from, to, now, extra = {}) {
  order.audit.push({ at: now, action, from, to, ...extra });
}

export function payLinkForOrder(orderId) {
  const url = new URL(PAYMENT_LINK_URL);
  url.searchParams.set('client_reference_id', orderId);
  return url.toString();
}

function text(value, max) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function httpsUrl(value) {
  const raw = text(value, 500);
  if (!raw) return '';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return '';
    return url.toString();
  } catch {
    return '';
  }
}

export function normalizeIntake(body) {
  const accounts = body?.accounts && typeof body.accounts === 'object' ? body.accounts : {};
  const links = {
    tiktok: httpsUrl(accounts.tiktok),
    instagram: httpsUrl(accounts.instagram),
    youtube: httpsUrl(accounts.youtube),
    x: httpsUrl(accounts.x),
    facebook: httpsUrl(accounts.facebook),
    website: httpsUrl(accounts.website),
    other: text(accounts.other, 500),
  };
  const hasLink = Object.entries(links).some(([key, value]) => key !== 'other' && value);
  const consents = body?.consents && typeof body.consents === 'object' ? body.consents : {};
  const tier = body?.tier === '499' ? '499' : body?.tier === '199' ? '199' : '';
  const intake = {
    name: text(body?.name, 200),
    email: text(body?.email, 200),
    role: body?.role === 'manager' ? 'manager' : body?.role === 'creator' ? 'creator' : '',
    tier,
    links,
    knownFakes: text(body?.knownFakes, 4000),
    nameVariations: text(body?.nameVariations, 1000),
    dmsForMoney: body?.dmsForMoney === 'yes' || body?.dmsForMoney === 'no' ? body.dmsForMoney : '',
    realOffers: text(body?.realOffers, 2000),
    fanReports: text(body?.fanReports, 2000),
    priority: text(body?.priority, 500),
    sensitive: text(body?.sensitive, 2000),
    consents: {
      accounts: consents.accounts === true,
      deliverable: consents.deliverable === true,
      limits: consents.limits === true,
    },
  };
  if (body?.botField) return { ok: false, error: 'rejected' };
  if (!intake.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(intake.email)) {
    return { ok: false, error: 'incomplete' };
  }
  if (!intake.role || !intake.tier || !intake.dmsForMoney || !intake.knownFakes || !hasLink) {
    return { ok: false, error: 'incomplete' };
  }
  if (!intake.consents.accounts || !intake.consents.deliverable || !intake.consents.limits) {
    return { ok: false, error: 'incomplete' };
  }
  return { ok: true, intake };
}

function publicOrder(order, { includeEvidence }) {
  const report = !order.evidence
    ? 'none'
    : order.state === 'evidence_recorded'
      ? 'draft'
      : order.state === 'delivery_approved' || order.state === 'delivery_ready'
        ? order.state
        : 'draft';
  return {
    orderId: order.orderId,
    namespace: order.namespace,
    tier: order.tier,
    state: order.state,
    payment: order.payment.verified ? 'verified' : 'unverified',
    intake: 'complete',
    report,
    payUrl: order.state === 'awaiting_payment' && order.tier === '199' ? payLinkForOrder(order.orderId) : null,
    deliverySent: order.delivery.sent === true,
    evidence: includeEvidence ? order.evidence : null,
  };
}

export async function createIntake({ store, config, body, namespaceHeader, idempotencyKey, now }) {
  const namespace = namespaceHeader === 'test' ? 'test' : config.appEnv === 'production' ? 'live' : 'preview';
  if (namespace === 'test' && !config.allowTestNamespace) {
    return { status: 403, body: { error: 'test_namespace_disabled' } };
  }
  const parsed = normalizeIntake(body);
  if (!parsed.ok) return { status: 400, body: { error: parsed.error } };
  if (idempotencyKey) {
    const priorId = await store.get(`idem:${namespace}:${idempotencyKey}`);
    if (priorId) {
      const existing = await store.get(orderKey(namespace, priorId));
      if (existing) {
        return {
          status: 200,
          body: { ...publicOrder(existing, { includeEvidence: false }), accessToken: null, replay: true },
        };
      }
    }
  }
  const orderId = newId('ord_');
  const accessToken = randomBytes(32).toString('base64url');
  const order = {
    version: 1,
    orderId,
    namespace,
    tier: parsed.intake.tier,
    state: parsed.intake.tier === '199' ? 'awaiting_payment' : 'awaiting_manual_payment',
    intake: parsed.intake,
    payment: { verified: false, sessionId: null, eventId: null },
    evidence: null,
    approval: null,
    delivery: { sent: false, channel: null },
    processedEventIds: [],
    audit: [{ at: now, action: 'intake_stored', from: null, to: parsed.intake.tier === '199' ? 'awaiting_payment' : 'awaiting_manual_payment' }],
  };
  await store.set(orderKey(namespace, orderId), order);
  await store.set(refKey(orderId), { namespace });
  await store.set(accessKey(sha256(accessToken)), { namespace, orderId });
  if (idempotencyKey) await store.set(`idem:${namespace}:${idempotencyKey}`, orderId);
  return {
    status: 201,
    body: { ...publicOrder(order, { includeEvidence: false }), accessToken, replay: false },
  };
}

function hashesEqual(left, right) {
  return timingSafeEqual(Buffer.from(left, 'utf8'), Buffer.from(right, 'utf8'));
}

export async function readStatus({ store, accessToken }) {
  if (!accessToken) return { status: 401, body: { error: 'unauthorized' } };
  const found = await store.get(accessKey(sha256(accessToken)));
  if (!found) return { status: 401, body: { error: 'unauthorized' } };
  const order = await store.get(orderKey(found.namespace, found.orderId));
  if (!order) return { status: 401, body: { error: 'unauthorized' } };
  const showEvidence = order.state === 'delivery_ready';
  return { status: 200, body: publicOrder(order, { includeEvidence: showEvidence }) };
}

function livemodeMatches(livemode, appEnv) {
  return appEnv === 'production' ? livemode === true : livemode === false;
}

function sessionMatchesOffer(session, config) {
  if (!session || session.object !== 'checkout.session') return 'not_a_session';
  if (session.mode !== 'payment') return 'wrong_mode';
  if (session.currency !== EXPECTED_CURRENCY) return 'wrong_currency';
  if (session.amount_total !== EXPECTED_AMOUNT_CENTS) return 'wrong_amount';
  if (session.payment_link !== config.paymentLinkId) return 'wrong_payment_link';
  if (session.metadata && session.metadata.product_id && session.metadata.product_id !== EXPECTED_PRODUCT_ID) {
    return 'wrong_product';
  }
  const reference = session.client_reference_id;
  if (typeof reference !== 'string' || !ORDER_ID.test(reference)) return 'bad_reference';
  return null;
}

function applyPayment(order, event, session, now, nextState) {
  if (order.processedEventIds.includes(event.id)) return 'duplicate';
  const from = order.state;
  if (from === 'paid' || from === 'evidence_recorded' || from === 'delivery_approved' || from === 'delivery_ready') {
    order.processedEventIds.push(event.id);
    audit(order, 'ignored_after_paid', from, from, now, { eventId: event.id, type: event.type });
    return 'ignored_after_paid';
  }
  if (order.tier !== '199') {
    order.processedEventIds.push(event.id);
    audit(order, 'rejected_tier', from, from, now, { eventId: event.id });
    return 'rejected_tier';
  }
  if (nextState === 'paid' && session.payment_status !== 'paid' && event.type !== 'checkout.session.async_payment_succeeded') {
    order.state = 'payment_pending';
    order.payment.sessionId = session.id ?? order.payment.sessionId;
    order.processedEventIds.push(event.id);
    audit(order, 'payment_pending', from, 'payment_pending', now, { eventId: event.id });
    return 'payment_pending';
  }
  const allowedFrom = nextState === 'paid'
    ? ['awaiting_payment', 'payment_pending', 'payment_failed', 'expired']
    : nextState === 'payment_failed'
      ? ['awaiting_payment', 'payment_pending']
      : ['awaiting_payment', 'payment_pending'];
  if (!allowedFrom.includes(from)) {
    order.processedEventIds.push(event.id);
    audit(order, 'ignored_transition', from, from, now, { eventId: event.id, type: event.type });
    return 'ignored_transition';
  }
  order.state = nextState;
  order.processedEventIds.push(event.id);
  if (nextState === 'paid') {
    order.payment = { verified: true, sessionId: session.id ?? null, eventId: event.id };
  } else if (session?.id) {
    order.payment.sessionId = session.id;
  }
  audit(order, nextState, from, nextState, now, { eventId: event.id, type: event.type });
  return nextState;
}

export async function applyStripeEvent({ store, config, event, now }) {
  if (!paymentsConfigured(config)) return { status: 503, body: { error: 'payments_unconfigured' } };
  if (!event || typeof event.id !== 'string' || !STRIPE_EVENTS.has(event.type)) {
    return { status: 200, body: { accepted: false, reason: 'ignored_event' } };
  }
  const seen = await store.get(eventKey(event.id));
  if (seen) return { status: 200, body: { duplicate: true, result: seen.result } };
  const session = event.data?.object;
  if (!livemodeMatches(session?.livemode, config.appEnv)) {
    await store.set(eventKey(event.id), { result: 'wrong_environment', at: now });
    return { status: 200, body: { accepted: false, reason: 'wrong_environment' } };
  }
  const offerProblem = sessionMatchesOffer(session, config);
  if (offerProblem) {
    await store.set(eventKey(event.id), { result: offerProblem, at: now });
    return { status: 200, body: { accepted: false, reason: offerProblem } };
  }
  const ref = await store.get(refKey(session.client_reference_id));
  if (!ref) {
    await store.set(eventKey(event.id), { result: 'missing_intake', at: now });
    return { status: 200, body: { accepted: false, reason: 'missing_intake' } };
  }
  const key = orderKey(ref.namespace, session.client_reference_id);
  const order = await store.get(key);
  if (!order) {
    await store.set(eventKey(event.id), { result: 'missing_intake', at: now });
    return { status: 200, body: { accepted: false, reason: 'missing_intake' } };
  }
  let next = 'ignored_event';
  if (event.type === 'checkout.session.expired') next = 'expired';
  else if (event.type === 'checkout.session.async_payment_failed') next = 'payment_failed';
  else next = 'paid';
  const result = applyPayment(order, event, session, now, next);
  order.version += 1;
  await store.set(key, order);
  await store.set(eventKey(event.id), { result, at: now, orderId: order.orderId });
  return { status: 200, body: { accepted: result === 'paid' || result === 'expired' || result === 'payment_failed' || result === 'payment_pending', result } };
}

function tokensEqual(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}

export async function operatorCommand({ store, config, authorization, body, now }) {
  if (!config.operatorToken) return { status: 503, body: { error: 'operator_unconfigured' } };
  const presented = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!presented || !tokensEqual(presented, config.operatorToken)) {
    return { status: 401, body: { error: 'unauthorized' } };
  }
  const namespace = body?.namespace === 'test' ? 'test' : body?.namespace === 'preview' ? 'preview' : 'live';
  if (namespace === 'test' && !config.allowTestNamespace) return { status: 403, body: { error: 'test_namespace_disabled' } };
  const orderId = body?.orderId;
  if (typeof orderId !== 'string' || !ORDER_ID.test(orderId)) return { status: 400, body: { error: 'bad_order' } };
  const key = orderKey(namespace, orderId);
  const order = await store.get(key);
  if (!order) return { status: 404, body: { error: 'not_found' } };
  const action = body?.action;
  if (action === 'save-evidence') {
    const summary = text(body?.evidence?.summary, 4000);
    const items = Array.isArray(body?.evidence?.items) ? body.evidence.items : [];
    const cleanItems = items.slice(0, 20).map((item) => ({
      url: text(item?.url, 500),
      finding: text(item?.finding, 2000),
    })).filter((item) => item.url && item.finding);
    if (!summary || cleanItems.length === 0) return { status: 400, body: { error: 'evidence_required' } };
    if (order.payment.verified !== true || order.state === 'awaiting_payment' || order.state === 'payment_pending' || order.state === 'payment_failed' || order.state === 'expired' || order.state === 'awaiting_manual_payment') {
      return { status: 409, body: { error: 'not_paid' } };
    }
    const from = order.state;
    order.evidence = { summary, items: cleanItems, recordedAt: now };
    if (from === 'paid') order.state = 'evidence_recorded';
    order.version += 1;
    audit(order, 'evidence_recorded', from, order.state, now);
    await store.set(key, order);
    return { status: 200, body: publicOrder(order, { includeEvidence: true }) };
  }
  if (action === 'approve') {
    if (order.state !== 'evidence_recorded' || !order.evidence) return { status: 409, body: { error: 'evidence_required' } };
    const from = order.state;
    order.state = 'delivery_approved';
    order.approval = { at: now, by: 'operator' };
    order.version += 1;
    audit(order, 'delivery_approved', from, order.state, now);
    await store.set(key, order);
    return { status: 200, body: publicOrder(order, { includeEvidence: true }) };
  }
  if (action === 'prepare-delivery') {
    if (order.state !== 'delivery_approved' && order.state !== 'delivery_ready') {
      return { status: 409, body: { error: 'approval_required' } };
    }
    if (order.payment.verified !== true) return { status: 409, body: { error: 'not_paid' } };
    if (order.state === 'delivery_ready') {
      return { status: 200, body: { ...publicOrder(order, { includeEvidence: true }), replay: true, emailSent: false } };
    }
    const from = order.state;
    order.state = 'delivery_ready';
    order.delivery = {
      sent: false,
      channel: config.deliverySendEnabled && config.resendApiKey && config.resendFrom ? 'resend_configured_not_sent' : 'not_configured',
    };
    order.version += 1;
    audit(order, 'delivery_ready', from, order.state, now);
    await store.set(key, order);
    return { status: 200, body: { ...publicOrder(order, { includeEvidence: true }), emailSent: false } };
  }
  return { status: 400, body: { error: 'bad_action' } };
}

export async function handleWebhookRequest({ store, config, rawBody, signature, now }) {
  if (!paymentsConfigured(config)) return { status: 503, body: { error: 'payments_unconfigured' } };
  const verified = verifyStripeSignature(rawBody, signature, config.webhookSecret, now);
  if (!verified.ok) return { status: 400, body: { error: 'bad_signature' } };
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { error: 'bad_payload' } };
  }
  return applyStripeEvent({ store, config, event, now });
}
