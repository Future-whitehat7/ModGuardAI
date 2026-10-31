import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const IceCanvas = lazy(() => import('./IceCanvas').then((module) => ({ default: module.IceCanvas })));

export function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setEnabled(false);
      return;
    }

    const enable = () => setEnabled(true);
    window.addEventListener('pointerdown', enable, { once: true, passive: true });
    window.addEventListener('keydown', enable, { once: true });
    const timer = window.setTimeout(enable, 4000);

    return () => {
      window.removeEventListener('pointerdown', enable);
      window.removeEventListener('keydown', enable);
      window.clearTimeout(timer);
    };
  }, [reduced]);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stageRef}
      className={`hero-stage${enabled ? ' is-live' : ''}`}
      aria-hidden="true"
    >
      <div className="hero-glow">
        <div className="hero-gem" />
      </div>
      {enabled && (
        <Suspense fallback={null}>
          <IceCanvas active={inView} />
        </Suspense>
      )}
      <div className="hero-scrim" />
    </div>
  );
}
