import { protectionTiers } from './platform';

/**
 * Ad placements. Set `sponsor` to replace the placeholder.
 * Leave it null to show "Sponsor this spot", which links to /sponsor.
 */
export type AdSlotId = 'home-between' | 'insight-article';

export interface AdSponsor {
  name: string;
  href: string;
  message: string;
}

export interface AdSlot {
  id: AdSlotId;
  sponsor: AdSponsor | null;
}

export const adSlots: Record<AdSlotId, AdSlot> = {
  'home-between': { id: 'home-between', sponsor: null },
  'insight-article': { id: 'insight-article', sponsor: null },
};

export const sponsorPath = '/sponsor';

/** Kept so a future sponsor creative can mention the live tier names without a second list. */
export const sponsorAudienceLine = protectionTiers.map((tier) => tier.name).join(', ');
