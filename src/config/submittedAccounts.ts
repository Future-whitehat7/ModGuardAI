/** Copy for the suspicious-accounts field. The input name stays known_fakes. */
export const suspiciousAccountField = {
  label: 'Suspicious profile links',
  placeholder: 'https://www.instagram.com/example.lookalike',
  hint: 'Paste a full profile link (https://...) for each account you have spotted, one per line. Example: https://www.tiktok.com/@example.creator. A bare handle such as @example.creator is also accepted and used as a search seed. Instagram, Facebook, X, LinkedIn, Threads, and Snapchat are checked only when you send the link.',
} as const;
