import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  SCAMCHECK_LABEL,
  SCAMCHECK_URL,
  menuLinks,
  primaryLinks,
  type SiteLink,
} from './site';

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavAnchor({
  link,
  pathname,
  className,
  onNavigate,
}: {
  link: SiteLink;
  pathname: string;
  className: string;
  onNavigate?: () => void;
}) {
  if (link.external) {
    return (
      <a href={link.href} className={className} onClick={onNavigate}>
        {link.label}
      </a>
    );
  }

  const current = isCurrent(pathname, link.href);
  return (
    <Link
      to={link.href}
      className={className}
      aria-current={current ? 'page' : undefined}
      onClick={onNavigate}
    >
      {link.label}
    </Link>
  );
}

export function MarketingNav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="hud-nav">
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2 sm:px-6">
        <Link to="/" className="hud-logo order-1" aria-label="ModGuard AI home">
          <span className="hud-mark" aria-hidden="true" />
          ModGuard
        </Link>

        <nav className="order-4 ml-auto hidden items-center gap-1 lg:order-2 lg:flex" aria-label="Primary">
          {primaryLinks.map((link) => (
            <NavAnchor
              key={link.href}
              link={link}
              pathname={pathname}
              className="hud-link"
            />
          ))}
        </nav>

        <a href={SCAMCHECK_URL} className="hud-pill order-3 w-full lg:w-auto">
          {SCAMCHECK_LABEL}
        </a>
        <button
          type="button"
          className="hud-menu-button order-2 ml-auto lg:order-4 lg:ml-0"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav id="site-menu" className="hud-menu" aria-label="All pages">
          <ul className="mx-auto flex w-full max-w-6xl flex-col px-3 py-2 sm:px-5">
            {menuLinks.map((link) => (
              <li key={link.href}>
                <NavAnchor
                  link={link}
                  pathname={pathname}
                  className="hud-menu-link"
                  onNavigate={() => setOpen(false)}
                />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
