import { partnerTypes } from '../../community/partners';
import { anchorRegions, otherGulf, regionChoices } from '../../community/regions';
import { CommunityForm } from './CommunityForm';

const kinds = [
  {
    name: 'Platform and trust',
    bring: 'A product surface where a scam check or an impersonation check can sit.',
    get: 'A scoped pilot of ScamCheck or Impersonation Check, written down before anything launches.',
  },
  {
    name: 'Research and data',
    bring: 'A moderation or deepfake question, or a dataset you already have the rights to share.',
    get: 'A shared evaluation plan. Results are published only when both sides agree.',
  },
  {
    name: 'Education and campus',
    bring: 'A university, a club, or a bootcamp that wants to run the night.',
    get: 'The campus kit, and a named track once the partnership is agreed.',
  },
  {
    name: 'Distribution',
    bring: 'An audience that already trusts you.',
    get: 'A labeled co-mention when a placement is agreed. The label stays visible.',
  },
];

const steps = [
  { name: 'Intro call', detail: 'We hear what you want to do together.' },
  { name: 'Pilot scope', detail: 'We write the slice that is small enough to try.' },
  { name: 'Launch', detail: 'We ship that slice, with both names on it.' },
];

export function Partnerships() {
  return (
    <section id="partnerships" className="community-block" aria-labelledby="partner-title">
      <p className="eyebrow">Partner with ModGuard</p>
      <h2 id="partner-title" className="display section-display text-ice">A global community. Your country included.</h2>
      <p className="community-copy">
        We grow by opening access. The whole world can contribute. This is a search for partners, not a map of offices, and not a government endorsement.
      </p>
      <div className="global-band">
        <p className="community-kicker">First anchor partner regions we&apos;re seeking</p>
        <ul className="region-row">
          {anchorRegions.map((chip) => (
            <li key={chip} className="featured">{chip}</li>
          ))}
          {otherGulf.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
          <li>Your country</li>
          <li>Anywhere</li>
        </ul>
      </div>
      <ul className="sponsor-tiers">
        {kinds.map((kind) => (
          <li key={kind.name}>
            <h3>{kind.name}</h3>
            <p><strong>You bring </strong>{kind.bring}</p>
            <p><strong>You get </strong>{kind.get}</p>
          </li>
        ))}
      </ul>
      <ol className="path-steps partner-steps">
        {steps.map((step, index) => (
          <li key={step.name}>
            <span>{index + 1}. {step.name}</span>
            {step.detail}
          </li>
        ))}
      </ol>
      <article className="give-back">
        <p className="community-kicker">Give back</p>
        <h3>Every ModGuard partner commits to this, in spirit.</h3>
        <p>
          Hire at least 1 to 2 percent of relevant roles from early-career community members, and bring rewards the community can actually feel: experiences, recognition, access, and status. The community is largely Gen Z and millennial builders. Age is not a hiring rule. The aim is to put the next generation on the frontier of AI. This is a principle, not a contract. No partner has committed yet.
        </p>
      </article>
      <CommunityForm
        id="partner-form"
        formName="community-partner"
        title="Start a partnership"
        lede="We read every one and reply by email."
        fields={[
          { name: 'organization', label: 'Organization' },
          { name: 'contact', label: 'Contact name' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'partnership', label: 'Partnership type', options: [...partnerTypes] },
          { name: 'region', label: 'Region', options: [...regionChoices] },
          { name: 'give_back', label: 'We are open to the Give back hiring principle', type: 'checkbox', required: false },
          {
            name: 'rewards',
            label: 'Rewards we can offer',
            type: 'checks',
            options: ['Mentorship', 'Red-team seats', 'Early access', 'Event invites', 'Other'],
          },
          { name: 'message', label: 'What should we try together?', type: 'textarea' },
        ]}
      />
    </section>
  );
}
