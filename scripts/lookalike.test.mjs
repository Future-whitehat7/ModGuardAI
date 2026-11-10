import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { suspiciousAccountField } from '../src/config/submittedAccounts.ts';
import { bareHandles, generateLookalikes, maxCandidates, searchSeeds } from '../netlify/functions/lib/lookalikes.mjs';
import { buildReportModel, buildReportPdf } from '../netlify/functions/lib/report-pdf.mjs';
import { renderResultsEmail } from '../netlify/functions/lib/report-email.mjs';
import { checkSite, discoverLookalikes } from '../netlify/functions/lib/sherlock-check.mjs';
import { memoryStore } from '../netlify/functions/lib/order-machine.mjs';

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
      fetchImpl: async () => new Response('please complete the captcha', { status: 429 }),
    }),
    async () => checkSite('ExampleSite', SITE.ExampleSite, 'someone', {
      fetchImpl: async () => new Response('cf-browser-verification', { status: 403 }),
    }),
    async () => checkSite('ExampleSite', SITE.ExampleSite, 'someone', {
      fetchImpl: async () => {
        const error = new Error('timed out');
        error.name = 'TimeoutError';
        throw error;
      },
    }),
    async () => checkSite('ExampleSite', SITE.ExampleSite, 'someone', {
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
    fetchImpl: async (url) => {
      const href = String(url);
      if (href.includes('false.test')) return new Response('present', { status: 200 });
      if (href.includes('/mg')) return new Response('missing', { status: 404 });
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
    fetchImpl: async (url) => {
      const href = String(url);
      if (href.endsWith('/knownname') || href.includes('/mg')) selfTestFetches += 1;
      if (href.includes('/mg')) return new Response('missing', { status: 404 });
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
      skipped: [],
      partial: true,
      uncheckedPlatforms: ['Instagram', 'Facebook', 'X', 'LinkedIn', 'Threads', 'Snapchat'],
      instruction: 'Paste a full https profile link for any account on them.',
    },
    generatedAt: '2026-11-10T14:00:00.000Z',
  });
  const pdf = await buildReportPdf(model);
  const email = renderResultsEmail(model);
  for (const text of [pdf.text, email.text, email.html]) {
    assert.match(text, /Possible look-alike accounts found/);
    assert.match(text, /possible, unverified/);
    assert.match(text, /Platforms not checked from the server/);
    assert.match(text, /Instagram/);
    assert.match(text, /Snapchat/);
    assert.equal(text.toLowerCase().includes('guaranteed removal'), false);
    assert.equal(/\bnot found\b/i.test(text), false);
  }
  assert.equal(Buffer.from(pdf.bytes).subarray(0, 4).toString(), '%PDF');
});

test('the intake field asks for full links and still posts known_fakes', () => {
  assert.match(suspiciousAccountField.placeholder, /^https:\/\//);
  assert.match(suspiciousAccountField.hint, /https:\/\/www\.tiktok\.com\/@example\.creator/);
  assert.match(suspiciousAccountField.hint, /@example\.creator/);
  const form = readFileSync(new URL('../src/components/marketing/IntakeForm.tsx', import.meta.url), 'utf8');
  assert.match(form, /name="known_fakes"/);
  assert.match(form, /suspiciousAccountField/);
});
