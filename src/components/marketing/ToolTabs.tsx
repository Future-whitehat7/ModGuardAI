import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { href: '/scamcheck', label: 'ScamCheck' },
  { href: '/impersonation-check', label: 'Impersonation Check' },
  { href: '/insights', label: 'Insights' },
  { href: '/sponsor', label: 'Sponsors' },
];

function tabCurrent(pathname: string, href: string) {
  if (href === '/impersonation-check') {
    return pathname === href || pathname.startsWith('/impersonation-check/');
  }
  if (href === '/insights') {
    return pathname === href || pathname.startsWith('/insights/');
  }
  return pathname === href;
}

export function ToolTabs() {
  const { pathname } = useLocation();

  return (
    <nav className="tool-tabs" aria-label="Tools">
      {tabs.map((tab) => {
        const current = tabCurrent(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            to={tab.href}
            className="tool-tab"
            aria-current={current ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
