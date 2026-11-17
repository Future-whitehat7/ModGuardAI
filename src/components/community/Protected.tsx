import { useEffect, useState } from 'react';
import { ShareActions } from './ShareActions';

const KEY = 'modguard-protected-note';

export function Protected() {
  const [day, setDay] = useState('');

  useEffect(() => {
    setDay(window.localStorage.getItem(KEY) ?? '');
  }, []);

  const save = () => {
    const today = new Date().toISOString().slice(0, 10);
    window.localStorage.setItem(KEY, today);
    setDay(today);
  };

  return (
    <article className="play-card" id="protected">
      <p className="community-kicker">A moment, not a score</p>
      <h3>I protected someone</h3>
      <p>Self-reported. Saved on this browser only. It is not a public count.</p>
      {day ? (
        <ShareActions
          headline="I protected someone"
          detail={`Noted on ${day}. Not a public count`}
          lines={['I protected someone', day, 'On this browser only']}
          filename="modguard-protected.png"
        />
      ) : (
        <button type="button" className="btn-accent" onClick={save}>Save this moment</button>
      )}
    </article>
  );
}
