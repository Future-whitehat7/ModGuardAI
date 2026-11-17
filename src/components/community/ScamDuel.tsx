import { useEffect, useState } from 'react';
import { markDuel, skipDuel, type PlayHabit } from '../../community/habits';
import { pairForDay, votePercent, type DuelPair } from '../../community/play';
import { Burst } from './Burst';
import { ShareActions } from './ShareActions';

const SECONDS = 10;

function layout(day: string, pair: DuelPair) {
  const scamLeft = Number(day.slice(-2)) % 2 === 0;
  return {
    left: scamLeft ? pair.scam : pair.legit,
    right: scamLeft ? pair.legit : pair.scam,
    scamSide: scamLeft ? 'left' as const : 'right' as const,
  };
}

export function ScamDuel({
  habit,
  onHabit,
}: {
  habit: PlayHabit;
  onHabit: (next: PlayHabit) => void;
}) {
  const day = new Date().toISOString().slice(0, 10);
  const pair = pairForDay(day);
  const sides = layout(day, pair);
  const open = habit.duelDay !== day;
  const [left, setLeft] = useState(SECONDS);
  const [pick, setPick] = useState('');
  const [note, setNote] = useState('');
  const [community, setCommunity] = useState<number | null>(null);

  useEffect(() => {
    if (!open || pick) return undefined;
    const timer = window.setInterval(() => {
      setLeft((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [open, pick]);

  useEffect(() => {
    if (left === 0 && open && !pick) {
      setPick('timeout');
      onHabit(skipDuel(habit, day));
    }
  }, [left, open, pick, habit, day, onHabit]);

  const reveal = pick !== '';
  const right = pick === sides.scamSide;
  const turn = 2 * Math.PI * 18;

  const choose = (side: 'left' | 'right') => {
    if (!open || pick) return;
    setPick(side);
    const correct = side === sides.scamSide;
    const next = markDuel(habit, day, correct);
    onHabit(next.habit);
    setNote(next.usedFreeze ? 'A freeze covered the day in between.' : '');
    void fetch(`/api/scam-vote?pair=${pair.id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ scam: correct }),
    })
      .then((response) => response.json())
      .then((data: { total?: number | null; scam?: number }) => {
        setCommunity(votePercent(data.total ?? null, data.scam ?? 0));
      })
      .catch(() => setCommunity(null));
  };

  return (
    <article className="play-card" id="scam-duel">
      <p className="community-kicker">Scam of the day</p>
      <h3>Which text is the scam?</h3>
      <p>Content note: an example text, not a real person’s message. Nothing graphic. You can skip it.</p>
      {open ? (
        <>
          <div className="duel-ring" aria-live="polite">
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="18" />
              <circle cx="24" cy="24" r="18" strokeDasharray={`${turn * (left / SECONDS)} ${turn}`} />
            </svg>
            <span>{reveal ? 'Round closed' : `${left}s`}</span>
          </div>
          <Burst active={reveal && right} />
          <div className="duel-pair">
            {(['left', 'right'] as const).map((side) => (
              <button
                key={side}
                type="button"
                className={reveal && side === sides.scamSide ? 'is-correct' : reveal && side === pick ? 'is-wrong' : undefined}
                disabled={reveal}
                onClick={() => choose(side)}
              >
                {side === 'left' ? sides.left : sides.right}
              </button>
            ))}
          </div>
          <button type="button" className="skip-round" onClick={() => { setPick('skip'); onHabit(skipDuel(habit, day)); }}>
            Skip this round
          </button>
        </>
      ) : (
        <p>Today’s duel is done. The next pair arrives with the next day.</p>
      )}
      {reveal && pick !== 'skip' ? (
        <>
          <p role="status">
            {pick === 'timeout' ? 'The clock finished. ' : right ? 'That was the scam. ' : 'The other one was the scam. '}
            {pair.flags}
          </p>
          <ShareActions
            headline={right ? 'I spotted it' : 'I practiced today’s scam'}
            detail="Scam of the Day, on this browser"
            lines={[right ? 'I spotted it' : 'I practiced it', 'Scam of the Day', day]}
            filename="modguard-i-spotted-it.png"
          />
        </>
      ) : null}
      {habit.streaksOn && habit.streak > 0 ? <p>Skill streak: {habit.streak}. It counts correct finds, not visits.</p> : null}
      {note ? <p>{note}</p> : null}
      <p className="badge-fine">
        {community === null
          ? 'Community results reveal once votes come in.'
          : `${community}% of recorded votes picked the scam.`}
      </p>
    </article>
  );
}
