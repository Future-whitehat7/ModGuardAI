import { Link } from 'react-router-dom';
import { SCAMCHECK_LABEL, SCAMCHECK_URL } from './site';

const columns = [
  {
    title: 'Technology',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Features', href: '/features' },
      { label: 'Solutions', href: '/solutions' },
      { label: 'Live demo', href: '/demo' },
      { label: 'Early access', href: '/earlyaccess' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'AI Fellowship', href: '/student-portal' },
      { label: 'Deepfake challenge', href: '/leaderboard' },
      { label: 'Events and webinars', href: '/events' },
      { label: 'Research network', href: '/threat-map' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Press and media', href: '/media' },
      { label: 'Blog', href: '/blog' },
      { label: 'Case studies', href: '/case-studies' },
      { label: 'Transparency dashboard', href: '/dashboard' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'API documentation', href: '/api' },
      { label: 'SDKs and libraries', href: '/api' },
      { label: 'Integration guides', href: '/resources' },
      { label: 'API sandbox', href: '/demo' },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-ice/10 bg-ink text-ice">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-1">
          <Link to="/" className="hud-logo">
            <span className="hud-mark" aria-hidden="true" />
            ModGuard
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-ice/70">
            Defending digital truth with AI-powered content moderation and deepfake detection.
          </p>
          <a href={SCAMCHECK_URL} className="mt-5 inline-flex min-h-12 items-center text-sm text-accent">
            {SCAMCHECK_LABEL}
          </a>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">{column.title}</h2>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={column.title + link.label}>
                  <Link to={link.href} className="inline-flex min-h-12 items-center text-sm text-ice/70 hover:text-ice">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ice/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-ice/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 ModGuard AI. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="#privacy" className="inline-flex min-h-12 items-center hover:text-ice">Privacy policy</a>
            <a href="#terms" className="inline-flex min-h-12 items-center hover:text-ice">Terms of service</a>
            <Link to="/earlyaccess" className="inline-flex min-h-12 items-center hover:text-ice">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
