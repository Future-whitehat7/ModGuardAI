import { Link } from 'react-router-dom';
import { CommunityForm } from './CommunityForm';

const coming = [
  'Ongoing impersonation and deepfake monitoring of a leader’s likeness and accounts.',
  'A leadership Real or AI readiness session.',
  'A payment-approval checklist for the team that releases money.',
];

export function Readiness() {
  return (
    <section id="readiness" className="community-block" aria-labelledby="readiness-title">
      <p className="eyebrow">For leaders</p>
      <h2 id="readiness-title" className="display section-display text-ice">From one check to a standing watch.</h2>
      <div className="community-split">
        <article>
          <p className="community-kicker">Available now</p>
          <h3>Impersonation Check</h3>
          <p>A one-time check of a person across the public places a copy would show up. $199, paid on the existing page.</p>
          <Link className="btn-accent" to="/impersonation-check">Open Impersonation Check</Link>
        </article>
        <article>
          <p className="community-kicker">Coming soon</p>
          <h3>Executive Deepfake Readiness</h3>
          <p>The next step after the one-time check. No price yet.</p>
          <ul>
            {coming.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <CommunityForm
        id="readiness-form"
        formName="community-readiness"
        title="Ask about Executive Deepfake Readiness"
        lede="We read every one and reply by email. This is a waitlist, not a purchase."
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'company', label: 'Company' },
          { name: 'role', label: 'Role' },
          { name: 'executives', label: 'Number of executives', type: 'text' },
        ]}
      />
    </section>
  );
}
