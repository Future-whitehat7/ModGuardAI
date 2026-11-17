import { levelProgress, pathSteps, type Progress } from '../../community/progress';

const levels = ['Scout', 'Spotter', 'Analyst', 'Guardian', 'Founding Contributor'] as const;

export function PlayerPath({ progress, animate }: { progress: Progress; animate: boolean }) {
  const level = levelProgress(progress.tasks.length);
  const steps = pathSteps(progress.tasks.length);
  const radius = 28;
  const turn = 2 * Math.PI * radius;
  const filled = level.goal === 0 ? 0 : level.done / level.goal;

  return (
    <div className={animate ? 'player-path is-up' : 'player-path'} aria-label="Path from a first task to Founding Contributor">
      <ol className="path-steps">
        {steps.map((step, index) => (
          <li key={step.name} data-state={step.state}>
            <span>{index + 1}. {step.state === 'locked' ? 'Locked' : step.state === 'done' ? 'Unlocked' : 'Start here'}</span>
            {step.name}
          </li>
        ))}
      </ol>
      <ol className="level-names">
        {levels.map((name) => (
          <li key={name} data-state={name === level.name ? 'now' : name === 'Scout' && level.name === 'Spotter' ? 'done' : 'locked'}>
            {name}
          </li>
        ))}
      </ol>
      {progress.tasks.length > 0 ? (
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
          {progress.streak > 0 ? (
            <p className="streak-flame">
              <Flame />
              {progress.streak} day{progress.streak === 1 ? '' : 's'} in a row
            </p>
          ) : null}
        </div>
      ) : null}
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
