import { CommunityForm } from './CommunityForm';

const pieces = [
  { name: 'Run of show', detail: 'Ninety minutes, timed, with a turn for every team.' },
  { name: 'Themes', detail: 'AI safety, deepfake detection, privacy, and content moderation.' },
  { name: 'Judging rubric', detail: 'Honest, useful, specific, kind. Scores are 0, 1, or 2.' },
  { name: 'Game prompts', detail: 'Labeled examples a team can play in the room.' },
  { name: 'Host checklist', detail: 'What to say at the start, and how to send one result back.' },
];

export function CampusKit() {
  return (
    <section id="campus" className="community-block" aria-labelledby="campus-title">
      <p className="eyebrow">E. Run it on your campus</p>
      <h2 id="campus-title" className="display section-display text-ice">Your club can run the night.</h2>
      <p className="community-copy">
        The kit has the run of show, the themes, the rubric, and the game prompts. Send the night back through the form, and a confirmed build can open a name on the board.
      </p>
      <ul className="community-tiers">
        {pieces.map((piece) => (
          <li key={piece.name}>
            <strong>{piece.name}</strong>
            <span>{piece.detail}</span>
          </li>
        ))}
      </ul>
      <p>
        <a className="btn-accent" href="/community/campus-kit.md" download>
          Download the campus kit
        </a>
      </p>
      <CommunityForm
        id="campus-form"
        formName="campus-kit"
        title="Send the night back"
        lede="We read every one and reply by email."
        fields={[
          { name: 'name', label: 'Your name' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'school', label: 'School' },
          { name: 'club', label: 'Club' },
          { name: 'build', label: 'What the room built', type: 'textarea' },
        ]}
      />
    </section>
  );
}
