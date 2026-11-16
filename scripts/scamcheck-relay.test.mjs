import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareRelay } from '../netlify/functions/scamcheck-relay.mjs';

test('message and statement checks use the existing ScamCheck endpoints', () => {
  const message = prepareRelay({ kind: 'message', text: 'A bank text' });
  assert.equal(message.target, 'https://scamcheck.modguardai.org/api/check');
  assert.deepEqual(message.body, { text: 'A bank text' });

  const statement = prepareRelay({ kind: 'statement', text: '10/02 NETFLIX.COM 15.49' });
  assert.equal(statement.target, 'https://scamcheck.modguardai.org/api/charges');
  assert.equal(statement.body.text, '10/02 NETFLIX.COM 15.49');
});

test('the relay refuses an empty check and an oversized screenshot', () => {
  assert.equal(prepareRelay({ kind: 'message', text: '   ' }).status, 400);
  assert.equal(prepareRelay({ kind: 'other', text: 'hello' }).status, 400);
  const huge = `data:image/png;base64,${'a'.repeat(5_500_000)}`;
  assert.equal(prepareRelay({ kind: 'message', text: '', image: huge }).status, 400);
  const ok = prepareRelay({ kind: 'message', text: '', image: 'data:image/png;base64,abc' });
  assert.equal(ok.body.image, 'data:image/png;base64,abc');
});
