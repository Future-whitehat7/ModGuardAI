import { Link } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { PLAYBOOK_URL, SCAMCHECK_URL } from '../../config/platform';

const links = [
  { label: 'Home', href: '/' },
  { label: 'ScamCheck', href: '/scamcheck' },
  { label: 'Impersonation Check', href: '/impersonation-check' },
  { label: 'Insights', href: '/insights' },
  { label: 'Sponsors', href: '/sponsor' },
  { label: 'About', href: '/about' },
  { label: 'AI Scam Shield Playbook', href: PLAYBOOK_URL, external: true },
  { label: 'Get the weekly Scam Alert', href: SCAMCHECK_URL, external: true },
];

export function MarketingFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <Link to="/" className="logo-link" aria-label="ModGuard AI home">
            <Logo surface="light" />
          </Link>
          <p className="mt-5 max-w-md text-base leading-relaxed text-frost">
            ModGuard AI is an AI safety studio. ScamCheck is the first live tool: a free AI scam checker.
          </p>
          <Link to="/scamcheck" className="mt-5 inline-flex min-h-12 items-center text-sm text-accent">
            Open the tools
          </Link>
        </div>
        <div>
          <h2 className="eyebrow">On this site</h2>
          <ul className="mt-4 space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                {link.external ? (
                  <a href={link.href} className="inline-flex min-h-12 items-center text-sm text-frost hover:text-ice">
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.href} className="inline-flex min-h-12 items-center text-sm text-frost hover:text-ice">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="site-footer-base">
        <div className="site-footer-base-inner">
          <p>© 2026 ModGuard AI.</p>
          <a href={SCAMCHECK_URL} className="inline-flex min-h-12 items-center hover:text-ice">
            ScamCheck
          </a>
        </div>
      </div>
    </footer>
  );
};
