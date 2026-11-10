import sherlockData from './sherlock-data.json' with { type: 'json' };
import { generateLookalikes, maxCandidates, searchSeeds, UNCHECKED_INSTRUCTION, UNCHECKED_PLATFORMS } from './lookalikes.mjs';

export const RESEARCH_USER_AGENT = 'ModGuardAccountResearch/1.0 (+https://modguardai.org; public page check)';
export const CURATED_SITES = ['YouTube', 'TikTok', 'GitHub', 'Telegram', 'Pinterest', 'Twitch', 'Medium', 'Patreon'];
export const DISCOVERY_CONCURRENCY = 3;
export const DISCOVERY_TIMEOUT_MS = 8_000;
export const DISCOVERY_BUDGET_MS = 12 * 60 * 1000;
const BLOCK_STATUS = new Set([401, 403, 408, 429, 503, 999]);

const fill = (template, username) => String(template).replaceAll('{}', encodeURIComponent(username));

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function blocked(status, text) {
  if (BLOCK_STATUS.has(status) || status >= 500 || status === 0) return true;
  return /captcha|challenge|cf-browser-verification|access denied|unusual traffic/i.test(String(text || '').slice(0, 5000));
}

/**
 * Sherlock detection rules. Blocks, CAPTCHAs, 429s, and timeouts are UNKNOWN.
 * They are never reported as available.
 */
export async function checkSite(name, site, username, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const timeoutMs = options.timeoutMs || DISCOVERY_TIMEOUT_MS;
  const profileUrl = fill(site.url, username);
  if (site.regexCheck && !new RegExp(site.regexCheck).test(username)) {
    return { site: name, status: 'ILLEGAL', url: profileUrl };
  }
  const types = asList(site.errorType);
  const probe = site.urlProbe ? fill(site.urlProbe, username) : profileUrl;
  const method = site.request_method || 'GET';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let body;
    if (site.request_payload) {
      body = JSON.stringify(JSON.parse(fill(JSON.stringify(site.request_payload), username)));
    }
    const response = await fetchImpl(probe, {
      method,
      body,
      signal: controller.signal,
      redirect: types.includes('response_url') ? 'manual' : 'follow',
      headers: {
        'user-agent': RESEARCH_USER_AGENT,
        accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
        ...(body ? { 'content-type': 'application/json' } : {}),
        ...(site.headers || {}),
      },
    });
    const needsBody = types.includes('message') || response.status === 403 || response.status === 401;
    const text = needsBody ? (await response.text()).slice(0, 100_000) : '';
    if (blocked(response.status, text)) {
      return { site: name, status: 'UNKNOWN', http: response.status, url: profileUrl };
    }
    let claimed = true;
    if (types.includes('message')) {
      const messages = asList(site.errorMsg);
      if (messages.some((message) => text.includes(message))) claimed = false;
    }
    if (types.includes('status_code')) {
      const codes = asList(site.errorCode);
      if (codes.includes(response.status) || response.status >= 300 || response.status < 200) claimed = false;
    }
    if (types.includes('response_url') && !(response.status >= 200 && response.status < 300)) claimed = false;
    return { site: name, status: claimed ? 'CLAIMED' : 'AVAILABLE', http: response.status, url: profileUrl };
  } catch (error) {
    const nameOf = error && typeof error === 'object' && 'name' in error ? String(error.name) : 'Error';
    return { site: name, status: 'UNKNOWN', error: nameOf, url: profileUrl };
  } finally {
    clearTimeout(timer);
  }
}

async function mapPool(items, concurrency, worker) {
  const output = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      output[index] = await worker(items[index], index);
    }
  });
  await Promise.all(workers);
  return output;
}

function dayStamp(now) {
  return new Date(now).toISOString().slice(0, 10);
}

