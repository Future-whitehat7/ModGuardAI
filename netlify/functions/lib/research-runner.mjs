import { randomBytes } from 'node:crypto';
import { sendConfirmation, sendOperatorCopy, sendResults } from './deliver.mjs';
import { accessSecretKey, orderStorageKey } from './order-machine.mjs';
import { researchIntake } from './research.mjs';
import { DISCOVERY_BUDGET_MS, discoverLookalikes, emptyDiscovery } from './sherlock-check.mjs';

const LOCK_MS = 12 * 60 * 1000;

function settledOperator(result) {
  const status = result?.status;
  return status === 'sent' || status === 'skipped_no_recipient' || status === 'skipped_unconfigured';
}

function keepEvidence(order) {
  if (!order.evidence) return false;
  const status = order.delivery?.results?.status;
  return order.evidence.source === 'operator'
    || status === 'failed'
    || status === 'partial'
    || status === 'skipped_unconfigured'
    || order.delivery?.results?.sent === true;
}

export async function kickResearch(config, target, fetchImpl = fetch) {
  if (!config.researchTriggerToken || !config.functionBaseUrl) {
    console.error('RESEARCH_TRIGGER_TOKEN or the site URL is missing, so paid research was not started.');
    return { ok: false, error: 'research_trigger_unconfigured' };
  }
  // research-background sets config.path, so Netlify serves it only at that path.
  const url = `${config.functionBaseUrl}/api/research-background`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-research-token': config.researchTriggerToken,
      },
      body: JSON.stringify({ orderId: target.orderId, namespace: target.namespace }),
      signal: controller.signal,
    });
    if (response.status === 202 || response.status === 200) return { ok: true };
    return { ok: false, error: `research_trigger_${response.status}` };
  } catch {
    return { ok: false, error: 'research_trigger_unreachable' };
  } finally {
    clearTimeout(timer);
  }
}

export async function runPaidResearch({
  store,
  config,
  orderId,
  namespace,
  now,
  fetchImpl,
  resolveImpl,
  mailer,
  force = false,
}) {
  const key = orderStorageKey(namespace, orderId);
  const order = await store.get(key);
  if (!order) return { status: 404, body: { error: 'not_found' } };
  if (order.payment?.verified !== true) return { status: 409, body: { error: 'not_paid' } };
  const resultsDone = order.delivery?.results?.sent === true && order.delivery?.results?.stale !== true;
  if (resultsDone && settledOperator(order.delivery?.operator) && !force) {
    return { status: 200, body: { result: 'already_delivered', emailSent: true, replay: true, orderId } };
  }
  const running = order.research?.status === 'running' && now - (order.research.startedAt || 0) < LOCK_MS;
  if (running && !force) return { status: 202, body: { result: 'in_progress', orderId } };

  const claimId = randomBytes(8).toString('hex');
  const from = order.state;
  order.research = {
    ...(order.research || {}),
    status: 'running',
    startedAt: now,
    claimId,
    attempts: (order.research?.attempts || 0) + 1,
  };
  if (!resultsDone) order.state = 'researching';
  order.version += 1;
  order.audit.push({ at: now, action: 'research_started', from, to: order.state });
  await store.set(key, order);
  const claimed = await store.get(key);
  if (claimed?.research?.claimId !== claimId) return { status: 202, body: { result: 'in_progress', orderId } };

  try {
    const secret = await store.get(accessSecretKey(namespace, orderId));
    const accessToken = typeof secret?.accessToken === 'string' ? secret.accessToken : '';
    const working = claimed;
    if (!working.delivery?.confirmation?.sent) {
      const confirmation = await sendConfirmation({ order: working, accessToken, config, mailer, now });
      working.delivery = { ...(working.delivery || {}), confirmation };
      await store.set(key, working);
    }
    if (!keepEvidence(working)) {
      const researched = await researchIntake(working.intake, {
        fetchImpl,
        resolveImpl,
        timeoutMs: config.researchTimeoutMs,
      });
      let discovery = emptyDiscovery();
      try {
        discovery = await discoverLookalikes({
          intake: working.intake,
          fetchImpl,
          store,
          now,
          deadline: now + DISCOVERY_BUDGET_MS,
        });
      } catch {
        discovery = emptyDiscovery({ partial: true });
      }
      working.evidence = {
        ...researched,
        summary: `${researched.summary} ${discovery.summary}`.trim(),
        lookalikes: discovery.lookalikes,
        coverage: discovery.coverage,
        recordedAt: now,
      };
      await store.set(key, working);
    }
    let customerResult = working.delivery?.results;
    if (!customerResult?.sent || customerResult.stale === true || force) {
      customerResult = await sendResults({ order: working, accessToken, config, mailer, now });
      if (customerResult.sent) customerResult.stale = false;
    }
    let operatorResult = working.delivery?.operator;
    if (!settledOperator(operatorResult)) {
      const alreadySent = (operatorResult?.recipients || [])
        .filter((item) => item.status === 'sent' && item.to)
        .map((item) => item.to);
      operatorResult = await sendOperatorCopy({
        order: working,
        customerResult,
        config,
        mailer,
        now,
        alreadySent,
      });
    }
    working.delivery = {
      ...(working.delivery || {}),
      sent: customerResult.sent === true,
      channel: customerResult.status === 'skipped_unconfigured' ? 'not_configured' : 'resend',
      results: customerResult,
      operator: operatorResult,
    };
    if (customerResult.sent) working.state = 'delivery_ready';
    else if (customerResult.status === 'skipped_unconfigured') working.state = 'research_complete';
    else working.state = 'delivery_failed';
    working.research.status = 'completed';
    working.research.finishedAt = now;
    working.version += 1;
    working.audit.push({
      at: now,
      action: 'research_finished',
      from: 'researching',
      to: working.state,
      emailStatus: customerResult.status,
      operatorStatus: operatorResult.status,
    });
    await store.set(key, working);
    return {
      status: 200,
      body: {
        result: working.state,
        emailSent: customerResult.sent === true,
        emailStatus: customerResult.status,
        operatorStatus: operatorResult.status,
        orderId,
      },
    };
  } catch {
    const failed = await store.get(key);
    if (failed?.research?.claimId === claimId) {
      const prior = failed.state;
      failed.research.status = 'failed';
      failed.research.error = 'research_failed';
      failed.state = 'research_failed';
      failed.version += 1;
      failed.audit.push({ at: now, action: 'research_failed', from: prior, to: 'research_failed' });
      await store.set(key, failed);
    }
    return { status: 500, body: { error: 'research_failed', orderId } };
  }
}
