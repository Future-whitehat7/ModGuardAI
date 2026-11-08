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
