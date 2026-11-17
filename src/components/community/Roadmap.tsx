import { CommunityForm } from './CommunityForm';

const cards = [
  {
    tag: 'Coming soon',
    name: 'Scam check for banks and carriers',
    detail: 'A license to run ModGuard’s scam and impersonation check inside a bank app, a carrier app, or call screening. Priced per check. No rate is set.',
  },
  {
    tag: 'Planned',
    name: 'Forward it to ModGuard',
    detail: 'Forward a suspicious message on WhatsApp or Telegram and get a verdict.',
  },
  {
    tag: 'Coming soon',
    name: 'Free scam-check button',
    detail: 'A drop-in button for a creator site, a link-in-bio, or a moderation dashboard. A free version first, a business version later.',
  },
  {
    tag: 'Planned',
    name: 'Member-built multilingual scam library',
    detail: 'Members translate and label scams in Hindi, Yoruba, Spanish, Portuguese, Tagalog, Arabic, and more.',
  },
];

export function Roadmap() {
  return (
    <section id="next" className="community-block" aria-labelledby="next-title">
      <p className="eyebrow">What we&apos;re building next</p>
      <h2 id="next-title" className="display section-display text-ice">The next doors, still on the drawing board.</h2>
      <ul className="perk-grid">
        {cards.map((card) => (
          <li key={card.name} className="perk-card">
            <p className="community-kicker">{card.tag}</p>
            <h3>{card.name}</h3>
            <p>{card.detail}</p>
          </li>
        ))}
      </ul>
      <p>
        <a className="btn-accent" href="#partner-form">Ask about a bank, carrier, or platform integration</a>
      </p>
      <CommunityForm
        id="waitlist-form"
        formName="community-waitlist"
        title="Join the waitlist"
        lede="We read every one and reply by email."
        fields={[
          { name: 'email', label: 'Email', type: 'email' },
          {
            name: 'interest',
            label: 'Interest',
            type: 'checks',
            options: ['Forward on WhatsApp or Telegram', 'Free scam-check button', 'Multilingual scam library'],
          },
          { name: 'app', label: 'Preferred app, optional', options: ['WhatsApp', 'Telegram', 'Either'], required: false },
          { name: 'country', label: 'Country, optional', required: false },
          { name: 'site', label: 'Site or link-in-bio, optional', required: false },
          { name: 'languages', label: 'Languages I can help with, optional', type: 'textarea', required: false },
        ]}
      />
    </section>
  );
}
