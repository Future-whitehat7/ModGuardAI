import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { IMPERSONATION_CHECKOUT_URL } from '../src/config/platform.ts';
import {
  deliveryGaps,
  intakeDecision,
  intakeThanksPath,
  markFormStarted,
  payNowHref,
  readOrderView,
} from '../src/config/impersonationHandoff.ts';

const STRIPE_199 = 'https://buy.stripe.com/28E6oIgDKc8S8NfdAD4ZG07';

test('199 hands off to the existing one-time Stripe link and 499 does not', () => {
  assert.equal(IMPERSONATION_CHECKOUT_URL, STRIPE_199);
  assert.equal(payNowHref('199', IMPERSONATION_CHECKOUT_URL), STRIPE_199);
  assert.equal(payNowHref('499', IMPERSONATION_CHECKOUT_URL), null);
  assert.equal(intakeThanksPath('199'), '/impersonation-check/thanks?tier=199');
  assert.equal(intakeThanksPath('499'), '/impersonation-check/thanks?tier=499');
});

test('incomplete intake is blocked and does not build a thanks URL', () => {
  const missing = intakeDecision({
    invalidRequired: 3,
    hasAccountLink: false,
    invalidUrls: 0,
    tierValue: '199',
  });
  assert.equal(missing.ok, false);
  if (!missing.ok) {
    assert.equal(missing.reason, 'incomplete');
    assert.match(missing.message, /highlighted fields/);
    assert.match(missing.message, /official account link/);
  }
});

test('a missing account link is its own block when the other required fields are filled', () => {
  const missingLink = intakeDecision({
    invalidRequired: 0,
    hasAccountLink: false,
    invalidUrls: 0,
    tierValue: '199',
  });
  assert.equal(missingLink.ok, false);
  if (!missingLink.ok) assert.equal(missingLink.reason, 'missing-link');
});

test('a partial URL is rejected before a thanks path exists', () => {
  const bad = intakeDecision({
    invalidRequired: 0,
    hasAccountLink: true,
    invalidUrls: 1,
    tierValue: '199',
  });
  assert.equal(bad.ok, false);
  if (!bad.ok) assert.equal(bad.reason, 'bad-url');
});

test('a complete intake records the tier on the thanks path and never the Stripe URL', () => {
  for (const tierValue of ['199', '499', null]) {
    const result = intakeDecision({
      invalidRequired: 0,
      hasAccountLink: true,
      invalidUrls: 0,
      tierValue,
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.tier, tierValue === '499' ? '499' : '199');
      assert.equal(result.action, intakeThanksPath(result.tier));
      assert.equal(result.action.includes('stripe.com'), false);
      assert.equal(result.action.includes(STRIPE_199), false);
    }
  }
});

test('the thanks page reads the server order and does not treat the query as payment', () => {
  const thanks = readFileSync(new URL('../src/pages/ImpersonationThanks.tsx', import.meta.url), 'utf8');
  assert.match(thanks, /\/api\/order-status/);
  assert.equal(thanks.includes('readOrderView'), false);
  assert.equal(thanks.includes('Intake received.'), false);
  assert.equal(thanks.includes(STRIPE_199), false);
  const form = readFileSync(new URL('../src/components/marketing/IntakeForm.tsx', import.meta.url), 'utf8');
  assert.match(form, /\/api\/intake/);
  assert.equal(form.includes(STRIPE_199), false);
});

function memory() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, value),
  };
}

test('a thanks URL query is not an intake and is not a payment', () => {
  for (const query of [null, '199', '499', 'paid', '1']) {
    const view = readOrderView(memory(), query);
    assert.equal(view.kind, 'no-intake');
    assert.equal(view.payment, 'not-verified');
    assert.equal(view.report, 'not-started');
  }
});

test('a form marker selects the tier and still does not verify payment or a report', () => {
  const store = memory();
  markFormStarted(store, '199', 1);
  const spoofed = readOrderView(store, '499');
  assert.equal(spoofed.kind, 'form-started');
  if (spoofed.kind === 'form-started') {
    assert.equal(spoofed.tier, '199');
    assert.equal(spoofed.payment, 'not-verified');
    assert.equal(spoofed.netlifyStored, 'unconfirmed');
    assert.equal(spoofed.report, 'not-started');
    assert.equal(payNowHref(spoofed.tier, IMPERSONATION_CHECKOUT_URL), STRIPE_199);
  }
  const elite = memory();
  markFormStarted(elite, '499', 2);
  const view = readOrderView(elite, '199');
  assert.equal(view.kind, 'form-started');
  if (view.kind === 'form-started') {
    assert.equal(view.tier, '499');
    assert.equal(payNowHref(view.tier, IMPERSONATION_CHECKOUT_URL), null);
  }
});

test('delivery still needs systems this repo does not have', () => {
  assert.equal(deliveryGaps.some((gap) => gap.includes('webhook')), true);
  assert.equal(deliveryGaps.some((gap) => gap.includes('order record')), true);
  assert.equal(deliveryGaps.some((gap) => gap.includes('mailer')), true);
});
