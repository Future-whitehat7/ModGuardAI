import assert from 'node:assert/strict';
import test from 'node:test';
import { riskTier } from '../src/lib/riskTier.ts';

test('a blocked or unread page is never low signal', () => {
  assert.equal(riskTier({ httpStatus: 403, similarity: 0.95, confidence: 'high' }).id, 'unchecked');
  assert.equal(riskTier({ httpStatus: 404, similarity: 0.1 }).label, "Couldn't check");
  assert.equal(riskTier({ confidence: 'timeout', similarity: 0.8 }).id, 'unchecked');
  assert.equal(riskTier({ confidence: 'blocked' }).id, 'unchecked');
  assert.equal(riskTier({ verdict: 'Could not read the profile' }).id, 'unchecked');
  assert.equal(riskTier({}).id, 'unchecked');
});

test('similarity and verdict words set the warning sign only after a read', () => {
  assert.equal(riskTier({ httpStatus: 200, similarity: 0.86, confidence: 'high' }).label, 'High risk');
  assert.equal(riskTier({ verdict: 'Likely a fake account' }).id, 'high-risk');
  assert.equal(riskTier({ verdict: 'not a scam' }).label, 'Low signal');
  assert.equal(riskTier({ httpStatus: 200, similarity: 0.51, confidence: 'medium' }).label, 'Suspicious');
  assert.equal(riskTier({ verdict: 'Suspicious overlap with the real handle' }).id, 'suspicious');
  assert.equal(riskTier({ httpStatus: 200, similarity: 0.18, confidence: 'medium' }).label, 'Low signal');
  assert.equal(riskTier({ verdict: 'No strong signs in this read' }).id, 'low-signal');
});
