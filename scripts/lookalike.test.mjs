import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { lookalikePlatforms, suspiciousAccountField } from '../src/config/submittedAccounts.ts';
import { mergeSubmittedCoverage } from '../netlify/functions/lib/coverage.mjs';
import { bareHandles, generateLookalikes, maxCandidates, searchSeeds } from '../netlify/functions/lib/lookalikes.mjs';
import { buildReportModel, buildReportPdf } from '../netlify/functions/lib/report-pdf.mjs';
import { renderResultsEmail } from '../netlify/functions/lib/report-email.mjs';
import { CURATED_SITES, checkSite, discoverLookalikes } from '../netlify/functions/lib/sherlock-check.mjs';
import { memoryStore } from '../netlify/functions/lib/order-machine.mjs';

const publicDns = async () => ['93.184.216.34'];

const NOW = Date.parse('2026-11-10T12:00:00.000Z');
const SITE = {
  ExampleSite: {
    url: 'https://example.test/{}',
    errorType: 'status_code',
    username_claimed: 'knownname',
  },
  FalseSite: {
    url: 'https://false.test/{}',
    errorType: 'status_code',
    username_claimed: 'knownname',
  },
};

test('look-alike generator ranks edits and includes the requested kinds', () => {
  const list = generateLookalikes('examplecreator', { limit: 40 });
  assert.equal(list.length <= 40, true);
  assert.equal(list.some((item) => item.kind === 'separator'), true);
  assert.equal(list.some((item) => item.kind === 'affix' && item.handle.includes('official')), true);
  assert.equal(list.some((item) => item.kind === 'swap' && item.handle.includes('0')), true);
  assert.equal(list.some((item) => item.kind === 'doubled'), true);
  assert.equal(list.some((item) => item.kind === 'dropped'), true);
  assert.equal(list.some((item) => item.kind === 'homoglyph'), true);
  for (let index = 1; index < list.length; index += 1) {
    assert.equal(list[index - 1].distance <= list[index].distance, true);
  }
  assert.deepEqual(bareHandles('@Example.Creator\nexamplecreator\nhttps://instagram.com/skip'), ['Example.Creator', 'examplecreator']);
  const seeds = searchSeeds({
    links: { instagram: 'https://instagram.com/examplecreator' },
    knownFakes: '@othername',
  });
  assert.deepEqual(seeds.map((seed) => seed.handle.toLowerCase()), ['examplecreator', 'othername']);
});

test('a block, a captcha page, and a timeout are unknown and never available', async () => {
  const cases = [
    async () => checkSite('ExampleSite', SITE.ExampleSite, 'someone', {
      resolveImpl: publicDns,
      fetchImpl: async () => new Response('please complete the captcha', { status: 429 }),
    }),
    async () => checkSite('ExampleSite', SITE.ExampleSite, 'someone', {
      resolveImpl: publicDns,
      fetchImpl: async () => new Response('cf-browser-verification', { status: 403 }),
    }),
    async () => checkSite('ExampleSite', SITE.ExampleSite, 'someone', {
      resolveImpl: publicDns,
      fetchImpl: async () => {
        const error = new Error('timed out');
        error.name = 'TimeoutError';
        throw error;
      },
    }),
    async () => checkSite('ExampleSite', SITE.ExampleSite, 'someone', {
      resolveImpl: publicDns,
      fetchImpl: async () => new Response('down', { status: 503 }),
    }),
  ];
  for (const run of cases) {
    const result = await run();
    assert.equal(result.status, 'UNKNOWN');
    assert.notEqual(result.status, 'AVAILABLE');
  }
});

test('a site is used only when the self-test sees a claimed name and an available random name', async () => {
  const store = memoryStore();
  const result = await discoverLookalikes({
    intake: { links: { website: 'https://example.com/knownname' }, knownFakes: 'noted' },
    data: SITE,
    sites: ['ExampleSite', 'FalseSite'],
    store,
    now: NOW,
    deadline: NOW + 60_000,
    timeoutMs: 1000,
    clock: () => NOW,
    resolveImpl: publicDns,
    fetchImpl: async (url) => {
      const href = String(url);
      if (href.includes('false.test')) return new Response('present', { status: 200 });
      if (href.includes('/mg')) return new Response('missing', { status: 404 });
      if (href.includes('facebook.com/ads/library')) return new Response('login', { status: 200, headers: { 'content-type': 'text/html' } });
      return new Response('present', { status: 200 });
    },
  });
  assert.deepEqual(result.coverage.checked, ['ExampleSite']);
  assert.equal(result.coverage.skipped.some((item) => item.site === 'FalseSite' && item.reason === 'self-test'), true);
  assert.equal(result.lookalikes.length > 0, true);
  assert.equal(result.lookalikes.every((item) => item.platform === 'ExampleSite'), true);
  assert.equal(result.lookalikes.every((item) => item.label === 'possible, unverified'), true);
  let selfTestFetches = 0;
  const again = await discoverLookalikes({
    intake: { links: { website: 'https://example.com/knownname' }, knownFakes: 'noted' },
    data: SITE,
    sites: ['ExampleSite', 'FalseSite'],
    store,
    now: NOW,
    deadline: NOW + 60_000,
    timeoutMs: 1000,
    clock: () => NOW,
    resolveImpl: publicDns,
    fetchImpl: async (url) => {
      const href = String(url);
      if (href.endsWith('/knownname') || href.includes('/mg')) selfTestFetches += 1;
      if (href.includes('/mg')) return new Response('missing', { status: 404 });
      if (href.includes('facebook.com/ads/library')) return new Response('<title>Log in</title>', { status: 200, headers: { 'content-type': 'text/html' } });
      return new Response('present', { status: 200 });
    },
  });
  assert.equal(selfTestFetches, 0);
  assert.deepEqual(again.coverage.checked, ['ExampleSite']);
});

