import { countdown, type CommunityBoard } from '../../community/board';
import { CommunityForm } from './CommunityForm';

const tiers = [
  { name: 'Builder', detail: 'You shipped a small build the room could use.' },
  { name: 'Host', detail: 'You ran the night from the campus kit.' },
  { name: 'First ship', detail: 'Your build is the first one confirmed on the public list.' },
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
        A hackathon here is a night of making something small about AI safety, deepfake detection, privacy, or moderation. Recognition is the point. No cash prize is posted, because there is no prize budget.
      </p>
      {next ? (
        <p className="community-countdown" aria-live="polite">
          <span>{next.left}</span>
          until {next.event.name}
          {next.event.host ? ` · hosted by ${next.event.host}` : ''}
          {next.event.participants !== null ? ` · ${next.event.participants} people listed` : ''}
        </p>
      ) : (
        <p className="community-empty">First hackathon date announced soon. No event is on the board yet, so there is no countdown and no participant count.</p>
      )}
      <div className="community-split">
        <article>
          <h3>How to join</h3>
          <ol>
            <li>Watch this section for a real date.</li>
            <li>When a date is listed, send the join note with your name and what you want to build.</li>
            <li>Bring the build. Two minutes to show it is enough.</li>
          </ol>
        </article>
        <article>
          <h3>How to host</h3>
          <ol>
            <li>Pick one theme: AI safety, deepfakes, privacy, or moderation.</li>
            <li>Run the campus kit. You do not need ModGuard staff in the room.</li>
            <li>Send the results through the campus form so a confirmed build can reach the board.</li>
          </ol>
        </article>
      </div>
      <ul className="community-tiers">
        {tiers.map((tier) => (
          <li key={tier.name}>
            <strong>{tier.name}</strong>
            <span>{tier.detail}</span>
          </li>
        ))}
      </ul>
      <p className="community-note">No one holds these titles yet. A title is written here only after the work is confirmed.</p>
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
        title="Join note"
        lede="Say you want in when a date exists, or that you want to host. This is the same consider-me form. It does not reserve a spot."
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'focus', label: 'Join or host, and the theme you want', type: 'textarea' },
        ]}
      />
    </section>
  );
}
