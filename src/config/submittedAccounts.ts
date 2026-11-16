/** Copy for the suspicious-accounts field. The input name stays known_fakes. */

export const lookalikePlatforms = [
  'YouTube',
  'TikTok',
  'GitHub',
  'Telegram',
  'Pinterest',
  'Twitch',
  'Medium',
  'Patreon',
] as const;

const platformList = lookalikePlatforms.join(', ');

export const suspiciousAccountField = {
  label: 'Suspicious profile links',
  placeholder: 'https://www.instagram.com/example.lookalike',
  hint: `Paste a full profile link (https://...) for each account you have spotted, one per line. Example: https://www.tiktok.com/@example.creator. A bare handle such as @example.creator is used as a seed for similar public names on ${platformList}. The report names only the sites that answered. The public Meta Ad Library is tried once.`,
};

export const limitsConsent =
  `I understand ModGuard reads the public links I send and checks similar public handles only on ${platformList}, plus one try of the public Meta Ad Library. It does not check every platform, and it does not guarantee removal.`;
