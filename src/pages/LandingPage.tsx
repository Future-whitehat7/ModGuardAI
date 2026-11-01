import { Link } from 'react-router-dom';
import { brandImages } from '../components/marketing/brandImages';
import { ImageSlot } from '../components/marketing/ImageSlot';
import { SponsorSlot } from '../components/marketing/SponsorSlot';

const fbi = 'https://www.fbi.gov/news/press-releases/cryptocurrency-and-ai-scams-bilk-americans-of-billions';
const ftc = 'https://www.ftc.gov/news-events/news/press-releases/2026/10/ftc-issues-annual-report-congress-agencys-actions-protect-older-adults';

const stats = [
  { value: 'Nearly $21B', label: '2025 IC3 reported losses', href: fbi, source: 'FBI, 6 April 2026' },
  { value: 'About $3B', label: '2025 fraud losses reported by adults 60 and over', href: ftc, source: 'FTC, 19 October 2026' },
  { value: '22,364', label: '2025 AI-related IC3 complaints', href: fbi, source: 'FBI, 6 April 2026' },
];

const checks = [
  ['Messages', 'A text, email, or DM that is pushing you to pay or to click.'],
  ['Statements', 'A call or a transcript that sounds like someone you know.'],
  ['Fake accounts', 'A profile using a real person’s name, face, or handle.'],
];

const audiences = [
  { title: 'People', copy: 'Check the message before the transfer leaves the account.', image: brandImages.whoPeople },
  { title: 'Creators', copy: 'A copy of the account can ask the audience for money.', image: brandImages.whoCreators },
  { title: 'Brands', copy: 'A labeled placement sits next to people who are already checking.', image: brandImages.whoBrands },
];

export const LandingPage = () => {
  return (
    <div>
      <section className="hero mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="measure">
          <h1 className="fade-up display text-5xl leading-[0.95] text-ice sm:text-7xl">
            Check it before you trust it.
          </h1>
          <p className="fade-up mt-6 text-xl leading-relaxed text-frost">
            One place for the message, the statement, and the account that is not yours.
          </p>
          <Link className="btn-accent mt-8" to="/scamcheck">
            Open the tools
          </Link>
        </div>
        <ImageSlot image={brandImages.hero} priority />
        <ul className="stat-row">
          {stats.map((stat) => (
            <li key={stat.value}>
              <a href={stat.href}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
                <span className="stat-source">{stat.source}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="page-section">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">What we check</p>
          <h2 className="display mt-4 text-4xl text-ice">Three things, before you act.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {checks.map(([title, copy]) => (
              <article key={title} className="glass p-6">
                <h3 className="display text-3xl text-ice">{title}</h3>
                <p className="mt-3 text-frost">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SponsorSlot id="home-between" />
      </div>

      <section className="page-section">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">Who it is for</p>
          <h2 className="display mt-4 text-4xl text-ice">People, creators, brands.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {audiences.map((audience) => (
              <article key={audience.title} className="glass who-card p-6">
                <ImageSlot image={audience.image} />
                <h3 className="display text-3xl text-ice">{audience.title}</h3>
                <p className="mt-3 text-frost">{audience.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="measure mx-auto w-full px-4 sm:px-6">
          <p className="eyebrow">Real proof</p>
          <h2 className="display mt-4 text-4xl text-ice">Public counts, with the source on the number.</h2>
          <p className="mt-4 text-lg text-frost">
            The FBI’s 6 April 2026 release of the 2025 IC3 report records nearly $21 billion in reported losses and 22,364 artificial-intelligence complaints, nearly $893 million. The FTC’s 19 October 2026 report to Congress says adults 60 and over reported about $3 billion in fraud losses for 2025.
          </p>
          <p className="mt-4 text-frost">
            <a className="text-accent" href={fbi}>FBI press release</a>
            {' · '}
            <a className="text-accent" href={ftc}>FTC press release</a>
          </p>
          <Link className="btn-accent mt-8" to="/scamcheck">
            Open the tools
          </Link>
        </div>
      </section>
    </div>
  );
};
