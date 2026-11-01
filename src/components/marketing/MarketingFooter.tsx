import { Link } from 'react-router-dom';
import { SCAMCHECK_LABEL, SCAMCHECK_URL } from './site';

const links = [
  { label: 'Home', href: '/' },
  { label: 'How it works', href: '/#how' },
  { label: 'What is next', href: '/#next' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/about#contact' },
  { label: 'Get the weekly Scam Alert', href: `${SCAMCHECK_URL}/#playbook`, external: true },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-ice/10 bg-ink text-ice">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
        <div>
          <Link to="/" className="hud-logo">
            <img className="brand-mark" src="/brand/modguard-mark.png" alt="" width="48" height="48" />
            ModGuard
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-frost">
            ModGuard AI is an AI safety studio. ScamCheck is the first live tool: a free AI scam checker.
          </p>
          <a href={SCAMCHECK_URL} className="mt-5 inline-flex min-h-12 items-center text-sm text-accent">
            {SCAMCHECK_LABEL}
          </a>
        </div>
        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">On this site</h2>
          <ul className="mt-4 space-y-2">
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
      <div className="border-t border-ice/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-frost sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-frost">© 2026 ModGuard AI.</p>
          <a href={SCAMCHECK_URL} className="inline-flex min-h-12 items-center hover:text-ice">
            scamcheck.modguardai.org
          </a>
        </div>
      </div>
    </footer>
  );
}