test('the time budget stops new look-alike checks', () => {
  assert.equal(maxCandidates({ remainingMs: 500, siteCount: 8, concurrency: 3, timeoutMs: 8000 }), 0);
  assert.equal(maxCandidates({ remainingMs: 0, siteCount: 1, concurrency: 1, timeoutMs: 1000 }), 0);
});

test('discovery records partial coverage when the budget cannot fit the candidates', async () => {
  const store = memoryStore();
  await store.set('selftest:ExampleSite:2026-11-10', { pass: true, at: NOW });
  let fetches = 0;
  const result = await discoverLookalikes({
    intake: { links: { website: 'https://example.com/knownname' }, knownFakes: 'noted' },
    data: SITE,
    sites: ['ExampleSite'],
    store,
    now: NOW,
    deadline: NOW + 500,
    timeoutMs: 8000,
    clock: () => NOW,
    resolveImpl: publicDns,
    fetchImpl: async () => {
      fetches += 1;
      return new Response('present', { status: 200 });
    },
  });
  assert.equal(fetches, 0);
  assert.equal(result.coverage.partial, true);
  assert.equal(result.lookalikes.length, 0);
  assert.equal(result.coverage.skipped.some((item) => item.reason === 'time_budget'), true);
});

test('the report names possible look-alikes and the platforms the server cannot check', async () => {
  const model = buildReportModel({
    orderId: 'ord_sample',
    summary: 'Automated research. This is not a determination.',
    items: [{
      url: 'https://instagram.com/examplecreat0r',
      platform: 'instagram',
      handle: 'examplecreat0r',
      httpStatus: 200,
      similarity: 0.93,
      closestOfficial: 'examplecreator',
      confidence: 'high',
      finding: 'Automated research. This is not a determination and it does not remove an account.',
      displayName: 'Example',
      reportSteps: ['Open the platform report form. The platform decides.'],
    }],
    lookalikes: [{
      handle: 'examplecreat0r',
      platform: 'YouTube',
      url: 'https://www.youtube.com/@examplecreat0r',
      similarity: 0.93,
      confidence: 'medium',
      label: 'possible, unverified',
    }],
    coverage: {
      checked: ['YouTube'],
      notChecked: ['TikTok not checked', 'Meta ads not checked'],
      notes: [],
      skipped: [],
      partial: true,
      instruction: 'Checked means a public page returned. A line that says not checked means that platform did not return a public page. This is not a determination and it does not remove an account.',
    },
    generatedAt: '2026-11-10T14:00:00.000Z',
  });
  const pdf = await buildReportPdf(model);
  const email = renderResultsEmail(model);
  for (const text of [pdf.text, email.text, email.html]) {
    assert.match(text, /Possible look-alike accounts found/);
    assert.match(text, /possible, unverified/);
    assert.match(text, /Coverage/);
    assert.match(text, /Platforms checked: YouTube/);
    assert.match(text, /TikTok not checked/);
    assert.match(text, /Meta ads not checked/);
    assert.equal(text.includes('Snapchat'), false);
    assert.equal(text.includes('LinkedIn'), false);
    assert.equal(/full sweep/i.test(text), false);
    assert.equal(text.toLowerCase().includes('guaranteed removal'), false);
    assert.equal(/\bnot found\b/i.test(text), false);
  }
  assert.equal(Buffer.from(pdf.bytes).subarray(0, 4).toString(), '%PDF');
});

