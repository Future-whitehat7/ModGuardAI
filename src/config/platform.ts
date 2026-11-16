/** Shared platform URLs and the three audience tiers. One file on purpose. */

export const SCAMCHECK_URL = 'https://scamcheck.modguardai.org';
export const OG_IMAGE_URL = 'https://modguardai.org/og.png';
export const OG_IMAGE_WIDTH = '1347';
export const OG_IMAGE_HEIGHT = '380';
export const SCAMCHECK_FAQ_URL = 'https://scamcheck.modguardai.org/faq';
export const PLAYBOOK_URL = 'https://scamcheck.modguardai.org/playbook';
export const PLAYBOOK_CHECKOUT_URL = 'https://buy.stripe.com/14AcN60EMdcW9Rj8gj4ZG05';

/** $199 one-time Impersonation Check. Not the Sponsors Growth tier at $199/month. */
export const IMPERSONATION_CHECKOUT_URL = 'https://buy.stripe.com/28E6oIgDKc8S8NfdAD4ZG07';

/** Free impersonation checker. CORS allows modguardai.org and *.netlify.app. */
export const CHECKER_ENDPOINT = 'https://scamcheck.modguardai.org/api/impersonation-check';

export const INQUIRY_API_URL = 'https://scamcheck.modguardai.org/api/inquiry';

export type TierId = 'starter' | 'growth' | 'elite';

export type TierCheckout =
  | { kind: 'stripe'; href: string }
  | { kind: 'pending-stripe' };

export interface ProtectionTier {
  id: TierId;
  name: string;
  audience: string;
  purpose: string;
  prices: { label: string; detail: string }[];
  includes: string[];
  checkout: TierCheckout;
}

export const protectionTiers: ProtectionTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    audience: 'Small creators (under 100K followers)',
    purpose: 'A smaller audience, before a copy of the account has much room.',
    prices: [
      { label: '$49/week', detail: 'week' },
      { label: '$99/month', detail: 'month' },
    ],
    includes: [
      'Checkout is not open. Scope is confirmed in writing before anyone pays.',
    ],
    checkout: { kind: 'pending-stripe' },
  },
  {
    id: 'growth',
    name: 'Growth',
    audience: 'Creators with 100K to 1 million followers',
    purpose: 'A monthly Sponsors tier. It is not the $199 one-time Impersonation Check.',
    prices: [{ label: '$199/month', detail: 'month' }],
    includes: [
      'Checkout for this monthly price is not open on this page.',
      'The $199 one-time Impersonation Check is a separate payment, after intake.',
    ],
    checkout: { kind: 'pending-stripe' },
  },
  {
    id: 'elite',
    name: 'Elite',
    audience: 'Accounts over 1 million followers',
    purpose: 'The largest accounts. Scope is agreed before payment.',
    prices: [{ label: 'From $499/month', detail: 'month' }],
    includes: [
      'Checkout is not open. The listed price starts at $499 a month.',
      'The Impersonation Check $499 option is separate: Over 1 million followers, or public figures booked through a manager.',
    ],
    checkout: { kind: 'pending-stripe' },
  },
];

export function tierById(id: TierId): ProtectionTier {
  const tier = protectionTiers.find((item) => item.id === id);
  if (!tier) {
    throw new Error(`Unknown tier ${id}`);
  }
  return tier;
}

/** One-time Impersonation Check prices. Not the Sponsors monthly tiers. */
export const intakeTierRadios = [
  {
    value: '199',
    label: '$199 one-time. Creators with 100K to 1 million followers',
  },
  {
    value: '499',
    label: '$499. Over 1 million followers, or public figures booked through a manager',
  },
] as const;

export type IntakeTierValue = (typeof intakeTierRadios)[number]['value'];
