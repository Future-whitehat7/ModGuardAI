import { ShareActions } from '../components/community/ShareActions';
import { CommunityForm } from '../components/community/CommunityForm';
import { partnerTypes, sectionLines, sponsorTiers } from '../community/public';

export function Community() {
  return (
    <article className="page-wrap community-lean mx-auto w-full max-w-3xl px-4 sm:px-6">
      <p className="eyebrow">Community</p>
      <h1 className="display section-display mt-4 text-ice">The ModGuard community.</h1>
      <p className="mt-4 text-lg leading-relaxed text-ice">{sectionLines.hero}</p>

      <section className="mt-12" aria-labelledby="partner-title">
        <h2 id="partner-title" className="display text-3xl text-ice">Partnership inquiry</h2>
        <p className="mt-3 text-base leading-relaxed text-ice">{sectionLines.partner}</p>
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
            { name: 'region', label: 'Country or region' },
            { name: 'give_back', label: 'We are open to the Give back hiring principle', type: 'checkbox', required: false },
            { name: 'message', label: 'What should we try together?', type: 'textarea' },
          ]}
        />
      </section>

      <section className="mt-12" aria-labelledby="waitlist-title">
        <h2 id="waitlist-title" className="display text-3xl text-ice">Get updates when new tools launch</h2>
        <p className="mt-3 text-base leading-relaxed text-ice">{sectionLines.updates}</p>
        <CommunityForm
          id="waitlist-form"
          formName="community-waitlist"
          title="Get updates when new tools launch"
          lede="We'll email you when something new is ready."
          fields={[
            { name: 'name', label: 'Name' },
            { name: 'email', label: 'Email', type: 'email' },
          ]}
        />
      </section>

      <section className="mt-12" aria-labelledby="join-title">
        <h2 id="join-title" className="display text-3xl text-ice">Start in 5 minutes</h2>
        <p className="mt-3 text-base leading-relaxed text-ice">{sectionLines.join}</p>
        <CommunityForm
          id="join"
          formName="community-join"
          title="Start in 5 minutes"
          lede="We read every one and reply by email."
          fields={[
            { name: 'name', label: 'Name' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'focus', label: 'What do you want to help with?', type: 'textarea' },
          ]}
        />
      </section>

      <section className="mt-12" aria-labelledby="sponsor-title">
        <h2 id="sponsor-title" className="display text-3xl text-ice">Sponsorship tiers</h2>
        <p className="mt-3 text-base leading-relaxed text-ice">{sectionLines.sponsor}</p>
        <ul className="tier-notes">
          {sponsorTiers.map((tier) => (
            <li key={tier.name}>
              <strong>{tier.name}</strong>
              <span>{tier.note}</span>
            </li>
          ))}
        </ul>
        <CommunityForm
          id="sponsor-form"
          formName="community-sponsor"
          title="Ask about a tier"
          lede="Pricing on request. We read every one and reply by email."
          fields={[
            { name: 'company', label: 'Company' },
            { name: 'contact', label: 'Contact name' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'tier', label: 'Tier', options: sponsorTiers.map((tier) => tier.name) },
            { name: 'message', label: 'What do you want to back?', type: 'textarea' },
          ]}
        />
      </section>

      <section className="mt-12" aria-labelledby="card-title">
        <h2 id="card-title" className="display text-3xl text-ice">Share card</h2>
        <article className="example-card">
          <p>{sectionLines.card}</p>
          <ShareActions
            headline="Example card"
            detail="Daily games are coming soon; this is not a real score"
            lines={['Example card', 'Daily games are coming soon', 'This is not a real score']}
            filename="modguard-example-card.png"
          />
        </article>
      </section>
    </article>
  );
}
