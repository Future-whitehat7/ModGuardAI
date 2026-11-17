import { Link } from 'react-router-dom';
import { CommunityForm } from './CommunityForm';

const tiers = [
  {
    name: 'Supporter',
    gets: 'Your logo on the community page once a sponsorship is agreed, next to the people doing the work.',
  },
  {
    name: 'Hackathon sponsor',
    gets: 'A named hackathon or a named track in the campus kit, plus the Supporter logo placement.',
  },
  {
    name: 'Founding sponsor',
    gets: 'A labeled Sponsored slot in ModGuard Daily, a mention on recognition badges, and the placements above.',
  },
];

export function Sponsorship() {
  return (
    <section id="sponsor-community" className="community-block" aria-labelledby="sponsor-community-title">
      <p className="eyebrow">F. Sponsor the community</p>
      <h2 id="sponsor-community-title" className="display section-display text-ice">Sponsor the people building the check.</h2>
      <p className="community-copy">
        Companies can back Founding Contributors, hackathons and campus kits, and ModGuard Daily. Pricing is on request. Talk to us, and we will reply with a scope.
      </p>
      <ul className="sponsor-tiers">
        {tiers.map((tier) => (
          <li key={tier.name}>
            <p className="community-kicker">Pricing on request</p>
            <h3>{tier.name}</h3>
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
