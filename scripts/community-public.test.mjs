import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { partnerTypes, publicLines, sponsorTiers, waitlistInterests } from '../src/community/public.ts';

test('the public community page names no price, partner, or region tie', () => {
  const page = readFileSync('src/pages/Community.tsx', 'utf8');
  const joined = [...publicLines, ...partnerTypes, ...sponsorTiers.map((tier) => `${tier.name} ${tier.note}`), ...waitlistInterests, page].join('\n');
  for (const banned of ['$', 'UAE', 'Saudi', 'Qatar', 'Abu Dhabi', 'Dubai', 'Government', '3 to 5', 'Samuel', '@']) {
    assert.equal(joined.includes(banned), false, banned);
  }
  assert.equal(sponsorTiers.every((tier) => tier.note === 'Pricing on request'), true);
  assert.equal(waitlistInterests.length, 3);
});
