import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { starMotion } from './starMotion';

const StarfieldCanvas = lazy(() =>
  import('./StarfieldCanvas').then((module) => ({ default: module.StarfieldCanvas })),
);

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function SpaceSky() {
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(prefersReducedMotion);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setLive(false);
      starMotion.x = 0;
      starMotion.y = 0;
      starMotion.scroll = 0;
      return;
    }

    let frame = 0;
    let scroll = window.scrollY;
    let pointerX = 0;
    let pointerY = 0;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const apply = () => {
      frame = 0;
      starMotion.scroll = scroll;
      starMotion.x = pointerX;
      starMotion.y = pointerY;
      const far = farRef.current;
      const mid = midRef.current;
      if (far) {
        far.style.transform = `translate3d(${pointerX * 10}px, ${pointerY * 8 - scroll * 0.02}px, 0)`;
      }
      if (mid) {
        mid.style.transform = `translate3d(${pointerX * 22}px, ${pointerY * 14 - scroll * 0.05}px, 0)`;
      }
    };

    const onScroll = () => {
      scroll = window.scrollY;
      if (frame === 0) frame = window.requestAnimationFrame(apply);
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
      if (frame === 0) frame = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (finePointer) window.addEventListener('pointermove', onPointer, { passive: true });

    const enable = () => setLive(true);
    const idle = window.requestIdleCallback?.(enable, { timeout: 1800 });
    const timer = window.setTimeout(enable, 1800);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      if (idle !== undefined) window.cancelIdleCallback(idle);
    };
  }, [reduced]);

  return (
    <div className="space-sky" aria-hidden="true">
      <div className="space-nebula" />
      <div ref={farRef} className="space-parallax">
        <div className="space-drift space-drift-far" />
      </div>
      <div ref={midRef} className="space-parallax">
        <div className="space-drift space-drift-mid" />
      </div>
      {live && (
        <Suspense fallback={null}>
          <StarfieldCanvas />
        </Suspense>
      )}
    </div>
  );
}
