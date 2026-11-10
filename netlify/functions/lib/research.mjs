import { lookup } from 'node:dns/promises';

export const MAX_SUBMITTED_URLS = 8;
export const MAX_HTML_CHARS = 350_000;
export const DEFAULT_FETCH_TIMEOUT_MS = 8_000;
const MAX_REDIRECTS = 3;

const HONESTY =
  'This is automated research. Data confidence describes how much of the public page could be read, not whether the account is impersonation. Nothing here removes an account or files a report.';

const RESERVED_SEGMENTS = new Set([
  'p', 'reel', 'reels', 'stories', 'explore', 'accounts', 'about', 'legal', 'privacy',
  'help', 'share', 'intent', 'home', 'watch', 'shorts', 'hashtag', 'search', 'login',
  'i', 'direct', 'tv', 'channel', 'c', 'user', 'watch', 'embed',
]);

const REPORT_STEPS = {
  instagram: [
    'Open Instagram’s impersonation help: https://help.instagram.com/446663175382270',
    'On the profile, open the menu, choose Report, then the option for an account pretending to be someone else.',
    'One account can also be submitted at https://help.instagram.com/contact/636276399721841. Instagram decides the result. This research does not file the report.',
  ],
  facebook: [
    'Open Facebook’s impersonation help: https://www.facebook.com/help/174210519303259',
    'On the profile or Page, open the menu, choose Find support or report, then the option for pretending to be you or someone else.',
    'Facebook decides the result. This research does not file the report.',
  ],
  tiktok: [
    'Open TikTok’s impersonation report help: https://support.tiktok.com/en/safety-hc/report-a-problem/report-an-impersonation-account',
    'In the app, open the profile, use the share or menu control, choose Report, then Impersonation.',
    'TikTok decides the result. This research does not file the report.',
  ],
  x: [
    'Open the X impersonation form: https://help.x.com/en/forms/impersonation',
    'Submit the username and the profile URL. X may ask for identification.',
    'X decides the result. This research does not file the report.',
  ],
  youtube: [
    'Open YouTube’s impersonation policy: https://support.google.com/youtube/answer/2801947',
    'File the channel with the impersonation contact form: https://support.google.com/youtube/contact/impersonation',
    'YouTube decides the result. This research does not file the report.',
  ],
  website: [
    'This site does not have one impersonation form in this research.',
    'Use the site’s own abuse or contact page, include the URL, and keep a copy of what you send.',
    'The site decides the result. This research does not file the report.',
  ],
};

/**
 * @param {'instagram'|'facebook'|'tiktok'|'x'|'youtube'|'website'} platform
 */
export function reportStepsFor(platform) {
  switch (platform) {
    case 'instagram':
      return REPORT_STEPS.instagram;
    case 'facebook':
      return REPORT_STEPS.facebook;
    case 'tiktok':
      return REPORT_STEPS.tiktok;
    case 'x':
      return REPORT_STEPS.x;
    case 'youtube':
      return REPORT_STEPS.youtube;
    case 'website':
      return REPORT_STEPS.website;
    default: {
      const unexpected = platform;
      throw new Error(`Unknown platform: ${String(unexpected)}`);
    }
  }
}

export function platformFromHostname(hostname) {
  const host = hostname.replace(/^www\./, '').toLowerCase();
  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) return 'tiktok';
  if (host === 'instagram.com' || host.endsWith('.instagram.com')) return 'instagram';
  if (host === 'youtube.com' || host === 'youtu.be' || host.endsWith('.youtube.com')) return 'youtube';
  if (host === 'x.com' || host === 'twitter.com' || host.endsWith('.x.com') || host.endsWith('.twitter.com')) return 'x';
  if (host === 'facebook.com' || host === 'fb.com' || host === 'fb.watch' || host.endsWith('.facebook.com')) return 'facebook';
  return 'website';
}

export function platformLabel(platform) {
  switch (platform) {
    case 'instagram':
      return 'Instagram';
    case 'facebook':
      return 'Facebook';
    case 'tiktok':
      return 'TikTok';
    case 'x':
      return 'X';
    case 'youtube':
      return 'YouTube';
    case 'website':
      return 'Website';
    default: {
      const unexpected = platform;
      throw new Error(`Unknown platform: ${String(unexpected)}`);
    }
  }
}

export function normalizeHandle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/[^a-z0-9]+/g, '');
}

