import { useEffect, useRef, useState, type ReactNode } from 'react';

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function nearestIndex(track: HTMLElement) {
  const cards = [...track.children] as HTMLElement[];
  if (!cards.length) return 0;
  const left = track.scrollLeft;
  let best = 0;
  let distance = Number.POSITIVE_INFINITY;
  cards.forEach((card, index) => {
    const delta = Math.abs(card.offsetLeft - left);
    if (delta < distance) {
      distance = delta;
      best = index;
    }
  });
  return best;
}

function scrollToIndex(track: HTMLElement, index: number) {
  const card = track.children[index] as HTMLElement | undefined;
  if (!card) return;
  const left = card.offsetLeft;
  if (reducedMotion()) {
    track.scrollLeft = left;
    return;
  }
  const start = track.scrollLeft;
  const change = left - start;
  const began = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - began) / 420);
    const eased = 1 - (1 - progress) ** 3;
    track.scrollLeft = start + change * eased;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function SwipeDeck<T>({
  items,
  getKey,
  label,
  render,
}: {
  items: T[];
  getKey: (item: T) => string;
  label: string;
  render: (item: T) => ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const moved = useRef(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const node = track.current;
    if (node) node.scrollLeft = 0;
  }, [items]);

  if (!items.length) return null;

  const sync = () => {
    const node = track.current;
    if (!node || drag.current) return;
    setIndex(nearestIndex(node));
  };

  const go = (next: number) => {
    const node = track.current;
    if (!node) return;
    const clamped = Math.max(0, Math.min(items.length - 1, next));
    scrollToIndex(node, clamped);
    setIndex(clamped);
  };

  return (
    <div className="swipe">
      <div className="swipe-bar">
        <p>{index + 1} of {items.length}</p>
        <div>
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous card">Previous</button>
          <button type="button" onClick={() => go(index + 1)} disabled={index === items.length - 1} aria-label="Next card">Next</button>
        </div>
      </div>
      <div
        ref={track}
        className="swipe-track"
        tabIndex={0}
        role="region"
        aria-label={label}
        onScroll={sync}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            go(index + 1);
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            go(index - 1);
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse' && event.button !== 0) return;
          const node = track.current;
          if (!node) return;
          node.setPointerCapture(event.pointerId);
          moved.current = false;
          drag.current = { x: event.clientX, left: node.scrollLeft };
          node.classList.add('is-dragging');
        }}
        onPointerMove={(event) => {
          const node = track.current;
          const state = drag.current;
          if (!node || !state) return;
          const delta = event.clientX - state.x;
          if (Math.abs(delta) > 6) moved.current = true;
          node.scrollLeft = state.left - delta;
        }}
        onPointerUp={() => {
          const node = track.current;
          if (!node) return;
          node.classList.remove('is-dragging');
          const current = nearestIndex(node);
          drag.current = null;
          scrollToIndex(node, current);
          setIndex(current);
        }}
        onClickCapture={(event) => {
          if (!moved.current) return;
          event.preventDefault();
          event.stopPropagation();
          moved.current = false;
        }}
      >
        {items.map((item) => (
          <div className="swipe-card" key={getKey(item)}>
            {render(item)}
          </div>
        ))}
      </div>
      <div className="swipe-dots" role="tablist" aria-label="Card position">
        {items.map((item, dot) => (
          <button
            key={getKey(item)}
            type="button"
            role="tab"
            aria-selected={dot === index}
            aria-label={`Card ${dot + 1}`}
            className={dot === index ? 'on' : ''}
            onClick={() => go(dot)}
          />
        ))}
      </div>
    </div>
  );
}
