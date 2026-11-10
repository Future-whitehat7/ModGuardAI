export type IntakeTier = '199' | '499';

export type IntakeBlock =
  | { ok: false; reason: 'bad-url' | 'missing-link' | 'incomplete'; message: string }
  | { ok: true; tier: IntakeTier; action: string };

export function intakeTierFromValue(value: string | null | undefined): IntakeTier {
  return value === '499' ? '499' : '199';
}

export function intakeThanksPath(tier: IntakeTier): string {
  return `/impersonation-check/thanks?tier=${tier}`;
}

/** Client-side gate. A passing result still must not be posted to Netlify from a test. */
export function intakeDecision(input: {
  invalidRequired: number;
  hasAccountLink: boolean;
  invalidUrls: number;
  tierValue: string | null;
}): IntakeBlock {
  if (input.invalidUrls > 0) {
    return { ok: false, reason: 'bad-url', message: 'Use a full https link for each account you add.' };
  }
  if (input.invalidRequired > 0 || !input.hasAccountLink) {
    if (!input.hasAccountLink && input.invalidRequired === 0) {
      return { ok: false, reason: 'missing-link', message: 'Add at least one official account link in section 2.' };
    }
    const extra = input.hasAccountLink ? '' : ' and add at least one official account link';
    return {
      ok: false,
      reason: 'incomplete',
      message: `Please complete the highlighted fields${extra}.`,
    };
  }
  const tier = intakeTierFromValue(input.tierValue);
  return { ok: true, tier, action: intakeThanksPath(tier) };
}

/**
 * $199 opens the existing one-time Stripe link. $499 does not.
 * The link itself stays in platform.ts and is not a monthly Sponsors price.
 */
export const FORM_STARTED_KEY = 'impersonation-form-started';

export interface MemoryStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** What this site can show. A URL query is not one of these facts. */
export type OrderView =
  | { kind: 'no-intake'; payment: 'not-verified'; report: 'not-started' }
  | {
      kind: 'form-started';
      tier: IntakeTier;
      payment: 'not-verified';
      netlifyStored: 'unconfirmed';
      report: 'not-started';
    };

export function markFormStarted(store: MemoryStore, tier: IntakeTier, now = Date.now()): void {
  store.setItem(FORM_STARTED_KEY, JSON.stringify({ tier, startedAt: now }));
}

function startedTier(raw: string | null): IntakeTier | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || !('tier' in parsed)) return null;
    const tier = parsed.tier;
    if (tier === '199' || tier === '499') return tier;
    return null;
  } catch {
    return null;
  }
}

/**
 * The query string is ignored on purpose. Visiting /thanks?tier=199 is not an intake
 * and is not a payment. Only the marker written when this browser passes the form is.
 */
export function readOrderView(store: MemoryStore, queryTier: string | null): OrderView {
  void queryTier;
  const tier = startedTier(store.getItem(FORM_STARTED_KEY));
  if (!tier) return { kind: 'no-intake', payment: 'not-verified', report: 'not-started' };
  return {
    kind: 'form-started',
    tier,
    payment: 'not-verified',
    netlifyStored: 'unconfirmed',
    report: 'not-started',
  };
}

export const deliveryLimits = [
  'Automated research reads public pages only. It does not log in, and it does not decide that an account is impersonation.',
  'Customer and operator email send only when RESEND_API_KEY, RESEND_FROM, and DELIVERY_SEND_ENABLED=1 are set. A missing setting is recorded.',
  'OPERATOR_EMAIL is a comma-separated list. Each address gets its own copy. A failed address is recorded and retried without resending the ones that succeeded.',
  'We do not file platform reports and we do not guarantee removal.',
] as const;

/** @deprecated Use deliveryLimits. Kept so older notes still point at the honest limits. */
export const deliveryGaps = deliveryLimits;

export function payNowHref(tier: IntakeTier, checkoutUrl: string): string | null {
  switch (tier) {
    case '199':
      return checkoutUrl;
    case '499':
      return null;
    default: {
      const unexpected: never = tier;
      throw new Error(`Unknown impersonation tier: ${String(unexpected)}`);
    }
  }
}