export function levenshtein(left, right) {
  const a = left.slice(0, 64);
  const b = right.slice(0, 64);
  const rows = a.length + 1;
  const cols = b.length + 1;
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i += 1) grid[i][0] = i;
  for (let j = 0; j < cols; j += 1) grid[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      grid[i][j] = Math.min(grid[i - 1][j] + 1, grid[i][j - 1] + 1, grid[i - 1][j - 1] + cost);
    }
  }
  return grid[a.length][b.length];
}

export function handleSimilarity(left, right) {
  const a = normalizeHandle(left);
  const b = normalizeHandle(right);
  if (!a || !b) return null;
  if (a === b) return 1;
  const distance = levenshtein(a, b);
  return Math.round((1 - distance / Math.max(a.length, b.length)) * 100) / 100;
}

function firstSegment(pathname) {
  return pathname.split('/').filter(Boolean)[0] || '';
}

function handleFromUrl(url, platform) {
  if (platform === 'tiktok') {
    const match = url.pathname.match(/@([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }
  if (platform === 'youtube') {
    const at = url.pathname.match(/@([^/?#]+)/);
    if (at) return decodeURIComponent(at[1]);
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] === 'channel' || parts[0] === 'c' || parts[0] === 'user') return decodeURIComponent(parts[1] || '');
    if (url.hostname.replace(/^www\./, '') === 'youtu.be') return '';
    return '';
  }
  if (platform === 'facebook') {
    const id = url.searchParams.get('id');
    if (url.pathname.includes('profile.php') && id) return id;
    const segment = firstSegment(url.pathname);
    if (!segment || RESERVED_SEGMENTS.has(segment.toLowerCase())) return '';
    return decodeURIComponent(segment);
  }
  if (platform === 'instagram' || platform === 'x') {
    const segment = firstSegment(url.pathname).replace(/^@/, '');
    if (!segment || RESERVED_SEGMENTS.has(segment.toLowerCase())) return '';
    return decodeURIComponent(segment);
  }
  const segment = firstSegment(url.pathname);
  return segment ? decodeURIComponent(segment) : url.hostname.replace(/^www\./, '');
}

export function parseAccountUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  const platform = platformFromHostname(url.hostname);
  const handle = handleFromUrl(url, platform).slice(0, 80);
  return {
    url: url.toString().slice(0, 500),
    platform,
    handle,
    hostname: url.hostname.toLowerCase(),
  };
}

export function extractSubmittedUrls(text) {
  const found = [];
  const seen = new Set();
  const raw = typeof text === 'string' ? text : '';
  const matches = raw.match(/https?:\/\/[^\s<>"'`]+/gi) || [];
  for (const line of raw.split(/\n+/)) {
    const trimmed = line.trim().replace(/[),.;]+$/, '');
    if (/^(?:www\.)?(?:instagram\.com|tiktok\.com|youtube\.com|youtu\.be|x\.com|twitter\.com|facebook\.com|fb\.com)\//i.test(trimmed)) {
      matches.push(`https://${trimmed}`);
    }
  }
  for (const match of matches) {
    const cleaned = match.replace(/[),.;]+$/, '');
    let normalized = '';
    try {
      normalized = new URL(cleaned).toString().slice(0, 500);
    } catch {
      continue;
    }
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    found.push(normalized);
    if (found.length >= MAX_SUBMITTED_URLS) break;
  }
  return found;
}

export function officialProfiles(links) {
  const profiles = [];
  const source = links && typeof links === 'object' ? links : {};
  for (const [key, value] of Object.entries(source)) {
    if (key === 'other' || typeof value !== 'string') continue;
    const parsed = parseAccountUrl(value);
    if (parsed) profiles.push(parsed);
  }
  return profiles;
}

function ipv4Parts(host) {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!match) return null;
  const parts = match.slice(1).map(Number);
  if (parts.some((part) => part > 255)) return null;
  return parts;
}

export function isPrivateAddress(host) {
  const bare = host.replace(/^\[|\]$/g, '').toLowerCase();
  const ipv4 = ipv4Parts(bare);
  if (ipv4) {
    const [a, b] = ipv4;
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    return false;
  }
  if (bare === '::1' || bare === '0:0:0:0:0:0:0:1') return true;
  if (bare.startsWith('fc') || bare.startsWith('fd') || bare.startsWith('fe80')) return true;
  if (bare.startsWith('::ffff:')) return isPrivateAddress(bare.slice(7));
  return false;
}

export function assessUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return { ok: false, error: 'bad_url' };
  }
  if (url.protocol !== 'https:') return { ok: false, error: 'not_https' };
  if (url.username || url.password) return { ok: false, error: 'embedded_credentials' };
  const hostname = url.hostname.toLowerCase();
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    return { ok: false, error: 'blocked_host' };
  }
  if (isPrivateAddress(hostname)) return { ok: false, error: 'private_address' };
  return { ok: true, url: url.toString(), hostname };
}