test('a private address, an http url, and an authorization header are not used', async () => {
  let fetched = 0;
  const hidden = await checkSite('ExampleSite', SITE.ExampleSite, 'someone', {
    resolveImpl: async () => ['127.0.0.1'],
    fetchImpl: async () => {
      fetched += 1;
      return new Response('secret', { status: 200 });
    },
  });
  assert.equal(hidden.status, 'UNKNOWN');
  const insecure = await checkSite('ExampleSite', { ...SITE.ExampleSite, url: 'http://example.test/{}' }, 'someone', {
    resolveImpl: publicDns,
    fetchImpl: async () => {
      fetched += 1;
      return new Response('secret', { status: 200 });
    },
  });
  assert.equal(insecure.status, 'UNKNOWN');
  assert.equal(fetched, 0);
  let headers = {};
  await checkSite('ExampleSite', {
    ...SITE.ExampleSite,
    headers: { Cookie: 'session=secret', Authorization: 'Bearer secret', 'Accept-Language': 'en' },
  }, 'someone', {
    resolveImpl: publicDns,
    fetchImpl: async (_url, init) => {
      headers = init.headers;
      return new Response('missing', { status: 404, headers: { 'content-type': 'text/html' } });
    },
  });
  assert.equal(headers.cookie, undefined);
  assert.equal(headers.authorization, undefined);
  assert.equal(headers['accept-language'], 'en');
  assert.match(String(headers['user-agent']), /public page check/);
});

test('a timeout on one platform stays in coverage and does not fail the search', async () => {
  const result = await discoverLookalikes({
    intake: { links: { website: 'https://example.com/knownname' }, knownFakes: '@noted' },
    data: SITE,
    sites: ['ExampleSite', 'FalseSite'],
    store: memoryStore(),
    now: NOW,
    deadline: NOW + 60_000,
    timeoutMs: 1000,
    clock: () => NOW,
    resolveImpl: publicDns,
    fetchImpl: async (url) => {
      const href = String(url);
      if (href.includes('false.test') || href.includes('facebook.com/ads/library')) {
        const error = new Error('timed out');
        error.name = 'AbortError';
        throw error;
      }
      if (href.includes('/mg')) return new Response('missing', { status: 404, headers: { 'content-type': 'text/html' } });
      return new Response('<title>Known Name</title>', { status: 200, headers: { 'content-type': 'text/html' } });
    },
  });
  assert.deepEqual(result.coverage.checked, ['ExampleSite']);
  assert.equal(result.coverage.notChecked.includes('FalseSite not checked'), true);
  assert.equal(result.coverage.notChecked.includes('Meta ads not checked'), true);
  assert.equal(result.coverage.notChecked.some((line) => line.includes('Snapchat')), false);
  assert.equal(result.lookalikes.every((item) => item.platform === 'ExampleSite'), true);
});

test('submitted pages join coverage without naming a platform that was not tried', () => {
  const coverage = mergeSubmittedCoverage([
    {
      url: 'https://instagram.com/example',
      platform: 'instagram',
      httpStatus: null,
      signals: ['The public page did not respond before the check stopped waiting.'],
    },
    {
      url: 'https://www.tiktok.com/@example',
      platform: 'tiktok',
      httpStatus: 200,
      signals: ['The public request returned HTTP 200.'],
    },
    { platform: 'website', httpStatus: null, url: '' },
  ], {
    checked: ['GitHub'],
    notChecked: ['TikTok not checked', 'YouTube not checked', 'Meta ads not checked'],
    notes: [],
    skipped: [],
    partial: false,
    instruction: 'Checked means a public page returned.',
  });
  assert.equal(coverage.checked.includes('GitHub'), true);
  assert.equal(coverage.checked.includes('TikTok'), true);
  assert.equal(coverage.notChecked.includes('TikTok not checked'), false);
  assert.equal(coverage.notChecked.includes('Instagram not checked'), true);
  assert.equal(coverage.notChecked.includes('Meta ads not checked'), true);
  assert.equal(coverage.notes.some((note) => note.includes('TikTok')), true);
  assert.equal(coverage.notChecked.some((line) => line.includes('Snapchat')), false);
});

test('the site names only the platforms the look-alike check tries', () => {
  assert.deepEqual([...lookalikePlatforms], CURATED_SITES);
  const page = readFileSync(new URL('../src/pages/ImpersonationCheck.tsx', import.meta.url), 'utf8');
  const thanks = readFileSync(new URL('../src/pages/ImpersonationThanks.tsx', import.meta.url), 'utf8');
  const form = readFileSync(new URL('../src/components/marketing/IntakeForm.tsx', import.meta.url), 'utf8');
  for (const source of [page, thanks, form, suspiciousAccountField.hint]) {
    assert.equal(/full sweep/i.test(source), false);
    assert.equal(source.includes('Snapchat'), false);
  }
  assert.match(page, /Meta Ad Library/);
  assert.match(page, /lookalikePlatforms/);
  assert.match(form, /limitsConsent/);
  assert.match(thanks, /Platforms checked/);
  assert.equal(thanks.includes("['Instagram', 'Facebook'"), false);
});

test('the intake field asks for full links and still posts known_fakes', () => {
  assert.match(suspiciousAccountField.placeholder, /^https:\/\//);
  assert.match(suspiciousAccountField.hint, /https:\/\/www\.tiktok\.com\/@example\.creator/);
  assert.match(suspiciousAccountField.hint, /@example\.creator/);
  const form = readFileSync(new URL('../src/components/marketing/IntakeForm.tsx', import.meta.url), 'utf8');
  assert.match(form, /name="known_fakes"/);
  assert.match(form, /suspiciousAccountField/);
});
