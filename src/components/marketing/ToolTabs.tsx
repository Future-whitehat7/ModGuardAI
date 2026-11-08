import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { href: '/scamcheck', label: 'ScamCheck' },
  { href: '/impersonation-check', label: 'Impersonation Check' },
  { href: '/insights', label: 'Insights' },
  { href: '/sponsor', label: 'Sponsors' },
];

type TabOverflow = 'none' | 'start' | 'end' | 'both';

function tabOverflow(scrollLeft: number, maxScroll: number): TabOverflow {
  const start = scrollLeft > 16;
  const end = maxScroll > 2 && scrollLeft < maxScroll - 2;
  if (start && end) return 'both';
  if (start) return 'start';
  if (end) return 'end';
  return 'none';
}

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
  const scroller = useRef<HTMLElement>(null);
  const [overflow, setOverflow] = useState<TabOverflow>('none');

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      setOverflow(tabOverflow(el.scrollLeft, el.scrollWidth - el.clientWidth));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <nav ref={scroller} className="tool-tabs" data-overflow={overflow} aria-label="Tools">
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
