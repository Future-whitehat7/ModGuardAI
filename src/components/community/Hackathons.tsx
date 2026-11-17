import { countdown, type CommunityBoard } from '../../community/board';
import { CommunityForm } from './CommunityForm';

const tiers = [
  { name: 'Builder', mark: 'B', detail: 'A small build the room can use.' },
  { name: 'Host', mark: 'H', detail: 'You ran the night from the kit.' },
  { name: 'First ship', mark: '1', detail: 'The first confirmed build on the board.' },
];

export function Hackathons({ board, now }: { board: CommunityBoard; now: number }) {
  const next = board.hackathons
    .map((event) => ({ event, left: countdown(event.startsAt, now) }))
    .find((item) => item.left);

  return (
    <section id="hackathons" className="community-block" aria-labelledby="hack-title">
      <p className="eyebrow">B. Hackathons and games</p>
      <h2 id="hack-title" className="display section-display text-ice">Build the game that catches the trick.</h2>
      <p className="community-copy">
        Make something people can play about AI safety, deepfakes, privacy, or moderation. Join when a date is up, or host the night yourself. Recognition is the win: a title, a show-and-tell, and a confirmed build on the board.
      </p>
      {next ? (
        <p className="community-countdown" aria-live="polite">
          <span>{next.left}</span>
          until {next.event.name}
          {next.event.host ? ` · ${next.event.host}` : ''}
          {next.event.participants !== null ? ` · ${next.event.participants} people listed` : ''}
        </p>
      ) : (
        <p className="community-empty">First event date drops soon. Get the ping.</p>
      )}
      <div className="community-split">
        <article>
          <h3>How to join</h3>
          <ol>
            <li>Leave your name for the ping.</li>
            <li>When a date is on the board, show up with a build.</li>
            <li>Two minutes to show it.</li>
          </ol>
        </article>
        <article>
          <h3>How to host</h3>
          <ol>
            <li>Pick a theme: AI safety, deepfakes, privacy, or moderation.</li>
            <li>Run the campus kit with your club.</li>
            <li>Send the results back so a confirmed build can reach the board.</li>
          </ol>
        </article>
      </div>
      <ul className="recognition-tiles">
        {tiers.map((tier) => (
          <li key={tier.name}>
            <span aria-hidden="true">{tier.mark}</span>
            <strong>{tier.name}</strong>
            <small>{tier.detail}</small>
          </li>
        ))}
      </ul>
      {board.hackathons.length > 0 ? (
        <ul className="community-board">
          {board.hackathons.map((event) => (
            <li key={event.name}>
              <strong>{event.name}</strong>
              {event.startsAt ? <small>{event.startsAt}</small> : null}
            </li>
          ))}
        </ul>
      ) : null}
      <CommunityForm
        id="hack-join"
        formName="community-join"
        title="Get the ping"
        lede="We read every one and reply by email."
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'focus', label: 'Join or host, and the theme you want', type: 'textarea' },
        ]}
      />
    </section>
  );
}
