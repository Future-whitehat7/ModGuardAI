import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { sendResults } from './deliver.mjs';
import { enrichEvidenceItem } from './research.mjs';
import { verifyStripeSignature } from './stripe-signature.mjs';
import { upsells } from './upsells.mjs';

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

const RESEARCH_LOCK_MS = 12 * 60 * 1000;
let warnedAppEnv = false;

export function warnIfAppEnvUnset(env) {
  const raw = typeof env.APP_ENV === 'string' ? env.APP_ENV.trim() : '';
  const unset = env.CONTEXT === 'production' && raw === '';
  if (unset && !warnedAppEnv) {
    warnedAppEnv = true;
    console.error('APP_ENV is unset while Netlify CONTEXT is production. Live Stripe events are rejected until APP_ENV=production is set.');
  }
  return unset;
}

function cleanOrigin(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\/$/, '');
}

export function parseOperatorEmails(value) {
  if (typeof value !== 'string') return { accepted: [], rejected: [] };
  const accepted = [];
  const rejected = [];
  const seen = new Set();
  for (const part of value.split(',')) {
    if (!part.trim()) continue;
    const wrapped = part.trim().match(/<([^>]+)>/);
    const email = (wrapped ? wrapped[1] : part).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      rejected.push(part.trim().slice(0, 200));
      continue;
    }
    const key = email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    accepted.push(email);
    if (accepted.length >= 8) break;
  }
  return { accepted, rejected };
}