export async function resolvePublicAddresses(hostname, resolveImpl = lookupAll) {
  if (isPrivateAddress(hostname) || ipv4Parts(hostname) || hostname.includes(':')) {
    return isPrivateAddress(hostname) ? [] : [hostname];
  }
  try {
    const addresses = await resolveImpl(hostname);
    return Array.isArray(addresses) ? addresses.filter((address) => typeof address === 'string') : [];
  } catch {
    return null;
  }
}

async function lookupAll(hostname) {
  const records = await lookup(hostname, { all: true, verbatim: true });
  return records.map((record) => record.address);
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function metaContent(html, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${escaped}["']`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1]).trim().slice(0, 300);
  }
  return '';
}

async function readLimited(response) {
  if (!response.body || typeof response.body.getReader !== 'function') {
    const text = await response.text();
    return text.slice(0, MAX_HTML_CHARS);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let out = '';
  while (out.length < MAX_HTML_CHARS) {
    const step = await reader.read();
    if (step.done) break;
    out += decoder.decode(step.value, { stream: true });
  }
  try {
    await reader.cancel();
  } catch {
    // The cap was reached. The rest of the body is unused.
  }
  return out.slice(0, MAX_HTML_CHARS);
}

export async function readPublicPage(rawUrl, fetchImpl, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS) {
  const safety = assessUrl(rawUrl);
  if (!safety.ok) {
    return { ok: false, httpStatus: null, error: safety.error, finalUrl: rawUrl, title: '', description: '', hops: 0 };
  }
  let current = safety.url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response;
    try {
      response = await fetchImpl(current, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          accept: 'text/html,application/xhtml+xml',
          'user-agent': 'AccountResearch/1.0 (public page metadata)',
        },
      });
    } catch (error) {
      const aborted = error && typeof error === 'object' && 'name' in error && error.name === 'AbortError';
      return {
        ok: false,
        httpStatus: null,
        error: aborted ? 'timeout' : 'fetch_failed',
        finalUrl: current,
        title: '',
        description: '',
        hops: hop,
      };
    } finally {
      clearTimeout(timer);
    }
    const status = response.status;
    if (status >= 300 && status < 400) {
      const location = response.headers.get('location') || '';
      if (!location) {
        return { ok: false, httpStatus: status, error: 'redirect_missing', finalUrl: current, title: '', description: '', hops: hop };
      }
      let next = '';
      try {
        next = new URL(location, current).toString();
      } catch {
        return { ok: false, httpStatus: status, error: 'bad_redirect', finalUrl: current, title: '', description: '', hops: hop };
      }
      const nextSafety = assessUrl(next);
      if (!nextSafety.ok) {
        return { ok: false, httpStatus: status, error: 'redirect_blocked', finalUrl: current, title: '', description: '', hops: hop };
      }
      current = nextSafety.url;
      continue;
    }
    const type = (response.headers.get('content-type') || '').slice(0, 120);
    let html = '';
    if (status < 400 && /html|xml/i.test(type)) html = await readLimited(response);
    else {
      try {
        await response.body?.cancel?.();
      } catch {
        // Nothing further to read.
      }
    }
    const title = ((html.match(/<title[^>]*>([^<]{1,300})<\/title>/i) || [])[1] || '');
    const ogTitle = metaContent(html, 'og:title');
    const description = metaContent(html, 'og:description') || metaContent(html, 'description');
    const displayName = decodeEntities(ogTitle || title).trim().slice(0, 200);
    return {
      ok: status >= 200 && status < 400,
      httpStatus: status,
      error: status >= 400 ? 'http_error' : '',
      finalUrl: current,
      contentType: type,
      title: decodeEntities(title).trim().slice(0, 200),
      displayName,
      description: description.slice(0, 400),
      hops: hop,
      loginWall: /log in|login|sign up|sign in/i.test(`${title} ${ogTitle}`) && html.length < 80_000,
    };
  }
  return { ok: false, httpStatus: null, error: 'too_many_redirects', finalUrl: current, title: '', description: '', hops: MAX_REDIRECTS };
}

