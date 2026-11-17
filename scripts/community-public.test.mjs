import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { partnerTypes, sectionLines, sponsorTiers } from '../src/community/public.ts';

test('the public community page names no unreleased product and has its own title', () => {
  const page = readFileSync('src/pages/Community.tsx', 'utf8');
  const html = readFileSync('index.html', 'utf8');
  const waitlist = html.slice(html.indexOf('name="community-waitlist"'), html.indexOf('name="community-join"'));
  const partner = html.slice(html.indexOf('name="community-partner"'), html.indexOf('name="community-waitlist"'));
  const joined = [page, waitlist, partner, ...partnerTypes, ...Object.values(sectionLines)].join('\n');
  for (const banned of ['WhatsApp', 'Telegram', 'Bank / Telco', 'Free scam-check', 'language library', 'Multilingual', 'No partner is named', 'No sponsor is named', 'These are plans']) {
    assert.equal(joined.includes(banned), false, banned);
  }
  assert.equal(partnerTypes.includes('Integration'), true);
  assert.equal(sponsorTiers.every((tier) => tier.note === 'Pricing on request'), true);
  const site = readFileSync('src/components/marketing/site.ts', 'utf8');
  assert.equal(site.includes("path === '/community'"), true);
  assert.equal(site.includes('Community | ModGuard AI'), true);
  assert.equal(html.includes("'/community'"), true);
});
