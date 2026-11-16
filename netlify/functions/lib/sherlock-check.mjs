import sherlockData from './sherlock-data.json' with { type: 'json' };
import { COVERAGE_INSTRUCTION, META_ADS_LABEL, sortLabels } from './coverage.mjs';
import { generateLookalikes, maxCandidates, searchSeeds } from './lookalikes.mjs';
import { assessUrl, isPrivateAddress, resolvePublicAddresses } from './research.mjs';

export const RESEARCH_USER_AGENT = 'ModGuardAccountResearch/1.0 (+https://modguardai.org; public page check)';
export const CURATED_SITES = ['YouTube', 'TikTok', 'GitHub', 'Telegram', 'Pinterest', 'Twitch', 'Medium', 'Patreon'];
export { META_ADS_LABEL, COVERAGE_INSTRUCTION };
export const DISCOVERY_CONCURRENCY = 3;
export const DISCOVERY_TIMEOUT_MS = 8_000;
export const DISCOVERY_BUDGET_MS = 12 * 60 * 1000;
export const DISCOVERY_INTERVAL_MS = 400;
export const SEARCH_CANDIDATE_CAP = 12;

const BLOCK_STATUS = new Set([401, 403, 408, 429, 503, 999]);
const MAX_REDIRECTS = 3;

const fill = (template, username) => String(template).replaceAll('{}', encodeURIComponent(username));

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function blocked(status, text) {
  if (status == null || BLOCK_STATUS.has(status) || status >= 500 || status === 0) return true;
  return /captcha|challenge|cf-browser-verification|access denied|unusual traffic/i.test(String(text || '').slice(0, 5000));
}

function loginWall(text) {
  const title = (String(text || '').match(/<title[^>]*>([^<]{0,180})/i) || [])[1] || '';
  return /log in|login|sign up|sign in/i.test(title);
}

function errorCodes(site) {
  if (site.errorCode == null) return [404];
  const codes = asList(site.errorCode).map((code) => Number(code)).filter((code) => Number.isInteger(code));
  return codes.length > 0 ? codes : [404];
}

function publicHeaders(site) {
  const headers = {
    'user-agent': RESEARCH_USER_AGENT,
    accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
  };
  const source = site?.headers && typeof site.headers === 'object' ? site.headers : {};
  for (const [key, value] of Object.entries(source)) {
    if (typeof value !== 'string') continue;
    if (/^(cookie|authorization|proxy-authorization|x-api-key)$/i.test(key)) continue;
    headers[key.toLowerCase()] = value;
  }
  return headers;
}

function createPacer(minIntervalMs) {
  const last = new Map();
  return async (host) => {
    if (!minIntervalMs || !host) return;
    const now = Date.now();
    const wait = minIntervalMs - (now - (last.get(host) || 0));
    last.set(host, now + Math.max(wait, 0));
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  };
}

async function readPublic(rawUrl, options) {
  const fetchImpl = options.fetchImpl || fetch;
  const timeoutMs = options.timeoutMs || DISCOVERY_TIMEOUT_MS;
  const resolve = options.resolve || ((hostname) => resolvePublicAddresses(hostname));
  let current;
  try {
    current = new URL(rawUrl);
  } catch {
    return { error: 'bad_url' };
  }
  if (current.protocol !== 'https:' || current.username || current.password) return { error: 'not_https' };
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const safety = assessUrl(current.toString());
    if (!safety.ok) return { error: safety.error || 'blocked_host', finalUrl: current.toString() };
    let addresses;
    try {
      addresses = await resolve(safety.hostname);
    } catch {
      addresses = null;
    }
    if (addresses === null) return { error: 'dns_failed', finalUrl: current.toString() };
    if (!Array.isArray(addresses) || addresses.length === 0 || addresses.some((address) => isPrivateAddress(address))) {
      return { error: 'private_address', finalUrl: current.toString() };
    }
    if (options.pace) {
      try {
        await options.pace(safety.hostname);
      } catch {
        // A pacing failure still allows this one public request.
      }
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const request = {
        method: options.method || 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: options.headers,
      };
      if (options.body) request.body = options.body;
      const response = await fetchImpl(current.toString(), request);
      const status = response.status;
      if (status >= 300 && status < 400) {
        const location = response.headers.get('location') || '';
        try {
          await response.body?.cancel?.();
        } catch {
          // The redirect body is unused.
        }
        if (!location || hop === MAX_REDIRECTS) {
          return { error: location ? 'too_many_redirects' : 'redirect_missing', status, finalUrl: current.toString() };
        }
        try {
          current = new URL(location, current);
        } catch {
          return { error: 'bad_redirect', status, finalUrl: current.toString() };
        }
        continue;
      }
      let text = '';
      try {
        text = (await response.text()).slice(0, 80_000);
      } catch {
        text = '';
      }
      return { status, text, finalUrl: current.toString() };
    } catch (error) {
      const nameOf = error && typeof error === 'object' && 'name' in error ? String(error.name) : 'Error';
      const timedOut = nameOf === 'AbortError' || nameOf === 'TimeoutError';
      return { error: timedOut ? 'timeout' : 'fetch_failed', finalUrl: current.toString() };
    } finally {
      clearTimeout(timer);
    }
  }
  return { error: 'too_many_redirects', finalUrl: current.toString() };
}

