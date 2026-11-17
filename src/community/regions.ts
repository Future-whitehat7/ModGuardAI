/** Invitation list only. These are not offices, partners, events, or endorsements. */

export const anchorRegions = ['UAE', 'Saudi Arabia'] as const;

export const otherGulf = ['Abu Dhabi', 'Dubai', 'Qatar'] as const;

export const gulfRegions = [...anchorRegions, ...otherGulf] as const;

export const regionChoices = [...gulfRegions, 'Other'] as const;

export const globalChips = [...gulfRegions, 'Your country', 'Anywhere in the world'] as const;
