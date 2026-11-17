import { useState } from 'react';
import { arcadeRemaining, markArcade, type PlayHabit } from '../../community/habits';
import { arcadeCards } from '../../community/play';
import { ShareActions } from './ShareActions';

export function RealOrAi({
  habit,
  onHabit,
}: {
  habit: PlayHabit;
  onHabit: (next: PlayHabit) => void;
}) {
  const day = new Date().toISOString().slice(0, 10);
  const remaining = arcadeRemaining(habit, day);
  const [skipped, setSkipped] = useState(0);
  const [note, setNote] = useState('');
  const played = habit.arcadeDay === day ? habit.arcadePlayed : 0;
  const index = played + skipped;
  const card = arcadeCards[index];
  const finished = remaining === 0 || index >= arcadeCards.length;

  const guess = (kind: 'real' | 'ai') => {
    if (!card || finished) return;
    const hit = kind === card.kind;
    onHabit(markArcade(habit, day, hit));
    setNote(hit ? `Yes. ${card.credit}` : `The other label. ${card.credit}`);
  };

  const correct = habit.arcadeDay === day ? habit.arcadeCorrect : 0;

  return (
    <article className="play-card" id="real-or-ai">
      <p className="community-kicker">Real or AI?</p>
      <h3>Tap the picture. Keep the skill score.</h3>
      <p>Content note: still photos of Earth, the Moon, and generated objects. Nothing graphic. Audio round coming soon. Daily cap: {arcadeCards.length} cards.</p>
      {card && !finished ? (
        <figure>
          <img src={card.src} alt="" />
          <div className="duel-pair">
            <button type="button" onClick={() => guess('real')}>Real</button>
            <button type="button" onClick={() => guess('ai')}>AI-made</button>
          </div>
          <button type="button" className="skip-round" onClick={() => { setSkipped((value) => value + 1); setNote('Skipped. It does not count.'); }}>
            Skip this card
          </button>
        </figure>
      ) : (
        <div className="badge-card" id="arcade-score">
          <p className="eyebrow">Your score</p>
          <h3>{correct} of {played}</h3>
          <p>Today’s round is done. The score is the skill, not a visit.</p>
          <ShareActions
            headline="I spotted it"
            detail={`${correct} of ${played} on Real or AI, on this browser`}
            lines={['Real or AI', `${correct} of ${played}`, 'On this browser']}
            filename="modguard-real-or-ai.png"
          />
        </div>
      )}
      {note ? <p role="status">{note}</p> : null}
      <p className="badge-fine">On this browser. There is no global leaderboard.</p>
    </article>
  );
}