export function readConfig(env) {
  const rawAppEnv = typeof env.APP_ENV === 'string' ? env.APP_ENV.trim() : '';
  const appEnv = rawAppEnv === 'production' ? 'production' : 'preview';
  const operators = parseOperatorEmails(env.OPERATOR_EMAIL);
  warnIfAppEnvUnset(env);
  return {
    appEnv,
    appEnvUnsetInProduction: env.CONTEXT === 'production' && rawAppEnv === '',
    webhookSecret: env.STRIPE_WEBHOOK_SECRET || '',
    paymentLinkId: env.STRIPE_PAYMENT_LINK_ID || '',
    operatorToken: env.OPERATOR_TOKEN || '',
    operatorEmails: operators.accepted,
    operatorEmailsRejected: operators.rejected,
    allowTestNamespace: appEnv !== 'production' && env.ALLOW_TEST_NAMESPACE === '1',
    resendApiKey: env.RESEND_API_KEY || '',
    resendFrom: env.RESEND_FROM || '',
    deliverySendEnabled: env.DELIVERY_SEND_ENABLED === '1',
    publicSiteUrl: cleanOrigin(env.PUBLIC_SITE_URL || env.URL || env.DEPLOY_PRIME_URL || ''),
    functionBaseUrl: cleanOrigin(env.URL || env.DEPLOY_URL || env.PUBLIC_SITE_URL || env.DEPLOY_PRIME_URL || ''),
    researchTriggerToken: env.RESEARCH_TRIGGER_TOKEN || '',
    researchTimeoutMs: 8_000,
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
    async keys(prefix) {
      return [...data.keys()].filter((key) => key.startsWith(prefix));
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

export function orderStorageKey(namespace, orderId) {
  return orderKey(namespace, orderId);
}

export function accessSecretKey(namespace, orderId) {
  return `secret:${namespace}:${orderId}`;
}

export function isOrderId(value) {
  return typeof value === 'string' && ORDER_ID.test(value);
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

function customerReport(order) {
  const research = order.research?.status;
  if (!order.evidence && (research === 'needed' || research === 'running' || research === 'queued')) return 'researching';
  if (!order.evidence && (research === 'failed' || research === 'kick_failed')) return 'research_failed';
  if (!order.evidence) return 'none';
  if (order.delivery?.results?.status === 'failed' || order.state === 'delivery_failed') return 'email_failed';
  if (order.state === 'delivery_ready') return 'delivery_ready';
  if (order.state === 'delivery_approved') return 'delivery_approved';
  if (order.state === 'research_complete') return 'research_complete';
  if (order.state === 'evidence_recorded') return 'draft';
  return 'draft';
}

function customerCanSeeEvidence(order) {
  const report = customerReport(order);
  return report === 'delivery_ready' || report === 'delivery_approved' || report === 'research_complete' || report === 'email_failed';
}

function publicOrder(order, { includeEvidence }) {
  const report = customerReport(order);
  const show = includeEvidence && customerCanSeeEvidence(order);
  const emailStatus = order.delivery?.results?.status || (order.delivery?.sent ? 'sent' : 'not_sent');
  return {
    orderId: order.orderId,
    namespace: order.namespace,
    tier: order.tier,
    state: order.state,
    payment: order.payment.verified ? 'verified' : 'unverified',
    intake: 'complete',
    report,
    research: order.research?.status || 'not_started',
    payUrl: order.state === 'awaiting_payment' && order.tier === '199' ? payLinkForOrder(order.orderId) : null,
    deliverySent: order.delivery?.results?.sent === true || order.delivery?.sent === true,
    emailSent: order.delivery?.results?.sent === true,
    emailStatus,
    offers: show ? upsells : [],
    evidence: show ? order.evidence : null,
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
    research: null,
    delivery: { sent: false, channel: null, results: null, confirmation: null, operator: null },
    processedEventIds: [],
    audit: [{ at: now, action: 'intake_stored', from: null, to: parsed.intake.tier === '199' ? 'awaiting_payment' : 'awaiting_manual_payment' }],
  };
  await store.set(orderKey(namespace, orderId), order);
  await store.set(refKey(orderId), { namespace });
  await store.set(accessKey(sha256(accessToken)), { namespace, orderId });
  await store.set(accessSecretKey(namespace, orderId), { accessToken });
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
  return { status: 200, body: publicOrder(order, { includeEvidence: true }) };
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
    if (order.research?.status !== 'running' && order.research?.status !== 'completed') {
      order.research = { ...(order.research || {}), status: 'needed', neededAt: now };
    }
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
  if (seen) {
    let kick = null;
    if (seen.orderId && seen.namespace) {
      const existing = await store.get(orderKey(seen.namespace, seen.orderId));
      kick = researchKickFor(existing, now);
    }
    return { status: 200, body: { duplicate: true, result: seen.result }, kick };
  }
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
  await store.set(eventKey(event.id), { result, at: now, orderId: order.orderId, namespace: order.namespace });
  return {
    status: 200,
    body: { accepted: result === 'paid' || result === 'expired' || result === 'payment_failed' || result === 'payment_pending', result },
    kick: researchKickFor(order, now),
  };
}

export function researchKickFor(order, now) {
  if (!order?.payment?.verified) return null;
  const operatorStatus = order.delivery?.operator?.status;
  const operatorNeedsRetry = operatorStatus === 'failed' || operatorStatus === 'partial';
  if (order.delivery?.results?.sent === true && order.delivery?.results?.stale !== true && !operatorNeedsRetry) return null;
  if (order.research?.status === 'running' && now - (order.research.startedAt || 0) < RESEARCH_LOCK_MS) return null;
  if (order.research?.status === 'completed' && order.delivery?.results?.status === 'skipped_unconfigured') return null;
  const status = order.research?.status;
  const emailFailed = order.delivery?.results?.status === 'failed';
  const needs = !status || status === 'needed' || status === 'kick_failed' || status === 'failed' || emailFailed;
  if (!needs) return null;
  return { orderId: order.orderId, namespace: order.namespace };
}

export function tokensEqual(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}

function operatorNamespace(body, config) {
  const namespace = body?.namespace === 'test' ? 'test' : body?.namespace === 'preview' ? 'preview' : 'live';
  if (namespace === 'test' && !config.allowTestNamespace) return { error: { status: 403, body: { error: 'test_namespace_disabled' } } };
  return { namespace };
}

export async function operatorCommand({ store, config, authorization, body, now, mailer }) {
  if (!config.operatorToken) return { status: 503, body: { error: 'operator_unconfigured' } };
  const presented = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!presented || !tokensEqual(presented, config.operatorToken)) {
    return { status: 401, body: { error: 'unauthorized' } };
  }
  const namespaced = operatorNamespace(body, config);
  if (namespaced.error) return namespaced.error;
  const namespace = namespaced.namespace;
  const action = body?.action;
  if (action === 'list') {
    if (typeof store.keys !== 'function') return { status: 503, body: { error: 'store_unconfigured' } };
    const keys = await store.keys(`order:${namespace}:`);
    const orders = [];
    for (const key of keys) {
      const found = await store.get(key);
      if (!found?.payment?.verified) continue;
      orders.push({
        orderId: found.orderId,
        namespace: found.namespace,
        tier: found.tier,
        state: found.state,
        email: found.intake?.email || '',
        name: found.intake?.name || '',
        research: found.research?.status || 'not_started',
        emailStatus: found.delivery?.results?.status || 'not_sent',
        emailError: found.delivery?.results?.error || null,
        operatorStatus: found.delivery?.operator?.status || 'not_sent',
      });
    }
    orders.sort((left, right) => left.orderId.localeCompare(right.orderId));
    return { status: 200, body: { orders } };
  }
  const orderId = body?.orderId;
  if (typeof orderId !== 'string' || !ORDER_ID.test(orderId)) return { status: 400, body: { error: 'bad_order' } };
  const key = orderKey(namespace, orderId);
  const order = await store.get(key);
  if (!order) return { status: 404, body: { error: 'not_found' } };
  if (action === 'save-evidence') {
    const summary = text(body?.evidence?.summary, 4000);
    const items = Array.isArray(body?.evidence?.items) ? body.evidence.items : [];
    const cleanItems = items.slice(0, 20).map((item) => enrichEvidenceItem(item)).filter((item) => item.url && item.finding);
    if (!summary || cleanItems.length === 0) return { status: 400, body: { error: 'evidence_required' } };
    if (order.payment.verified !== true || order.state === 'awaiting_payment' || order.state === 'payment_pending' || order.state === 'payment_failed' || order.state === 'expired' || order.state === 'awaiting_manual_payment') {
      return { status: 409, body: { error: 'not_paid' } };
    }
    const from = order.state;
    order.evidence = { summary, items: cleanItems, recordedAt: now, source: 'operator', automated: false };
    if (from === 'paid' || from === 'research_failed' || from === 'researching') order.state = 'evidence_recorded';
    if (order.delivery?.results?.sent) order.delivery.results.stale = true;
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
  if (action === 'get') {
    return {
      status: 200,
      body: {
        orderId: order.orderId,
        namespace: order.namespace,
        tier: order.tier,
        state: order.state,
        intake: order.intake,
        evidence: order.evidence,
        research: order.research,
        delivery: {
          sent: order.delivery?.sent === true,
          results: order.delivery?.results || null,
          confirmation: order.delivery?.confirmation || null,
          operator: order.delivery?.operator || null,
        },
        audit: (order.audit || []).slice(-20),
      },
    };
  }
  if (action === 'retry-research') {
    if (order.payment.verified !== true) return { status: 409, body: { error: 'not_paid' } };
    if (order.delivery?.results?.sent === true && order.delivery?.results?.stale !== true && !body.resend) {
      return { status: 200, body: { result: 'already_delivered', emailSent: true, orderId } };
    }
    const from = order.state;
    order.research = { ...(order.research || {}), status: 'needed', neededAt: now };
    delete order.research.claimId;
    order.version += 1;
    audit(order, 'research_retry', from, order.state, now);
    await store.set(key, order);
    return { status: 202, body: { queued: true, orderId }, kick: { orderId, namespace: order.namespace } };
  }
  if (action === 'prepare-delivery') {
    const sendable = order.state === 'delivery_approved' || order.state === 'delivery_ready' || order.state === 'delivery_failed' || order.state === 'research_complete';
    if (!sendable) return { status: 409, body: { error: 'approval_required' } };
    if (order.payment.verified !== true) return { status: 409, body: { error: 'not_paid' } };
    if (order.state === 'delivery_ready' && !body.resend && order.delivery?.results?.stale !== true) {
      return {
        status: 200,
        body: {
          ...publicOrder(order, { includeEvidence: true }),
          replay: true,
          emailSent: order.delivery?.results?.sent === true,
          emailStatus: order.delivery?.results?.status || 'not_sent',
        },
      };
    }
    const secret = await store.get(accessSecretKey(order.namespace, order.orderId));
    const from = order.state;
    const results = await sendResults({
      order,
      accessToken: secret?.accessToken || '',
      config,
      mailer,
      now,
    });
    if (results.sent) results.stale = false;
    const previous = order.delivery || {};
    order.delivery = {
      ...previous,
      sent: results.sent === true,
      channel: results.status === 'skipped_unconfigured' ? 'not_configured' : 'resend',
      results,
    };
    order.state = results.sent || results.status === 'skipped_unconfigured' ? 'delivery_ready' : 'delivery_failed';
    order.version += 1;
    audit(order, 'delivery_ready', from, order.state, now, { emailStatus: results.status });
    await store.set(key, order);
    return {
      status: 200,
      body: { ...publicOrder(order, { includeEvidence: true }), emailSent: results.sent === true, emailStatus: results.status },
    };
  }
  return { status: 400, body: { error: 'bad_action' } };
}

export async function handleWebhookRequest({ store, config, rawBody, signature, now }) {
  if (!paymentsConfigured(config)) return { status: 503, body: { error: 'payments_unconfigured' } };
  const verified = verifyStripeSignature(rawBody, signature, config.webhookSecret, now);
  if (!verified.ok) return { status: 400, body: { error: 'bad_signature' } };
  if (config.appEnvUnsetInProduction) {
    console.error('APP_ENV is unset while Netlify CONTEXT is production. Refusing this Stripe webhook. Set APP_ENV=production.');
    return { status: 500, body: { error: 'app_env_unset' } };
  }
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { error: 'bad_payload' } };
  }
  return applyStripeEvent({ store, config, event, now });
}

export async function noteKickFailure(store, target, now) {
  if (!target?.orderId || !target?.namespace) return;
  const key = orderKey(target.namespace, target.orderId);
  const order = await store.get(key);
  if (!order || order.research?.status === 'running') return;
  const from = order.state;
  order.research = { ...(order.research || {}), status: 'kick_failed', failedAt: now };
  order.version += 1;
  audit(order, 'research_kick_failed', from, from, now);
  await store.set(key, order);
}

export async function completeWebhook({ store, config, rawBody, signature, now, kick }) {
  const result = await handleWebhookRequest({ store, config, rawBody, signature, now });
  if (!result.kick) return result;
  if (typeof kick !== 'function') {
    await noteKickFailure(store, result.kick, now);
    return { status: 500, body: { error: 'research_not_started', orderId: result.kick.orderId } };
  }
  const kicked = await kick(result.kick);
  if (!kicked?.ok) {
    await noteKickFailure(store, result.kick, now);
    return { status: 500, body: { error: kicked?.error || 'research_not_started', orderId: result.kick.orderId } };
  }
  return result;
}
