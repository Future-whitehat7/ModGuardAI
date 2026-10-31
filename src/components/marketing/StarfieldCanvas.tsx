import { useEffect, useRef } from 'react';
import { starMotion } from './starMotion';

interface Star {
  x: number;
  y: number;
  z: number;
  radius: number;
  phase: number;
}

const LINK_DISTANCE = 0.16;

function createField(count: number): { stars: Star[]; links: Array<[number, number]> } {
  const stars: Star[] = [];
  for (let index = 0; index < count; index += 1) {
    const band = index / count;
    let depth = 0.28;
    if (band > 0.72) depth = 1;
    else if (band > 0.4) depth = 0.62;
    stars.push({
      x: Math.random(),
      y: Math.random(),
      z: depth,
      radius: depth > 0.9 ? 1.15 : 0.45 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    });
  }

  const near = stars
    .map((star, index) => ({ index, depth: star.z }))
    .filter((star) => star.depth > 0.9)
    .map((star) => star.index);

  const links: Array<[number, number]> = [];
  for (let left = 0; left < near.length; left += 1) {
    for (let right = left + 1; right < near.length; right += 1) {
      const a = stars[near[left]];
      const b = stars[near[right]];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.hypot(dx, dy);
      if (distance < LINK_DISTANCE && distance > 0.04) {
        links.push([near[left], near[right]]);
      }
    }
  }

  return { stars, links: links.slice(0, 26) };
}

function wrap(value: number, size: number) {
  const span = size + 48;
  return ((value % span) + span) % span - 24;
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const { stars, links } = createField(mobile ? 64 : 120);
    let frame = 0;
    let visible = document.visibilityState === 'visible';

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const point = (star: Star, width: number, height: number, time: number) => {
      const drift = time * 0.000008 * star.z;
      const shiftX = starMotion.x * 28 * star.z;
      const shiftY = starMotion.y * 18 * star.z - starMotion.scroll * 0.035 * star.z;
      return {
        x: wrap(star.x * width + shiftX, width),
        y: wrap((star.y + drift) * height + shiftY, height),
      };
    };

    const draw = (time: number) => {
      if (!visible) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);

      context.lineWidth = 1;
      context.strokeStyle = 'rgba(143, 184, 255, 0.22)';
      context.beginPath();
      links.forEach(([from, to]) => {
        const start = point(stars[from], width, height, time);
        const end = point(stars[to], width, height, time);
        const gap = Math.hypot(start.x - end.x, start.y - end.y);
        if (gap > Math.min(width, height) * LINK_DISTANCE) return;
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
      });
      context.stroke();

      stars.forEach((star) => {
        const position = point(star, width, height, time);
        const twinkle = 0.45 + star.z * 0.4 + Math.sin(time * 0.0012 + star.phase) * 0.12;
        context.globalAlpha = Math.max(0.15, Math.min(1, twinkle));
        context.fillStyle = star.z > 0.9 ? '#eaf6ff' : '#8fb8ff';
        context.beginPath();
        context.arc(position.x, position.y, star.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
      if (visible) frame = window.requestAnimationFrame(draw);
    };

    document.addEventListener('visibilitychange', onVisibility);
    frame = window.requestAnimationFrame(draw);

    return () => {
      visible = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="space-canvas" />;
}
