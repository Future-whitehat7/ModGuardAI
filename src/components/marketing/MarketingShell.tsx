import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MarketingFooter } from './MarketingFooter';
import { MarketingNav } from './MarketingNav';
import { observeRises } from './rise';

export function MarketingShell() {
  useEffect(() => {
    observeRises(document);
    const content = document.getElementById('content');
    const changes = content
      ? new MutationObserver(() => observeRises(content))
      : null;
    changes?.observe(content as HTMLElement, { childList: true, subtree: true });
    return () => {
      changes?.disconnect();
    };
  }, []);

  return (
    <div className="marketing-frame min-h-screen bg-ink text-ice">
      <div className="cosmic-glow" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <MarketingNav />
      <div id="content">
        <Outlet />
      </div>
      <MarketingFooter />
    </div>
  );
}
