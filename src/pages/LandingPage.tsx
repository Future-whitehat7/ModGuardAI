import { Link } from 'react-router-dom';
import { CommunityTeaser } from '../components/community/CommunityTeaser';
import { DailyHub } from '../components/daily/DailyHub';
import { PromptGenerator } from '../components/daily/PromptGenerator';
import { SocialBuzz } from '../components/daily/SocialBuzz';
import { SponsorDaily } from '../components/daily/SponsorDaily';
import { useDailyFeed } from '../components/daily/useDailyFeed';

const fbi = 'https://www.fbi.gov/news/press-releases/cryptocurrency-and-ai-scams-bilk-americans-of-billions';
const ftc = 'https://www.ftc.gov/news-events/news/press-releases/2026/10/ftc-issues-annual-report-congress-agencys-actions-protect-older-adults';

const stats = [
  { value: 'Nearly $21B', label: '2025 IC3 reported losses', href: fbi, source: 'FBI, 6 April 2026' },
  { value: 'About $3B', label: '2025 fraud losses reported by adults 60 and over', href: ftc, source: 'FTC, 19 October 2026' },
  { value: '22,364', label: '2025 AI-related IC3 complaints', href: fbi, source: 'FBI, 6 April 2026' },
];

const pains = [
  {
    fear: 'A text is pushing you to pay.',
    answer: 'ScamCheck reads that message, and the links in it, before the transfer.',
    href: '/scamcheck',
    cta: 'Open ScamCheck',
  },
  {
    fear: 'A statement line does not look like yours.',
    answer: 'The same free tool has a second step for bank or card lines.',
    href: '/scamcheck',
    cta: 'Check a statement',
  },
  {
    fear: 'Someone is using your name.',
    answer: 'Impersonation Check is $199, one time. We read the accounts and ads you submit. We do not search every platform, and we do not remove accounts.',
    href: '/impersonation-check',
    cta: 'Start the $199 check',
  },
];

const audiences = [
  { title: 'People', copy: 'Check the message before the transfer leaves the account.', href: '/scamcheck', cta: 'Open ScamCheck' },
  { title: 'Creators', copy: 'A copy of the account can ask the audience for money.', href: '/impersonation-check', cta: 'Verify suspicious accounts — $199 one-time' },
  { title: 'Brands', copy: 'A labeled placement sits next to people who are already checking.', href: '/sponsor', cta: 'See sponsor spots' },
];

