export interface DuelPair {
  id: string;
  scam: string;
  legit: string;
  flags: string;
}

/** Representative examples. Not real messages, and not named after a real company. */
export const duelPairs: DuelPair[] = [
  {
    id: 'parcel',
    scam: 'Your parcel is held at a depot. Pay the release fee at parcel-hold.example today or we send it back.',
    legit: 'Your library book is due Friday. Renew it in the library app you already installed.',
    flags: 'A fee, a deadline, and a link you did not ask for.',
  },
  {
    id: 'code',
    scam: 'This is the fraud desk. Read me the six-digit code that just arrived by text so we can stop a charge.',
    legit: 'Your power bill is ready in the account you opened with the utility. The amount is on the statement, not in this text.',
    flags: 'A caller asks for a one-time code. A real desk does not need you to read it aloud.',
  },
  {
    id: 'relative',
    scam: 'It is your cousin on a new number. I need gift cards for a bond tonight. Do not tell anyone.',
    legit: 'Practice is moved to 6pm in the same gym. Reply only if you need a ride from the coach you already know.',
    flags: 'A new number, secrecy, and gift cards.',
  },
];

export function pairForDay(day: string): DuelPair {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  const index = match ? Number(match[3]) % duelPairs.length : 0;
  return duelPairs[index];
}

export function votePercent(total: number | null, scamVotes: number): number | null {
  if (total === null || total <= 0) return null;
  return Math.round((scamVotes / total) * 100);
}

export interface ArcadeCard {
  id: string;
  src: string;
  kind: 'real' | 'ai';
  credit: string;
}

export const arcadeCards: ArcadeCard[] = [
  {
    id: 'earth',
    src: '/community/arcade/real-earth.jpg',
    kind: 'real',
    credit: 'NASA, PIA18033, public domain',
  },
  {
    id: 'moon',
    src: '/community/arcade/real-moon.jpg',
    kind: 'real',
    credit: 'NASA, PIA00405, public domain',
  },
  {
    id: 'harbor',
    src: '/community/arcade/ai-harbor.jpg',
    kind: 'ai',
    credit: 'Generated for ModGuard',
  },
  {
    id: 'citrus',
    src: '/community/arcade/ai-citrus.jpg',
    kind: 'ai',
    credit: 'Generated for ModGuard',
  },
];
