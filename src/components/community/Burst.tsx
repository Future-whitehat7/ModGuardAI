export function Burst({ active }: { active: boolean }) {
  if (!active) return null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return null;
  return (
    <div className="gold-burst" aria-hidden="true">
      {Array.from({ length: 10 }, (_, index) => (
        <span key={index} style={{ ['--i' as string]: index }} />
      ))}
    </div>
  );
}
