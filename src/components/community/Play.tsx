import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { emptyHabit, HABIT_KEY, readHabit, setStreaks, type PlayHabit } from '../../community/habits';
import { Protected } from './Protected';
import { RealOrAi } from './RealOrAi';
import { ScamDuel } from './ScamDuel';
import { Squads } from './Squads';

const loop = ['Play daily', 'Spot scams', 'Verified finds feed ModGuard Daily'];

export function Play() {
  const [habit, setHabit] = useState<PlayHabit>(emptyHabit);

  useEffect(() => {
    setHabit(readHabit(window.localStorage.getItem(HABIT_KEY)));
  }, []);

  const save = (next: PlayHabit) => {
    setHabit(next);
    window.localStorage.setItem(HABIT_KEY, JSON.stringify(next));
  };

  return (
    <section id="play" className="community-block" aria-labelledby="play-title">
      <p className="eyebrow">Play</p>
      <h2 id="play-title" className="display section-display text-ice">Three short games. Your score stays here.</h2>
      <p className="community-copy">A find reaches Daily only after ModGuard checks it. Playing does not publish a post.</p>
      <ol className="habit-loop">
        {loop.map((step, index) => (
          <li key={step}>
            <span>{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <Link className="text-accent" to="/daily">Open ModGuard Daily</Link>
      <p className="habit-toggle">
        <button type="button" onClick={() => save(setStreaks(habit, !habit.streaksOn))}>
          {habit.streaksOn ? 'Streaks are on. Turn them off.' : 'Streaks are off. Turn them on.'}
        </button>
        {habit.streaksOn ? ` One freeze is ready: ${habit.freezes}.` : ' Visits are not scored.'}
      </p>
      <div className="play-grid">
        <ScamDuel habit={habit} onHabit={save} />
        <RealOrAi habit={habit} onHabit={save} />
        <Squads />
        <Protected />
      </div>
    </section>
  );
}
