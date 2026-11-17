import { useEffect, useState } from 'react';
import { readHires, type GiveBackHire } from '../../community/hires';

const steps = [
  { name: 'Contribute', detail: 'A doorway task, a build, or a campus night that you actually did.' },
  { name: 'Guardian Card tiers', detail: 'Scout, Spotter, Analyst, Guardian, then Founding Contributor. A tier follows the work, and the higher ones stay locked until that work exists.' },
  { name: 'Reference letter', detail: 'A letter that names the work on your record. A title alone is not the letter.' },
  { name: 'Give back hiring', detail: 'Partners are asked to open 1 to 2 percent of relevant roles to early-career members. Age is not the rule. No partner has committed yet.' },
];

const rules = [
  'ModGuard decides a reward after looking at work that shipped.',
  'A reward is named when the work ships. There is no scheduled drop.',
  'A reference letter cites the contribution, not a login.',
  'Partner perks open only when a partner brings them.',
];

export function Career() {
  const [hires, setHires] = useState<GiveBackHire[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/community/hires.json');
        if (!response.ok) return;
        setHires(readHires(await response.json()));
      } catch {
        setHires([]);
      }
    };
    void load();
  }, []);

  return (
    <section id="career" className="community-block" aria-labelledby="career-title">
      <p className="eyebrow">Career path</p>
      <h2 id="career-title" className="display section-display text-ice">The work can become a next step.</h2>
      <p className="community-copy">Access, a record of what you shipped, and a door a partner can open. Nothing here is a job offer.</p>
      <ol className="path-steps">
        {steps.map((step, index) => (
          <li key={step.name}>
            <span>{index + 1}. {step.name}</span>
            {step.detail}
          </li>
        ))}
      </ol>
      <article className="give-back">
        <p className="community-kicker">How rewards are earned</p>
        <ul>
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </article>
      <h3>Hires through Give back</h3>
      {hires.length === 0 ? (
        <p className="community-empty">No hire is listed yet. A name appears here only after a partner makes a real hire.</p>
      ) : (
        <ul className="community-board">
          {hires.map((hire) => (
            <li key={`${hire.name}-${hire.role}`}>
              <strong>{hire.name}</strong>
              <small>{hire.role} {hire.partner}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
