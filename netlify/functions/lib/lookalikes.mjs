import { handleSimilarity, levenshtein, normalizeHandle, officialProfiles } from './research.mjs';

export const LOOKALIKE_LIMIT = 36;
const AFFIXES = ['official', 'real', 'the', 'team', 'support', 'help', 'hq', 'tv'];
const HOMOGLYPHS = { a: '\u0430', e: '\u0435', o: '\u043e', p: '\u0440', c: '\u0441', x: '\u0445', y: '\u0443' };

function asciiHandle(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9._-]/g, '').replace(/^[._-]+|[._-]+$/g, '').slice(0, 32);
}

/**
 * @param {string} handle
 * @param {{ limit?: number }} [options]
 */
export function generateLookalikes(handle, options = {}) {
  const base = normalizeHandle(handle);
  const limit = options.limit || LOOKALIKE_LIMIT;
  if (base.length < 2) return [];
  /** @type {Map<string, { handle: string, kind: string }>} */
  const found = new Map();
  const add = (value, kind) => {
    const next = asciiHandle(value);
    if (!next || next === base || next.length < 2 || found.has(next)) return;
    found.set(next, { handle: next, kind });
  };
  for (const separator of ['_', '.', '-']) {
    add(`${base}${separator}1`, 'separator');
    add(`${separator}${base}`, 'separator');
    if (base.length >= 4) {
      const mid = Math.floor(base.length / 2);
      add(`${base.slice(0, mid)}${separator}${base.slice(mid)}`, 'separator');
    }
  }
  for (const affix of AFFIXES) {
    add(`${base}_${affix}`, 'affix');
    add(`${base}${affix}`, 'affix');
    add(`${affix}_${base}`, 'affix');
    add(`${affix}${base}`, 'affix');
  }
  const swaps = [['o', '0'], ['0', 'o'], ['l', '1'], ['1', 'l'], ['i', '1'], ['1', 'i'], ['l', 'i']];
  for (let index = 0; index < base.length; index += 1) {
    for (const [from, to] of swaps) {
      if (base[index] === from) add(`${base.slice(0, index)}${to}${base.slice(index + 1)}`, 'swap');
    }
    add(`${base.slice(0, index)}${base[index]}${base.slice(index)}`, 'doubled');
    if (base.length > 3) add(`${base.slice(0, index)}${base.slice(index + 1)}`, 'dropped');
  }
  if (base.includes('rn')) add(base.replace('rn', 'm'), 'homoglyph');
  for (let index = 0; index < base.length; index += 1) {
    const glyph = HOMOGLYPHS[base[index]];
    if (!glyph) continue;
    const unicode = `${base.slice(0, index)}${glyph}${base.slice(index + 1)}`;
    if (!found.has(unicode)) found.set(unicode, { handle: unicode, kind: 'homoglyph' });
  }
  const ranked = [...found.values()]
    .map((item) => {
      const folded = normalizeHandle(item.handle) || base;
      const distance = levenshtein(base, folded);
      return {
        ...item,
        official: base,
        distance,
        similarity: handleSimilarity(base, folded) ?? 0,
      };
    })
    .sort((left, right) => left.distance - right.distance || left.handle.localeCompare(right.handle));
  const pinned = ['official', 'real', 'support', 'team']
    .map((affix) => ranked.find((item) => item.handle === `${base}_${affix}`))
    .filter(Boolean);
  const reserved = [...pinned, ...ranked.filter((item) => item.kind === 'affix' || item.kind === 'separator')].slice(0, 16);
  const reservedHandles = new Set(reserved.map((item) => item.handle));
  const rest = ranked.filter((item) => !reservedHandles.has(item.handle));
  return [...reserved, ...rest].slice(0, limit)
    .sort((left, right) => left.distance - right.distance || left.handle.localeCompare(right.handle));
}

export function bareHandles(text) {
  const handles = [];
  const seen = new Set();
  for (const line of String(text || '').split(/\n+/)) {
    const trimmed = line.trim();
    if (!trimmed || /^https?:\/\//i.test(trimmed)) continue;
    const handle = trimmed.replace(/^@/, '').split(/\s+/)[0];
    if (!/^[A-Za-z0-9._-]{2,32}$/.test(handle)) continue;
    const key = handle.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    handles.push(handle);
  }
  return handles;
}

export function searchSeeds(intake) {
  const seeds = [];
  const seen = new Set();
  const push = (handle, source) => {
    const key = normalizeHandle(handle);
    if (!key || seen.has(key)) return;
    seen.add(key);
    seeds.push({ handle, source });
  };
  for (const profile of officialProfiles(intake?.links)) push(profile.handle, 'official');
  for (const handle of bareHandles(intake?.knownFakes)) push(handle, 'submitted');
  return seeds;
}

export const UNCHECKED_PLATFORMS = [
  'Instagram',
  'Facebook',
  'X',
  'LinkedIn',
  'Threads',
  'Snapchat',
];

export const UNCHECKED_INSTRUCTION = 'These platforms cannot be checked reliably from this server. Paste a full https profile link for any account on them. A link you send is read on its own. This is not a determination and it does not remove an account.';

export function maxCandidates({ remainingMs, siteCount, concurrency, timeoutMs }) {
  if (remainingMs <= 0 || siteCount <= 0 || concurrency <= 0 || timeoutMs <= 0) return 0;
  const perCandidate = Math.ceil(siteCount / concurrency) * timeoutMs;
  return Math.floor(remainingMs / perCandidate);
}
