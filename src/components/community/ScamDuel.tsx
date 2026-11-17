import { useEffect, useState } from 'react';
import { pairForDay, votePercent, type DuelPair } from '../../community/play';

const DUEL_KEY = 'modguard-duel-streak';
const SECONDS = 10;

function layout(day: string, pair: DuelPair) {
  const scamLeft = Number(day.slice(-2)) % 2 === 0;
  return {
    left: scamLeft ? pair.scam : pair.legit,
    right: scamLeft ? pair.legit : pair.scam,
    scamSide: scamLeft ? 'left' as const : 'right' as const,
  };
}

export function ScamDuel() {
  const day = new Date().toISOString().slice(0, 10);
  const pair = pairForDay(day);
  const sides = layout(day, pair);
  const [left, setLeft] = useState(SECONDS);
  const [pick, setPick] = useState('');
  const [streak, setStreak] = useState(0);
  const [community, setCommunity] = useState<number | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(DUEL_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { streak?: number };
        if (typeof parsed.streak === 'number') setStreak(parsed.streak);
      } catch {
        setStreak(0);
      }
    }
  }, []);

  useEffect(() => {
    if (pick) return undefined;
    const timer = window.setInterval(() => {
      setLeft((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [pick]);

  useEffect(() => {
    if (left === 0 && !pick) setPick('timeout');
  }, [left, pick]);

  const reveal = pick !== '';
  const right = pick === sides.scamSide;

  const choose = (side: 'left' | 'right') => {
    if (pick) return;
    setPick(side);
    if (side === sides.scamSide) {
      const stored = { streak: streak > 0 ? streak + 1 : 1, day };
      window.localStorage.setItem(DUEL_KEY, JSON.stringify(stored));
      setStreak(stored.streak);
    }
    void fetch(`/api/scam-vote?pair=${pair.id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ scam: side === sides.scamSide }),
    })
      .then((response) => response.json())
      .then((data: { total?: number | null; scam?: number }) => {
        setCommunity(votePercent(data.total ?? null, data.scam ?? 0));
      })
      .catch(() => setCommunity(null));
  };

  const turn = 2 * Math.PI * 18;
  const filled = left / SECONDS;

  return (
    <article className="play-card" id="scam-duel">
      <p className="community-kicker">Scam of the day</p>
      <h3>Which text is the scam?</h3>
      <p>Representative examples. Not a real person’s message. {day}</p>
      <div className="duel-ring" aria-live="polite">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="18" />
          <circle cx="24" cy="24" r="18" strokeDasharray={`${turn * filled} ${turn}`} />
        </svg>
        <span>{reveal ? 'Time' : `${left}s`}</span>
      </div>
      <div className="duel-pair">
        <button type="button" disabled={reveal} onClick={() => choose('left')}>{sides.left}</button>
        <button type="button" disabled={reveal} onClick={() => choose('right')}>{sides.right}</button>
      </div>
      {reveal ? (
        <p role="status">
          {pick === 'timeout' ? 'Time. ' : right ? 'You found it. ' : 'Not that one. '}
          {pair.flags}
          {streak > 0 ? ` Streak on this browser: ${streak}.` : ''}
        </p>
      ) : null}
      <p className="badge-fine">
        {community === null
          ? 'Community results reveal once votes come in.'
          : `${community}% of recorded votes picked the scam.`}
      </p>
    </article>
  );
}
