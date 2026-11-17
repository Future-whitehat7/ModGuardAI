import { levelProgress, pathSteps, type Progress } from '../../community/progress';

export function PlayerPath({ progress, animate }: { progress: Progress; animate: boolean }) {
  if (progress.tasks.length === 0) return null;
  const level = levelProgress(progress.tasks.length);
  const steps = pathSteps(progress.tasks.length);
  const radius = 28;
  const turn = 2 * Math.PI * radius;
  const filled = level.goal === 0 ? 0 : level.done / level.goal;

  return (
    <div className={animate ? 'player-path is-up' : 'player-path'} aria-label="Your progress on this browser">
      <div className="player-level">
        <svg className="progress-ring" viewBox="0 0 72 72" aria-hidden="true">
          <circle cx="36" cy="36" r={radius} />
          <circle
            cx="36"
            cy="36"
            r={radius}
            strokeDasharray={`${turn * filled} ${turn}`}
          />
        </svg>
        <p>
          <strong className="player-count">{progress.tasks.length}</strong>
          {level.name}
          <small>{level.done}/{level.goal} toward {level.next}</small>
        </p>
      </div>
      {progress.streak > 0 ? (
        <p className="streak-flame">
          <Flame />
          {progress.streak} day{progress.streak === 1 ? '' : 's'} in a row
        </p>
      ) : null}
      <ol className="path-steps">
        {steps.map((step) => (
          <li key={step.name} data-state={step.state}>
            <span>{step.state === 'locked' ? 'Locked' : step.state === 'done' ? 'Done' : 'Now'}</span>
            {step.name}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Flame() {
  return (
    <svg className="flame" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2c1 4 4 5 4 9a4 4 0 1 1-8 0c0-2 1-3 2-5 0 2 1 2 2 2-1-3-1-5 0-6z" />
    </svg>
  );
}
