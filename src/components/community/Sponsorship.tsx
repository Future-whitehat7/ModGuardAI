import { Link } from 'react-router-dom';
import { CommunityForm } from './CommunityForm';

const tiers = [
  {
    name: 'Supporter',
    kicker: 'Pricing on request',
    gets: 'Your logo on the community page once a sponsorship is agreed, next to the people doing the work.',
  },
  {
    name: 'Hackathon sponsor',
    kicker: 'Pricing on request',
    gets: 'A named hackathon or a named track in the campus kit, plus the Supporter logo placement.',
  },
  {
    name: 'Founding sponsor',
    kicker: 'Coming soon. Pricing on request. 3 to 5 spots.',
    gets: 'A hosted vibe-code sprint, Red Team Seats, and early access to community members who opt in to be introduced. The Daily slot and badge mention come with it once a sponsorship is agreed.',
  },
];

export function Sponsorship() {
  return (
    <section id="sponsor-community" className="community-block" aria-labelledby="sponsor-community-title">
      <p className="eyebrow">Sponsor the community</p>
      <h2 id="sponsor-community-title" className="display section-display text-ice">Sponsor the people building the check.</h2>
      <p className="community-copy">
        Companies can back Founding Contributors, hackathons and campus kits, and ModGuard Daily. Pricing is on request. Talk to us, and we will reply with a scope.
      </p>
      <ul className="sponsor-tiers">
        {tiers.map((tier) => (
          <li key={tier.name} className={tier.name === 'Founding sponsor' ? 'founding-spot' : undefined}>
            <p className="community-kicker">{tier.kicker}</p>
            <h3>{tier.name === 'Founding sponsor' ? 'Founding Sponsors' : tier.name}</h3>
            <p>{tier.gets}</p>
          </li>
        ))}
      </ul>
      <p className="community-empty">Founding sponsor spot open.</p>
      <p className="community-note">
        Product sponsorship for the site audience lives on the <Link to="/sponsor">sponsors page</Link>. This section is for the community, the nights, and Daily.
      </p>
      <CommunityForm
        id="sponsor-form"
        formName="community-sponsor"
        title="Talk to us"
        lede="We read every one and reply by email."
        fields={[
          { name: 'company', label: 'Company' },
          { name: 'contact', label: 'Contact name' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'tier', label: 'Tier interest', options: tiers.map((tier) => tier.name) },
          { name: 'budget', label: 'Budget range, optional', required: false },
          { name: 'message', label: 'What do you want to back?', type: 'textarea' },
        ]}
      />
    </section>
  );
}
