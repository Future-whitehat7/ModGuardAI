import { Outlet, useLocation } from 'react-router-dom';
import { MarketingFooter } from './MarketingFooter';
import { MarketingNav } from './MarketingNav';
import { SpaceSky } from './SpaceSky';

function isDarkRoute(pathname: string) {
  return pathname === '/' || pathname === '/earlyaccess' || pathname === '/waitlist';
}

export function MarketingShell() {
  const { pathname } = useLocation();
  const dark = isDarkRoute(pathname);

  return (
    <div className={dark ? 'marketing-frame min-h-screen bg-ink text-ice' : 'min-h-screen bg-white text-gray-900'}>
      {dark && <SpaceSky />}
      <div className="grain" aria-hidden="true" />
      <MarketingNav />
      <div id="content">
        <Outlet />
      </div>
      <MarketingFooter />
    </div>
  );
}