function closestOfficial(handle, officials) {
  let best = null;
  for (const official of officials) {
    const score = handleSimilarity(handle, official.handle);
    if (score === null) continue;
    if (!best || score > best.score) best = { handle: official.handle, platform: official.platform, score };
  }
  return best;
}

function comparisonOf(score) {
  if (score === null) return 'not_compared';
  if (score === 1) return 'exact_handle';
  if (score >= 0.75) return 'similar_handle';
  return 'distant_handle';
}

function confidenceFor(page, handle) {
  if (!page || page.httpStatus == null || !page.ok) return 'low';
  if (!handle) return 'low';
  if (page.loginWall && !page.displayName) return 'medium';
  if (page.displayName) return 'high';
  return 'medium';
}

function comparisonSentence(comparison, best) {
  if (!best || comparison === 'not_compared') {
    return 'No official handle was available to compare, or the link did not include a handle.';
  }
  const pct = Math.round(best.score * 100);
  if (comparison === 'exact_handle') {
    return `The handle matches an official handle you sent (@${best.handle}). A character match is not proof either way.`;
  }
  if (comparison === 'similar_handle') {
    return `The handle is similar to an official handle you sent (@${best.handle}, ${pct}% of the characters align). Similarity is a character comparison, not a determination.`;
  }
  return `The handle does not closely match the official handles you sent (closest @${best.handle}, ${pct}% character alignment).`;
}

function pageSentence(page) {
  if (!page || page.error === 'timeout') return 'The public page did not respond before the check stopped waiting.';
  if (!page || page.error === 'fetch_failed') return 'The public page could not be read.';
  if (!page || page.httpStatus == null) return 'No public HTTP status was recorded.';
  if (!page.ok) return `The public request returned HTTP ${page.httpStatus}.`;
  return `The public request returned HTTP ${page.httpStatus}.`;
}

function itemShell(parsed, extra) {
  return {
    url: parsed?.url || '',
    platform: parsed?.platform || 'website',
    handle: parsed?.handle || '',
    httpStatus: null,
    reachable: false,
    displayName: '',
    similarity: null,
    closestOfficial: '',
    comparison: 'not_compared',
    confidence: 'low',
    finding: '',
    signals: [],
    reportSteps: reportStepsFor(parsed?.platform || 'website'),
    ...extra,
  };
}

function blockedFinding(parsed, reason) {
  const why = reason === 'private_address' || reason === 'blocked_host'
    ? 'The link points at a private or local address, so it was not fetched.'
    : reason === 'not_https'
      ? 'The link is not https, so it was not fetched.'
      : reason === 'dns_failed'
        ? 'The hostname did not resolve, so the page was not fetched.'
        : 'The link was not fetched.';
  return itemShell(parsed, {
    finding: `${why} ${HONESTY}`,
    signals: [`Fetch skipped: ${reason}.`],
  });
}

