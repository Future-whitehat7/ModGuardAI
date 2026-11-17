import { RealOrAi } from './RealOrAi';
import { ScamDuel } from './ScamDuel';
import { Squads } from './Squads';

export function Play() {
  return (
    <section id="play" className="community-block" aria-labelledby="play-title">
      <p className="eyebrow">Play</p>
      <h2 id="play-title" className="display section-display text-ice">Three short games. Your score stays here.</h2>
      <div className="play-grid">
        <ScamDuel />
        <RealOrAi />
        <Squads />
      </div>
    </section>
  );
}
