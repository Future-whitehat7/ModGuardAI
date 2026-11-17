import { ShareActions } from '../components/community/ShareActions';
import { CommunityForm } from '../components/community/CommunityForm';
import { partnerTypes, publicLines, sponsorTiers, waitlistInterests } from '../community/public';

export function Community() {
  return (
    <article className="page-wrap community-lean mx-auto w-full max-w-3xl px-4 sm:px-6">
      <p className="eyebrow">Community</p>
      <h1 className="display section-display mt-4 text-ice">{publicLines[0]}</h1>
      <p className="mt-4 text-lg leading-relaxed text-ice">{publicLines[1]}</p>

      <section className="mt-12" aria-labelledby="partner-title">
        <h2 id="partner-title" className="display text-3xl text-ice">Partnership inquiry</h2>
        <p className="mt-3 text-base leading-relaxed text-ice">{publicLines[2]}</p>
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
        <h2 id="waitlist-title" className="display text-3xl text-ice">Waitlist</h2>
        <p className="mt-3 text-base leading-relaxed text-ice">These are plans. Joining the list does not turn a plan on.</p>
        <CommunityForm
          id="waitlist-form"
          formName="community-waitlist"
          title="Join the waitlist"
          lede="We read every one and reply by email."
          fields={[
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'interest', label: 'Interest', type: 'checks', options: [...waitlistInterests] },
            { name: 'app', label: 'Preferred app, optional', options: ['WhatsApp', 'Telegram', 'Either'], required: false },
            { name: 'country', label: 'Country, optional', required: false },
            { name: 'site', label: 'Site, optional', required: false },
            { name: 'languages', label: 'Languages I can help with, optional', type: 'textarea', required: false },
          ]}
        />
      </section>

      <section className="mt-12" aria-labelledby="join-title">
        <h2 id="join-title" className="display text-3xl text-ice">Start in 5 minutes</h2>
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
        <p className="mt-3 text-base leading-relaxed text-ice">{publicLines[3]}</p>
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
          <p className="eyebrow">Example</p>
          <h3>Games are coming soon</h3>
          <p>{publicLines[5]}</p>
          <ShareActions
            headline="Example"
            detail="Games are coming soon"
            lines={['Example', 'Games are coming soon']}
            filename="modguard-example-card.png"
          />
        </article>
      </section>
    </article>
  );
}
