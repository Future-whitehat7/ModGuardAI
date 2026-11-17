import { useState } from 'react';
import { countdown, type CommunityBoard } from '../../community/board';
import { CommunityForm } from './CommunityForm';

const windows = [
  { id: '24h Blitz', name: '24h Blitz', detail: 'Ship one focused tool before the day ends.' },
  { id: '48h Build', name: '48h Build', detail: 'A working product and a two-minute demo.' },
  { id: '72h Moonshot', name: '72h Moonshot', detail: 'A polished product people can actually use.' },
];

const prompts = [
  'A scam text checker a friend can paste a message into.',
  'A deepfake spotter helper that lists what to check in a clip.',
  'An impersonation alert bot for one public handle.',
  'A safety prompt kit an assistant must follow before it says “this is safe.”',
];

const skills = ['New to vibe coding', 'Comfortable', 'Ships often'];

export function Hackathons({ board, now }: { board: CommunityBoard; now: number }) {
  const [window, setWindow] = useState(windows[1].id);
  const next = board.hackathons
    .map((event) => ({ event, left: countdown(event.startsAt, now) }))
    .find((item) => item.left);

  return (
    <section id="sprints" className="community-block" aria-labelledby="sprint-title">
      <p className="eyebrow">Vibe Code Sprints</p>
      <h2 id="sprint-title" className="display section-display text-ice">Idea to shipped, in a weekend.</h2>
      <p className="community-copy">
        If you can vibe code, you can ship. Use any AI coding tool. Pick a window, build something about AI safety, and show it. Top builds can earn Spotted by you credit or a Guardian Card tier. Partner prizes unlock as partners join.
      </p>
      {next ? (
        <p className="community-countdown" aria-live="polite">
          <span>{next.left}</span>
          until {next.event.name}
        </p>
      ) : (
        <p className="community-empty">First sprint drops soon. Get on the list.</p>
      )}
      <div className="sprint-tickets" role="radiogroup" aria-label="Sprint window">
        {windows.map((ticket) => (
          <button
            key={ticket.id}
            type="button"
            role="radio"
            aria-checked={window === ticket.id}
            className={window === ticket.id ? 'on' : ''}
            onClick={() => setWindow(ticket.id)}
          >
            <strong>{ticket.name}</strong>
            <span>{ticket.detail}</span>
          </button>
        ))}
      </div>
      <article className="perk-card">
        <p className="community-kicker">Build prompts</p>
        <ul>
          {prompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
        <p>
          A sponsor can host a sprint. <a href="#sponsor-community">See sponsorship</a>.
        </p>
      </article>
      <CommunityForm
        key={window}
        id="sprint-form"
        formName="community-sprint"
        title="Get on the list"
        lede="We read every one and reply by email. No date is set yet."
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'window', label: 'Preferred window', options: windows.map((item) => item.id), defaultOption: window },
          { name: 'skill', label: 'Skill level', options: skills },
          { name: 'idea', label: 'What would you ship?', type: 'textarea', required: false },
        ]}
      />
    </section>
  );
}