function indicatesMissing(read, site, username, profileUrl) {
  const types = asList(site.errorType);
  if (types.length === 0 || read.status == null) return false;
  let hits = 0;
  if (types.includes('message')) {
    const messages = asList(site.errorMsg).map((item) => String(item));
    if (messages.some((message) => message && read.text.includes(message))) hits += 1;
  }
  if (types.includes('status_code')) {
    if (errorCodes(site).includes(read.status)) hits += 1;
  }
  if (types.includes('response_url')) {
    const errorUrl = site.errorUrl ? fill(site.errorUrl, username) : '';
    if (errorUrl && String(read.finalUrl || '').startsWith(errorUrl)) hits += 1;
    else if (!errorUrl && read.finalUrl && read.finalUrl !== profileUrl) hits += 1;
  }
  return hits === types.length;
}

/**
 * Sherlock detection rules on a public https page.
 * Blocks, login walls, CAPTCHAs, 429s, and timeouts are UNKNOWN.
 * They are never reported as available.
 */
export async function checkSite(name, site, username, options = {}) {
  const profileUrl = fill(site?.url || '', username);
  if (!site?.url || /[^\x00-\x7F]/.test(String(username || ''))) {
    return { site: name, status: 'ILLEGAL', url: profileUrl };
  }
  if (site.regexCheck) {
    try {
      if (!new RegExp(site.regexCheck).test(username)) return { site: name, status: 'ILLEGAL', url: profileUrl };
    } catch {
      return { site: name, status: 'UNKNOWN', url: profileUrl, error: 'bad_rule' };
    }
  }
  const probe = site.urlProbe ? fill(site.urlProbe, username) : profileUrl;
  let probeUrl;
  try {
    probeUrl = new URL(probe);
  } catch {
    return { site: name, status: 'UNKNOWN', url: profileUrl, error: 'bad_url' };
  }
  if (probeUrl.protocol !== 'https:') return { site: name, status: 'UNKNOWN', url: profileUrl, error: 'not_https' };
  const method = site.request_method || 'GET';
  let body;
  if (site.request_payload && method !== 'GET' && method !== 'HEAD') {
    try {
      body = JSON.stringify(JSON.parse(fill(JSON.stringify(site.request_payload), username)));
    } catch {
      return { site: name, status: 'UNKNOWN', url: profileUrl, error: 'bad_payload' };
    }
  }
  const resolve = options.resolve
    || (options.resolveImpl
      ? (hostname) => resolvePublicAddresses(hostname, options.resolveImpl)
      : (hostname) => resolvePublicAddresses(hostname));
  const read = await readPublic(probe, {
    fetchImpl: options.fetchImpl,
    timeoutMs: options.timeoutMs,
    pace: options.pace,
    resolve,
    method,
    body,
    headers: { ...publicHeaders(site), ...(body ? { 'content-type': 'application/json' } : {}) },
  });
  if (read.error || read.status == null || blocked(read.status, read.text) || loginWall(read.text)) {
    return { site: name, status: 'UNKNOWN', http: read.status ?? null, url: profileUrl, error: read.error || '' };
  }
  if (indicatesMissing(read, site, username, profileUrl)) {
    return { site: name, status: 'AVAILABLE', http: read.status, url: profileUrl };
  }
  if (read.status >= 200 && read.status < 300) {
    return { site: name, status: 'CLAIMED', http: read.status, url: profileUrl };
  }
  return { site: name, status: 'UNKNOWN', http: read.status, url: profileUrl };
}

