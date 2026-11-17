import type { CommunityBoard } from '../../community/board';

export function Founding({ board }: { board: CommunityBoard }) {
  return (
    <section id="founding" className="community-block" aria-labelledby="founding-title">
      <p className="eyebrow">A. Founding Contributor</p>
      <h2 id="founding-title" className="display section-display text-ice">Be here before it&apos;s big.</h2>
      <p className="community-lede">Founding Contributors shape what ships.</p>
      <p className="community-copy">
        Samuel Fagbamigbe started ModGuard so people can check a message, a voice, or a copied account before it takes their money, their privacy, or their name. The people in this room decide what the check becomes while it is still early.
      </p>
      <div className="community-split">
        <article>
          <h3>What you do</h3>
          <p>Label a sample, write a safety prompt, test a moderation case, host a campus night, or ship a small build. The first one takes a few minutes, right here.</p>
        </article>
        <article>
          <h3>What you get</h3>
          <p>A real title, public credit next to the work, a say in what ships, the campus kit, and a path that grows as the community does.</p>
          <p className="honest-line">The honest part: no salary or equity yet. What you get is real: the title when your name is added, the credit, and a voice in the next ship.</p>
        </article>
      </div>
      {board.contributors.length === 0 && board.shipped.length === 0 ? (
        <p className="community-empty">The board opens with its first name. Could be yours.</p>
      ) : (
        <>
          {board.contributors.length > 0 ? (
            <ol className="community-board">
              {board.contributors.map((person) => (
                <li key={`${person.name}-${person.handle}`}>
                  <strong>{person.name}</strong>
                  {person.handle ? <span> @{person.handle}</span> : null}
                  {person.focus ? <small>{person.focus}</small> : null}
                </li>
              ))}
            </ol>
          ) : null}
          {board.shipped.length > 0 ? (
            <ul className="community-board">
              {board.shipped.map((item) => (
                <li key={item.title}>
                  {item.url ? <a href={item.url}>{item.title}</a> : item.title}
                  <small>{item.by}</small>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </section>
  );
}
