export const partnerTypes = [
  'Platform and trust',
  'Research and data',
  'Education and campus',
  'Distribution',
  'Integration',
] as const;

export const sponsorTiers = [
  { name: 'Supporter', note: 'Pricing on request' },
  { name: 'Hackathon sponsor', note: 'Pricing on request' },
  { name: 'Founding sponsor', note: 'Pricing on request' },
] as const;

export const communityTitle = 'Community | ModGuard AI';

export const communityDescription =
  'Join the ModGuard community, ask about a partnership, or inquire about a sponsorship tier.';

export const sectionLines = {
  hero: 'Raise a hand. We read every note and write back.',
  partner: 'Tell us the work you want to do with ModGuard.',
  updates: "We'll email you when something new is ready.",
  join: 'Leave your name and the kind of help you want to give.',
  sponsor: 'Supporter, hackathon, or founding. Pricing is on request.',
  card: 'Example card. Daily games are coming soon; this is not a real score.',
} as const;