export async function checkMetaAds(query, options = {}) {
  const term = String(query || '').trim().slice(0, 80);
  if (!term) return { site: META_ADS_LABEL, status: 'UNKNOWN', error: 'no_query' };
  const url = new URL('https://www.facebook.com/ads/library/');
  url.searchParams.set('active_status', 'all');
  url.searchParams.set('ad_type', 'all');
  url.searchParams.set('country', 'ALL');
  url.searchParams.set('q', term);
  url.searchParams.set('search_type', 'keyword_unordered');
  url.searchParams.set('media_type', 'all');
  const resolve = options.resolve
    || (options.resolveImpl
      ? (hostname) => resolvePublicAddresses(hostname, options.resolveImpl)
      : (hostname) => resolvePublicAddresses(hostname));
  const read = await readPublic(url.toString(), {
    fetchImpl: options.fetchImpl,
    timeoutMs: options.timeoutMs,
    pace: options.pace,
    resolve,
    method: 'GET',
    headers: publicHeaders({}),
  });
  if (read.error || read.status == null || blocked(read.status, read.text) || loginWall(read.text)) {
    return { site: META_ADS_LABEL, status: 'UNKNOWN', http: read.status ?? null, error: read.error || 'unreadable' };
  }
  if (read.status >= 200 && read.status < 300 && /ad_archive_id/i.test(read.text)) {
    return { site: META_ADS_LABEL, status: 'CHECKED', http: read.status };
  }
  return { site: META_ADS_LABEL, status: 'UNKNOWN', http: read.status, error: 'no_public_ads' };
}

async function mapPool(items, concurrency, worker) {
  const output = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      try {
        output[index] = await worker(items[index], index);
      } catch {
        output[index] = { site: String(items[index] ?? ''), status: 'UNKNOWN', error: 'probe_failed', url: '' };
      }
    }
  });
  await Promise.all(runners);
  return output;
}

function dayStamp(now) {
  return new Date(now).toISOString().slice(0, 10);
}

export async function selfTestSites({ sites, data, fetchImpl, now, store, timeoutMs, resolve, pace }) {
  const trusted = [];
  const skipped = [];
  const day = dayStamp(now);
  for (const name of sites) {
    try {
      const site = data[name];
      if (!site?.url || site.isNSFW || !site.username_claimed) {
        skipped.push({ site: name, reason: 'self-test' });
        continue;
      }
      const key = `selftest:${name}:${day}`;
      let cached = null;
      try {
        cached = store ? await store.get(key) : null;
      } catch {
        cached = null;
      }
      if (cached && typeof cached.pass === 'boolean') {
        if (cached.pass) trusted.push(name);
        else skipped.push({ site: name, reason: 'self-test' });
        continue;
      }
      const randomName = `mg${Math.random().toString(36).slice(2, 12)}`.replace(/[^a-z0-9]/g, '').slice(0, 12);
      const positive = await checkSite(name, site, site.username_claimed, { fetchImpl, timeoutMs, resolve, pace });
      const negative = await checkSite(name, site, randomName, { fetchImpl, timeoutMs, resolve, pace });
      const pass = positive.status === 'CLAIMED' && negative.status === 'AVAILABLE';
      try {
        if (store) await store.set(key, { pass, at: now });
      } catch {
        // The next order can self-test again.
      }
      if (pass) trusted.push(name);
      else skipped.push({ site: name, reason: 'self-test' });
    } catch {
      skipped.push({ site: name, reason: 'self-test' });
    }
  }
  return { trusted, skipped };
}

export function emptyDiscovery(extra = {}) {
  return {
    lookalikes: [],
    coverage: {
      checked: extra.checked || [],
      notChecked: extra.notChecked || [],
      notes: extra.notes || [],
      skipped: extra.skipped || [],
      partial: Boolean(extra.partial),
      instruction: extra.instruction || COVERAGE_INSTRUCTION,
    },
    summary: extra.summary || 'No possible look-alike was confirmed on the sites that returned a public page. That is not proof that none exist. It is not a determination and it does not remove an account.',
  };
}

function metaQuery(intake, seeds) {
  if (seeds[0]?.handle) return String(seeds[0].handle).slice(0, 80);
  const name = typeof intake?.name === 'string' ? intake.name.trim() : '';
  return name.slice(0, 80);
}

function phraseFor(label) {
  return `${label} not checked`;
}