function HeroPanel({
  ready,
  news,
  kev,
}: {
  ready: boolean;
  news: { title: string; url: string; source: string }[];
  kev: { value: number; url: string; source: string } | null;
}) {
  const headlines = news.slice(0, 3);
  if (!ready || (headlines.length === 0 && !kev)) {
    return (
      <div className="hero-emblem" aria-hidden="true">
        <img src="/brand/modguard-mark-512.png" alt="" />
      </div>
    );
  }
  return (
    <aside className="hero-panel" aria-label="Latest from ModGuard Daily">
      <p className="eyebrow">ModGuard Daily</p>
      {kev ? (
        <a className="hero-kev" href={kev.url}>
          <span>{kev.value.toLocaleString('en-US')}</span>
          Known exploited vulnerabilities
          <small>{kev.source}</small>
        </a>
      ) : null}
      {headlines.length > 0 ? (
        <ol>
          {headlines.map((item) => (
            <li key={item.url}>
              <a href={item.url}>
                <small>{item.source}</small>
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      ) : null}
      <Link to="/daily">Open the day’s reporting</Link>
    </aside>
  );
}

export const LandingPage = () => {
  const { feed, ready } = useDailyFeed();
  return (
    <div>
      <section className="hero mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="hero-layout">
          <div className="hero-copy">
            <img className="hero-mark" src="/brand/modguard-mark-512.png" alt="" />
            <p className="eyebrow">AI safety studio</p>
            <h1 className="display hero-display text-ice">
              A scam can wear your name.
            </h1>
            <div className="hero-rule" aria-hidden="true" />
            <p className="hero-lede">
              Check the message before you pay. Check the account before it asks as you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-accent" to="/scamcheck">Open ScamCheck</Link>
              <Link className="btn-ghost" to="/impersonation-check">Impersonation Check, $199</Link>
            </div>
          </div>
          <HeroPanel ready={ready} news={feed?.news ?? []} kev={feed?.stats.find((stat) => /known exploited/i.test(stat.label)) ?? null} />
        </div>
      </section>

      <section className="page-section">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">Who it is for</p>
          <h2 className="display section-display mt-4 text-ice">People, creators, brands.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {audiences.map((audience) => (
              <article key={audience.title} className="glass plate">
                <h3 className="display text-3xl text-ice">{audience.title}</h3>
                <p className="mt-3 leading-relaxed text-frost">{audience.copy}</p>
                <Link className="offer-link" to={audience.href}>{audience.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">The worry, then the tool</p>
          <h2 className="display section-display mt-4 text-ice">Three fears. A tool for each.</h2>
          <div className="mt-8 grid gap-5">
            {pains.map((pain) => (
              <article key={pain.fear} className="glass plate pain-row">
                <h3 className="display text-3xl text-ice">{pain.fear}</h3>
                <p className="mt-3 leading-relaxed text-frost">{pain.answer}</p>
                <Link className="btn-accent mt-5" to={pain.href}>{pain.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">Public counts</p>
          <h2 className="display section-display mt-4 text-ice">The scale of the problem.</h2>
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
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-frost">
            The FBI’s 6 April 2026 release of the 2025 IC3 report records{' '}
            <a href={fbi}>nearly $21 billion in reported losses</a>
            {' '}and{' '}
            <a href={fbi}>22,364 artificial-intelligence complaints</a>
            . The FTC’s 19 October 2026 report to Congress says adults 60 and over reported{' '}
            <a href={ftc}>about $3 billion in fraud losses for 2025</a>
            .
          </p>
        </div>
      </section>

      <section className="page-section" aria-labelledby="daily-title">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">ModGuard Daily</p>
          <h2 id="daily-title" className="display section-display mt-4 text-ice">The day’s cybersecurity and AI reporting.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-frost">
            Public headlines only. Each card names its source and opens the original.
          </p>
          {!ready ? <p className="daily-note">Loading the public feed.</p> : null}
          {ready && feed && feed.news.length > 0 ? (
            <DailyHub items={feed.news} stats={feed.stats} asOf={feed.asOf} showList={false} />
          ) : null}
          {ready && feed && feed.news.length === 0 ? <p className="daily-note">The public feed is not available right now.</p> : null}
        </div>
      </section>

      <section className="page-section" aria-labelledby="buzz-title">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">Community</p>
          <h2 id="buzz-title" className="display section-display mt-4 text-ice">What people are saying</h2>
          {ready && feed ? <SocialBuzz posts={feed.posts} /> : null}
          {ready && feed && feed.posts.length === 0 ? <p className="daily-note">Public posts are not available right now.</p> : null}
        </div>
      </section>

      <section className="page-section" aria-labelledby="prompt-title">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">Prompt generator</p>
          <h2 id="prompt-title" className="display section-display mt-4 text-ice">A prompt, ready to copy.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-frost">
            Choose a security task and add your context. The prompt stays in this browser.
          </p>
          <PromptGenerator />
        </div>
      </section>

      <CommunityTeaser />

      <section className="page-section" aria-labelledby="sponsor-title">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">Sponsors</p>
          <h2 id="sponsor-title" className="display section-display mt-4 text-ice">Sponsor ModGuard Daily</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-frost">
            Put a labeled placement in front of people who are already checking a message.
          </p>
          <SponsorDaily />
        </div>
      </section>
    </div>
  );
};
