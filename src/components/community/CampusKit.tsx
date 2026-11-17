import { CommunityForm } from './CommunityForm';

const pieces = [
  { name: 'Run of show', detail: 'Ninety minutes, with times, and no promise of money or a job.' },
  { name: 'Themes', detail: 'AI safety, deepfake detection, privacy, and content moderation.' },
  { name: 'Judging rubric', detail: 'Honest, useful, specific, kind. Scores are 0, 1, or 2.' },
  { name: 'Game prompts', detail: 'Labeled examples a team can play in the room.' },
  { name: 'Host checklist', detail: 'What to say at the start, and how to send one result back.' },
];

export function CampusKit() {
  return (
    <section id="campus" className="community-block" aria-labelledby="campus-title">
      <p className="eyebrow">E. Run it on your campus</p>
      <h2 id="campus-title" className="display section-display text-ice">A club can run the night alone.</h2>
      <p className="community-copy">
        No ModGuard staff have to be in the room. The kit is a file. The results come back through the form. A name reaches the public board only after the person asks and we confirm the work.
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
        lede="School, club, and what you built. This does not list a name by itself."
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