export async function researchIntake(intake, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const resolveImpl = options.resolveImpl || lookupAll;
  const timeoutMs = options.timeoutMs || DEFAULT_FETCH_TIMEOUT_MS;
  const officials = officialProfiles(intake?.links);
  const urls = extractSubmittedUrls(intake?.knownFakes);
  const items = [];
  if (urls.length === 0) {
    items.push(itemShell(null, {
      platform: 'website',
      finding: `No public https link was found in the suspicious accounts you sent, so no page was read. A handle without a link was not fetched. ${HONESTY}`,
      signals: ['No https URL in the submitted notes.'],
      reportSteps: reportStepsFor('website'),
    }));
  }
  for (const url of urls) {
    const parsed = parseAccountUrl(url);
    const safety = assessUrl(url);
    if (!parsed || !safety.ok) {
      items.push(blockedFinding(parsed || { url, platform: 'website', handle: '' }, safety.ok ? 'bad_url' : safety.error));
      continue;
    }
    const addresses = await resolvePublicAddresses(safety.hostname, resolveImpl);
    if (addresses === null) {
      items.push(blockedFinding(parsed, 'dns_failed'));
      continue;
    }
    if (addresses.length === 0 || addresses.some((address) => isPrivateAddress(address))) {
      items.push(blockedFinding(parsed, 'private_address'));
      continue;
    }
    const page = await readPublicPage(url, fetchImpl, timeoutMs);
    const best = closestOfficial(parsed.handle, officials.filter((official) => official.handle));
    const comparison = comparisonOf(best ? best.score : null);
    const confidence = confidenceFor(page, parsed.handle);
    const signals = [
      pageSentence(page),
      parsed.handle ? `Handle read from the URL: @${parsed.handle}.` : 'No handle could be read from the URL.',
      comparisonSentence(comparison, best),
    ];
    if (page.displayName) signals.push(`Public title: ${page.displayName}.`);
    else if (page.ok) signals.push('The response did not include a public title. Many platforms only draw the profile inside a browser.');
    if (page.loginWall) signals.push('The response looks like a sign-in page. The profile itself was not readable.');
    const creator = typeof intake?.name === 'string' ? intake.name.trim() : '';
    if (creator && page.displayName && page.displayName.toLowerCase().includes(creator.toLowerCase())) {
      signals.push('The public title contains the name from the intake. That is a text match, not identity.');
    }
    const finding = [
      `Automated research on ${platformLabel(parsed.platform)}.`,
      pageSentence(page),
      parsed.handle ? `URL handle @${parsed.handle}.` : 'No handle was parsed from the URL.',
      comparisonSentence(comparison, best),
      page.displayName ? `Public title: "${page.displayName}".` : 'No public title was available.',
      `Data confidence: ${confidence}.`,
      HONESTY,
    ].join(' ');
    items.push(itemShell(parsed, {
      httpStatus: page.httpStatus,
      reachable: page.ok === true,
      displayName: page.displayName || '',
      similarity: best ? best.score : null,
      closestOfficial: best ? best.handle : '',
      comparison,
      confidence,
      finding,
      signals,
    }));
  }
  const readable = items.filter((item) => item.reachable).length;
  const summary = `Automated research read ${items.length} submitted ${items.length === 1 ? 'item' : 'items'}. ${readable} returned a public page. These notes are not a determination, not a removal, and not a report filed with any platform.`;
  return {
    summary,
    source: 'automated',
    automated: true,
    items,
  };
}

export function enrichEvidenceItem(item) {
  const url = typeof item?.url === 'string' ? item.url.trim().slice(0, 500) : '';
  const parsed = parseAccountUrl(url);
  const platform = parsed?.platform || (item?.platform === 'instagram' || item?.platform === 'facebook' || item?.platform === 'tiktok' || item?.platform === 'x' || item?.platform === 'youtube' || item?.platform === 'website'
    ? item.platform
    : 'website');
  const finding = typeof item?.finding === 'string' ? item.finding.trim().slice(0, 2000) : '';
  const suppliedSteps = Array.isArray(item?.reportSteps)
    ? item.reportSteps.map((step) => (typeof step === 'string' ? step.trim().slice(0, 500) : '')).filter(Boolean).slice(0, 6)
    : [];
  return {
    url,
    platform,
    handle: (typeof item?.handle === 'string' && item.handle.trim() ? item.handle.trim() : parsed?.handle || '').slice(0, 80),
    httpStatus: Number.isInteger(item?.httpStatus) ? item.httpStatus : null,
    reachable: item?.reachable === true,
    displayName: typeof item?.displayName === 'string' ? item.displayName.trim().slice(0, 200) : '',
    similarity: typeof item?.similarity === 'number' && Number.isFinite(item.similarity) ? Math.round(item.similarity * 100) / 100 : null,
    closestOfficial: typeof item?.closestOfficial === 'string' ? item.closestOfficial.trim().slice(0, 80) : '',
    comparison: typeof item?.comparison === 'string' ? item.comparison.slice(0, 40) : 'not_compared',
    confidence: item?.confidence === 'high' || item?.confidence === 'medium' || item?.confidence === 'low' ? item.confidence : 'low',
    finding,
    signals: Array.isArray(item?.signals)
      ? item.signals.map((signal) => (typeof signal === 'string' ? signal.trim().slice(0, 300) : '')).filter(Boolean).slice(0, 8)
      : [],
    reportSteps: suppliedSteps.length > 0 ? suppliedSteps : reportStepsFor(platform),
  };
}
