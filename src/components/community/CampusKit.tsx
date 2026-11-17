import { useEffect, useState } from 'react';
import { chapterRegions, readChapters, type Chapter } from '../../community/chapters';
import { CommunityForm } from './CommunityForm';

const pieces = [
  { name: 'Run of show', detail: 'Ninety minutes, timed, with a turn for every team.' },
  { name: 'Themes', detail: 'AI safety, deepfake detection, privacy, and content moderation.' },
  { name: 'Judging rubric', detail: 'Honest, useful, specific, kind. Scores are 0, 1, or 2.' },
  { name: 'Game prompts', detail: 'Labeled examples a team can play in the room.' },
  { name: 'Host checklist', detail: 'What to say at the start, and how to send one result back.' },
];

export function CampusKit() {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/community/chapters.json');
        if (!response.ok) return;
        setChapters(readChapters(await response.json()));
      } catch {
        setChapters([]);
      }
    };
    void load();
  }, []);

  return (
    <section id="campus" className="community-block" aria-labelledby="campus-title">
      <p className="eyebrow">Start a chapter</p>
      <h2 id="campus-title" className="display section-display text-ice">Your club can run the night.</h2>
      <p className="community-copy">
        A chapter is self-run. It uses this campus kit and a Guardian Squad. The kit has the run of show, the themes, the rubric, and the game prompts.
      </p>
      <ul className="region-chips">
        {chapterRegions.map((region) => (
          <li key={region}>{region}</li>
        ))}
      </ul>
      {chapters.length === 0 ? (
        <p className="community-empty">First chapters forming - start yours.</p>
      ) : (
        <ul className="community-board">
          {chapters.map((chapter) => (
            <li key={`${chapter.school}-${chapter.country}`}>
              <strong>{chapter.school}</strong>
              <small>{chapter.country}</small>
            </li>
          ))}
        </ul>
      )}
      <CommunityForm
        id="chapter-form"
        formName="community-chapter"
        title="Start a chapter"
        lede="We read every one and reply by email. A chapter appears here only after it is confirmed."
        fields={[
          { name: 'school', label: 'School' },
          { name: 'country', label: 'Country' },
          { name: 'contact', label: 'Contact name and email' },
        ]}
      />
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
