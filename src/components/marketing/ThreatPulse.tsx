import { useEffect, useState } from 'react';

interface ThreatItem {
  title: string;
  url: string;
  source: string;
  date: string;
  country: string | null;
  x: number | null;
  y: number | null;
}

interface ThreatFile {
  items: ThreatItem[];
  dots: Array<{ name: string; x: number; y: number }>;
}

export function ThreatPulse() {
  const [data, setData] = useState<ThreatFile | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/threats.json')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('missing'))))
      .then((json: ThreatFile) => setData(json))
      .catch(() => setFailed(true));
  }, []);

  const items = data?.items ?? [];
  const mapped = items.filter((item) => item.country && item.x != null && item.y != null);
  const ticker = items.filter((item) => !item.country);

  return (
    <section className="chapter border-t border-ice/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-frost">05 / Pulse</p>
        <h2 className="display mt-3 text-4xl text-ice sm:text-6xl">Global threat pulse</h2>
        <p className="mt-4 max-w-2xl text-lg text-frost">
          Recent headlines from The Hacker News, BleepingComputer, and CISA. Grey marks are geography. A blue pulse appears only when a source names one country.
        </p>
        <div className="glass relative mt-8 aspect-[2/1] overflow-hidden">
          <svg viewBox="0 0 100 50" className="h-full w-full" role="img" aria-label="Dotted world map">
            {(data?.dots ?? []).map((dot) => (
              <circle key={dot.name} cx={dot.x} cy={dot.y} r="0.35" fill="#B9BDC6" />
            ))}
            {mapped.map((item) => (
              <a key={item.url} href={item.url}>
                <circle className="pulse-dot" cx={item.x ?? 0} cy={item.y ?? 0} r="0.7" fill="#2B4BFF" />
                <circle cx={item.x ?? 0} cy={item.y ?? 0} r="0.45" fill="#2B4BFF" />
              </a>
            ))}
          </svg>
          {!items.length && (
            <p className="absolute inset-x-0 bottom-4 text-center text-sm text-frost">
              {failed || data ? 'No public headlines were available for this build.' : 'Loading public headlines.'}
            </p>
          )}
        </div>
        <ul className="mt-6 space-y-3">
          {mapped.map((item) => (
            <li key={item.url} className="text-sm">
              <a className="underline decoration-[#E6E6E1] underline-offset-4" href={item.url}>
                {item.title}
              </a>
              <span className="text-frost"> · {item.country} · {item.source} · {item.date || 'Date not in source'}</span>
            </li>
          ))}
        </ul>
        {ticker.length > 0 && (
          <div className="mt-6 overflow-hidden border-y border-[#E6E6E1] py-3">
            <div className="ticker">
              {[0, 1].map((copy) => (
                <p key={copy} className="flex gap-8 text-sm">
                  {ticker.map((item) => (
                    <a key={`${copy}-${item.url}`} href={item.url}>
                      {item.title} · {item.source} · {item.date || 'Date not in source'}
                    </a>
                  ))}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
