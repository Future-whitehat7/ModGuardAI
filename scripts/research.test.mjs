import assert from 'node:assert/strict';
import test from 'node:test';
import { parseOperatorEmails } from '../netlify/functions/lib/order-machine.mjs';
import {
  assessUrl,
  extractSubmittedUrls,
  handleSimilarity,
  parseAccountUrl,
  reportStepsFor,
  researchIntake,
} from '../netlify/functions/lib/research.mjs';

test('operator emails split on commas, trim, and keep invalid addresses visible', () => {
  const parsed = parseOperatorEmails(' owner@example.com, Second <second-operator@example.com> , owner@example.com, not-an-email ');
  assert.deepEqual(parsed.accepted, ['owner@example.com', 'second-operator@example.com']);
  assert.deepEqual(parsed.rejected, ['not-an-email']);
  assert.deepEqual(parseOperatorEmails(''), { accepted: [], rejected: [] });
});

test('handles and platforms are read from public https links', () => {
  const instagram = parseAccountUrl('https://instagram.com/examplecreat0r');
  assert.equal(instagram.platform, 'instagram');
  assert.equal(instagram.handle, 'examplecreat0r');
  const tiktok = parseAccountUrl('https://www.tiktok.com/@notrealhandle');
  assert.equal(tiktok.platform, 'tiktok');
  assert.equal(tiktok.handle, 'notrealhandle');
  assert.equal(handleSimilarity('examplecreator', 'examplecreat0r') >= 0.75, true);
  assert.equal(handleSimilarity('examplecreator', 'unrelatedname') < 0.5, true);
  assert.deepEqual(extractSubmittedUrls('see https://instagram.com/examplecreat0r\nwww.tiktok.com/@notrealhandle'), [
    'https://instagram.com/examplecreat0r',
    'https://www.tiktok.com/@notrealhandle',
  ]);
});

test('private and non-https links are not fetched', async () => {
  assert.equal(assessUrl('http://instagram.com/example').ok, false);
  assert.equal(assessUrl('https://127.0.0.1/secret').ok, false);
  assert.equal(assessUrl('https://user:pass@instagram.com/example').ok, false);
  let fetched = 0;
  const result = await researchIntake({
    name: 'Example',
    links: { instagram: 'https://instagram.com/examplecreator' },
    knownFakes: 'https://127.0.0.1/secret\nhttp://instagram.com/example',
  }, {
    fetchImpl: async () => {
      fetched += 1;
      return new Response('no', { status: 500 });
    },
    resolveImpl: async () => ['93.184.216.34'],
  });
  assert.equal(fetched, 0);
  assert.equal(result.items.length, 2);
  assert.match(result.items[0].finding, /was not fetched/i);
  assert.match(result.summary, /not a determination/i);
  assert.equal(JSON.stringify(result).toLowerCase().includes('modguard'), false);
  assert.equal(JSON.stringify(result).includes('guaranteed removal'), false);
});

test('a readable page records status, similarity, confidence, and report steps', async () => {
  const html = `<!doctype html><html><head><title>Example Creat0r</title>
    <meta property="og:title" content="Example Creat0r" />
    <meta property="og:description" content="A public profile shell." />
    </head><body>Example</body></html>`;
  const result = await researchIntake({
    name: 'Example Creator',
    links: { instagram: 'https://instagram.com/examplecreator' },
    knownFakes: 'https://instagram.com/examplecreat0r',
  }, {
    fetchImpl: async () => new Response(html, { status: 200, headers: { 'content-type': 'text/html' } }),
    resolveImpl: async () => ['93.184.216.34'],
  });
  const item = result.items[0];
  assert.equal(item.platform, 'instagram');
  assert.equal(item.handle, 'examplecreat0r');
  assert.equal(item.httpStatus, 200);
  assert.equal(item.reachable, true);
  assert.equal(item.similarity >= 0.75, true);
  assert.equal(item.closestOfficial, 'examplecreator');
  assert.equal(item.confidence, 'high');
  assert.match(item.finding, /Data confidence: high/);
  assert.match(item.finding, /not whether the account is impersonation/);
  assert.equal(item.reportSteps[0], reportStepsFor('instagram')[0]);
  assert.match(item.reportSteps.join('\n'), /https:\/\/help\.instagram\.com\//);
});