export async function discoverLookalikes({
  intake,
  fetchImpl,
  resolveImpl,
  store,
  now,
  deadline,
  sites = CURATED_SITES,
  data = sherlockData,
  concurrency = DISCOVERY_CONCURRENCY,
  timeoutMs = DISCOVERY_TIMEOUT_MS,
  minIntervalMs = 0,
  clock = Date.now,
}) {
  const seeds = searchSeeds(intake);
  const query = metaQuery(intake, seeds);
  if (seeds.length === 0 && !query) {
    return emptyDiscovery({
      summary: 'No official handle or bare handle was available, so no look-alike search was run. That is not a determination and it does not remove an account.',
    });
  }
  const resolve = resolveImpl
    ? (hostname) => resolvePublicAddresses(hostname, resolveImpl)
    : (hostname) => resolvePublicAddresses(hostname);
  const pace = createPacer(minIntervalMs);
  const probeOptions = { fetchImpl, timeoutMs, resolve, pace };
  const candidates = [];
  const seen = new Set();
  for (const seed of seeds) {
    for (const variant of generateLookalikes(seed.handle)) {
      const key = variant.handle.toLowerCase();
      if (seen.has(key) || !/^[a-z0-9._-]+$/i.test(variant.handle)) continue;
      seen.add(key);
      candidates.push(variant);
    }
  }
  candidates.sort((left, right) => left.distance - right.distance || left.handle.localeCompare(right.handle));

  let meta = null;
  if (query && clock() + timeoutMs <= deadline) {
    try {
      meta = await checkMetaAds(query, probeOptions);
    } catch {
      meta = { site: META_ADS_LABEL, status: 'UNKNOWN', error: 'probe_failed' };
    }
  } else if (query) meta = { site: META_ADS_LABEL, status: 'UNKNOWN', error: 'time_budget' };

  const applyMeta = (checked, notChecked) => {
    if (!query) return;
    if (meta?.status === 'CHECKED') checked.push(META_ADS_LABEL);
    else notChecked.push(phraseFor(META_ADS_LABEL));
  };

  if (seeds.length === 0) {
    const checked = [];
    const notChecked = [];
    applyMeta(checked, notChecked);
    return {
      lookalikes: [],
      coverage: {
        checked: sortLabels(checked),
        notChecked: sortLabels(notChecked),
        notes: [],
        skipped: [],
        partial: false,
        instruction: COVERAGE_INSTRUCTION,
      },
      summary: 'No possible look-alike was confirmed on the sites that returned a public page. That is not proof that none exist. It is not a determination and it does not remove an account.',
    };
  }

  if (clock() >= deadline) {
    const notChecked = sites.map((site) => phraseFor(site));
    applyMeta([], notChecked);
    return emptyDiscovery({
      partial: true,
      notChecked: sortLabels(notChecked),
      skipped: sites.map((site) => ({ site, reason: 'time_budget' })),
    });
  }

  const tested = await selfTestSites({ sites, data, fetchImpl, now, store, timeoutMs, resolve, pace });
  const trusted = tested.trusted.filter((name) => data[name]?.url);
  const skipped = [...tested.skipped];
  const room = maxCandidates({
    remainingMs: deadline - clock(),
    siteCount: Math.max(trusted.length, 1),
    concurrency,
    timeoutMs,
  });
  const cap = Math.min(room, SEARCH_CANDIDATE_CAP);
  const queue = trusted.length === 0 ? [] : candidates.slice(0, cap);
  const notes = [];
  let partial = false;
  if (trusted.length > 0 && queue.length < candidates.length) {
    const cutByCap = candidates.length > SEARCH_CANDIDATE_CAP && room >= SEARCH_CANDIDATE_CAP;
    const cutByTime = room < candidates.length && room < SEARCH_CANDIDATE_CAP;
    if (cutByCap) {
      skipped.push({ site: 'candidates', reason: 'rate_limit' });
      notes.push('Only the closest similar names were searched.');
    }
    if (cutByTime) {
      partial = true;
      skipped.push({ site: 'candidates', reason: 'time_budget' });
    }
  }
  const outcomes = new Map(trusted.map((name) => [name, { definitive: 0 }]));
  const lookalikes = [];
  for (const candidate of queue) {
    if (clock() >= deadline) {
      partial = true;
      break;
    }
    const checks = await mapPool(trusted, concurrency, async (name) => {
      if (clock() >= deadline) return { site: name, status: 'UNKNOWN', error: 'time_budget', url: '' };
      return checkSite(name, data[name], candidate.handle, probeOptions);
    });
    for (const check of checks) {
      if (!check) continue;
      if (check.status === 'CLAIMED' || check.status === 'AVAILABLE') {
        const outcome = outcomes.get(check.site);
        if (outcome) outcome.definitive += 1;
      }
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
  const checked = [];
  const notChecked = [];
  for (const name of sites) {
    const outcome = outcomes.get(name);
    if (outcome && outcome.definitive > 0) checked.push(name);
    else notChecked.push(phraseFor(name));
  }
  applyMeta(checked, notChecked);
  return {
    lookalikes: lookalikes.slice(0, 15),
    coverage: {
      checked: sortLabels(checked),
      notChecked: sortLabels(notChecked),
      notes,
      skipped,
      partial,
      instruction: COVERAGE_INSTRUCTION,
    },
    summary: lookalikes.length > 0
      ? `${lookalikes.length} possible look-alike ${lookalikes.length === 1 ? 'account was' : 'accounts were'} found. Each one is possible and unverified. This is not a determination and it does not remove an account.`
      : 'No possible look-alike was confirmed on the sites that returned a public page. That is not proof that none exist. It is not a determination and it does not remove an account.',
  };
}
