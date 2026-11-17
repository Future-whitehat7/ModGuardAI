/** Invitation list only. These are not offices, partners, or events. */

export const gulfRegions = ['UAE', 'Abu Dhabi', 'Dubai', 'Saudi Arabia', 'Qatar'] as const;

export const regionChoices = [...gulfRegions, 'Other'] as const;

export const globalChips = [...gulfRegions, 'Your country', 'Anywhere in the world'] as const;
