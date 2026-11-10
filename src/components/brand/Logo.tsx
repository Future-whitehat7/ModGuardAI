export type LogoSurface = 'light' | 'obsidian';

const LOCKUP: Record<LogoSurface, string> = {
  light: '/brand/lockup-horizontal-ink.png',
  obsidian: '/brand/lockup-horizontal-white.png',
};

export function Logo({ surface = 'light' }: { surface?: LogoSurface }) {
  return (
    <img
      className="logo-lockup"
      src={LOCKUP[surface]}
      alt="ModGuard AI"
      width={1227}
      height={260}
    />
  );
}
