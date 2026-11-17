import { CommunityForm } from './CommunityForm';

const cards = [
  {
    tag: 'Coming soon',
    name: 'Scam check for banks and carriers',
    detail: 'A license to run ModGuard’s scam and impersonation check inside a bank app, a carrier app, or call screening. Priced per check. No rate is set, and it is not in anyone’s app yet.',
  },
  {
    tag: 'Planned',
    name: 'Forward it to ModGuard',
    detail: 'Forward a suspicious message on WhatsApp or Telegram and get a verdict. This does not take messages yet.',
  },
  {
    tag: 'Coming soon',
    name: 'Free scam-check button',
    detail: 'A drop-in button for a creator site, a link-in-bio, or a moderation dashboard. A free version first, a business version later. The button is not on sites yet.',
  },
  {
    tag: 'Planned',
    name: 'Member-built multilingual scam library',
    detail: 'Members translate and label scams in Hindi, Yoruba, Spanish, Portuguese, Tagalog, Arabic, and more. The library is not published yet.',
  },
];

export function Roadmap() {
  return (
    <section id="next" className="community-block" aria-labelledby="next-title">
      <p className="eyebrow">What we&apos;re building next</p>
      <h2 id="next-title" className="display section-display text-ice">The next doors, still on the drawing board.</h2>
      <p className="community-copy">Each card is a plan. None of these products are live.</p>
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
        id="forward-form"
        formName="community-forward"
        title="WhatsApp and Telegram waitlist"
        lede="Planned. We read every one and reply by email. This does not forward a message."
        fields={[
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'app', label: 'Preferred app', options: ['WhatsApp', 'Telegram'] },
          { name: 'country', label: 'Country' },
        ]}
      />
      <CommunityForm
        id="widget-form"
        formName="community-widget"
        title="Scam-check button waitlist"
        lede="Coming soon. We read every one and reply by email."
        fields={[
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'site', label: 'Site or link-in-bio, optional', required: false },
        ]}
      />
      <CommunityForm
        id="library-form"
        formName="community-library"
        title="Languages I can help with"
        lede="The library is not published yet. This only records how you can help."
        fields={[
          { name: 'name', label: 'Name' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'languages', label: 'Languages I can help with', type: 'textarea' },
        ]}
      />
    </section>
  );
}
