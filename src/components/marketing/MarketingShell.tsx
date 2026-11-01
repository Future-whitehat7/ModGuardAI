import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MarketingFooter } from './MarketingFooter';
import { MarketingNav } from './MarketingNav';
import { observeRises } from './rise';
import { SpaceSky } from './SpaceSky';

export function MarketingShell() {
  useEffect(() => {
    observeRises(document);
    const content = document.getElementById('content');
    const changes = content
      ? new MutationObserver(() => observeRises(content))
      : null;
    changes?.observe(content as HTMLElement, { childList: true, subtree: true });
    const timer = window.setTimeout(() => {
      void import('./smoothScroll').then((module) => module.startSmoothScroll());
    }, 3200);
    return () => {
      changes?.disconnect();
      window.clearTimeout(timer);
    };
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
