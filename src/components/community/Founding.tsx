import type { CommunityBoard } from '../../community/board';
import type { Progress } from '../../community/progress';
import { CommunityForm } from './CommunityForm';

export function Founding({ board, progress }: { board: CommunityBoard; progress: Progress }) {
  return (
    <section id="founding" className="community-block" aria-labelledby="founding-title">
      <p className="eyebrow">A. Founding Contributor</p>
      <h2 id="founding-title" className="display section-display text-ice">Show up before there is a budget.</h2>
      <p className="community-copy">
        Samuel Fagbamigbe started ModGuard so a person can check a message, a voice, or a copied account before it takes their money or their name. There is no payroll for this work. That is the opening. The people who show up now decide what gets built while it is still small.
      </p>
      <div className="community-split">
        <article>
          <h3>What you do</h3>
          <p>Label a sample, write a safety prompt, test a moderation case, host a campus night, or ship a small build. The first one takes a few minutes and lives on this page.</p>
        </article>
        <article>
          <h3>What you get</h3>
          <p>The public title Founding Contributor when your name is added here, credit next to the work, a say in what ships next, the campus kit, and a record you can point to. No salary. No equity. No job offer.</p>
        </article>
      </div>
      <div className="community-meters" aria-label="Public counts from the board file">
        <p><strong>{board.contributors.length}</strong> names on the public list</p>
        <p><strong>{board.shipped.length}</strong> shipped pieces with a name</p>
        <p><strong>{progress.tasks.length}</strong> doorway tasks on this browser</p>
        <p><strong>{progress.streak}</strong> day streak on this browser</p>
      </div>
      {board.contributors.length === 0 ? (
        <p className="community-empty">Be the first name on the board. A name is added only after you ask and we confirm it.</p>
      ) : (
        <ol className="community-board">
          {board.contributors.map((person) => (
            <li key={`${person.name}-${person.handle}`}>
              <strong>{person.name}</strong>
              {person.handle ? <span> @{person.handle}</span> : null}
              {person.focus ? <small>{person.focus}</small> : null}
            </li>
          ))}
        </ol>
      )}
      {board.shipped.length === 0 ? (
        <p className="community-empty">No shipped work is listed yet. The first real ship gets the first mark.</p>
      ) : (
        <ul className="community-board">
          {board.shipped.map((item) => (
            <li key={item.title}>
              {item.url ? <a href={item.url}>{item.title}</a> : item.title}
              <small>{item.by}</small>
            </li>
          ))}
        </ul>
      )}
      <CommunityForm
        id="join"
        formName="community-join"
        title="Ask to be considered"
        lede="Sending this does not list your name and does not pay you. We reply by email if it arrives."
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'handle', label: 'Handle, if you want it public', required: false },
          { name: 'focus', label: 'What do you want to help build?', type: 'textarea' },
        ]}
      />
    </section>
  );
}