export async function selfTestSites({ sites, data, fetchImpl, now, store, timeoutMs }) {
  const trusted = [];
  const skipped = [];
  const day = dayStamp(now);
  for (const name of sites) {
    const site = data[name];
    if (!site?.url || site.isNSFW || !site.username_claimed) {
      skipped.push({ site: name, reason: 'self-test' });
      continue;
    }
    const key = `selftest:${name}:${day}`;
    const cached = store ? await store.get(key) : null;
    if (cached && typeof cached.pass === 'boolean') {
      (cached.pass ? trusted : skipped).push(cached.pass ? name : { site: name, reason: 'self-test' });
      continue;
    }
    const randomName = `mg${Math.random().toString(36).slice(2, 12)}`.replace(/[^a-z0-9]/g, '').slice(0, 12);
    const positive = await checkSite(name, site, site.username_claimed, { fetchImpl, timeoutMs });
    const negative = await checkSite(name, site, randomName, { fetchImpl, timeoutMs });
    const pass = positive.status === 'CLAIMED' && negative.status === 'AVAILABLE';
    if (store) await store.set(key, { pass, at: now });
    if (pass) trusted.push(name);
    else skipped.push({ site: name, reason: 'self-test' });
  }
  return { trusted, skipped };
}

export function emptyDiscovery(extra = {}) {
  return {
    lookalikes: [],
    coverage: {
      checked: [],
      skipped: [],
      partial: false,
      uncheckedPlatforms: UNCHECKED_PLATFORMS,
      instruction: UNCHECKED_INSTRUCTION,
      ...extra,
    },
    summary: 'No possible look-alike was confirmed on the sites this server could read. That is not proof that none exist. It is not a determination and it does not remove an account.',
  };
}

export async function discoverLookalikes({
  intake,
  fetchImpl,
  store,
  now,
  deadline,
  sites = CURATED_SITES,
  data = sherlockData,
  concurrency = DISCOVERY_CONCURRENCY,
  timeoutMs = DISCOVERY_TIMEOUT_MS,
  clock = Date.now,
}) {
  const seeds = searchSeeds(intake);
  const candidates = [];
  const seen = new Set();
  for (const seed of seeds) {
    for (const variant of generateLookalikes(seed.handle)) {
      const key = variant.handle.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      candidates.push(variant);
    }
  }
  candidates.sort((left, right) => left.distance - right.distance || left.handle.localeCompare(right.handle));
  if (clock() >= deadline) {
    return emptyDiscovery({ partial: true, skipped: sites.map((site) => ({ site, reason: 'time_budget' })) });
  }
  const tested = await selfTestSites({ sites, data, fetchImpl, now, store, timeoutMs });
  const trusted = tested.trusted.filter((name) => data[name]?.url);
  const skipped = [...tested.skipped];
  if (trusted.length === 0) {
    return {
      lookalikes: [],
      coverage: {
        checked: [],
        skipped,
        partial: false,
        uncheckedPlatforms: UNCHECKED_PLATFORMS,
        instruction: UNCHECKED_INSTRUCTION,
      },
      summary: 'No possible look-alike was confirmed on the sites this server could read. That is not proof that none exist. It is not a determination and it does not remove an account.',
    };
  }
  const room = maxCandidates({
    remainingMs: deadline - clock(),
    siteCount: Math.max(trusted.length, 1),
    concurrency,
    timeoutMs,
  });
  const queue = candidates.slice(0, room);
  if (queue.length < candidates.length) skipped.push({ site: 'candidates', reason: 'time_budget' });
  const lookalikes = [];
  let partial = queue.length < candidates.length;
  for (const candidate of queue) {
    if (clock() >= deadline) {
      partial = true;
      break;
    }
    const checks = await mapPool(trusted, concurrency, async (name) => {
      if (clock() >= deadline) return { site: name, status: 'UNKNOWN', error: 'time_budget', url: '' };
      return checkSite(name, data[name], candidate.handle, { fetchImpl, timeoutMs });
    });
    for (const check of checks) {
      if (check.status !== 'CLAIMED') continue;
      lookalikes.push({
        handle: candidate.handle,
        platform: check.site,
        url: check.url,
        similarity: candidate.similarity,
        confidence: candidate.similarity >= 0.8 ? 'medium' : 'low',
        label: 'possible, unverified',
        official: candidate.official,
      });
    }
  }
  return {
    lookalikes: lookalikes.slice(0, 15),
    coverage: {
      checked: trusted,
      skipped,
      partial,
      uncheckedPlatforms: UNCHECKED_PLATFORMS,
      instruction: UNCHECKED_INSTRUCTION,
    },
    summary: lookalikes.length > 0
      ? `${lookalikes.length} possible look-alike ${lookalikes.length === 1 ? 'account was' : 'accounts were'} found. Each one is possible and unverified. This is not a determination and it does not remove an account.`
      : 'No possible look-alike was confirmed on the sites this server could read. That is not proof that none exist. It is not a determination and it does not remove an account.',
  };
}
