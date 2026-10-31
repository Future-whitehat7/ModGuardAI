import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MarketingFooter } from './MarketingFooter';
import { MarketingNav } from './MarketingNav';
import { SpaceSky } from './SpaceSky';

export function MarketingShell() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void import('./smoothScroll').then((module) => module.startSmoothScroll());
    }, 3200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="marketing-frame min-h-screen bg-ink text-ice">
      <SpaceSky />
      <div className="grain" aria-hidden="true" />
      <MarketingNav />
      <div id="content">
        <Outlet />
      </div>
      <MarketingFooter />
    </div>
  );
}
