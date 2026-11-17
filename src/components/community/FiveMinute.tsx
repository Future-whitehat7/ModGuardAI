import { useState } from 'react';
import { choiceIsRight, flagTask, labelTask, promptIsReady, promptTask, type ChoiceTask } from '../../community/samples';

const taskTitle: Record<string, string> = {
  [labelTask.id]: labelTask.title,
  [flagTask.id]: flagTask.title,
  [promptTask.id]: promptTask.title,
};
import type { Progress } from '../../community/progress';
import { Burst } from './Burst';

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function FiveMinute({
  progress,
  onDone,
}: {
  progress: Progress;
  onDone: (taskId: string, name: string) => void;
}) {
  const [name, setName] = useState(progress.displayName);
  const [prompt, setPrompt] = useState('');
  const [burst, setBurst] = useState(false);
  const done = progress.tasks.length > 0;
  const latest = progress.tasks[progress.tasks.length - 1] ?? '';

  const finish = (taskId: string) => {
    onDone(taskId, name.trim());
    setBurst(true);
  };

  return (
    <section id="five" className="community-block" aria-labelledby="five-title">
      <p className="eyebrow">C. Start in 5 minutes</p>
      <h2 id="five-title" className="display section-display text-ice">One example. Then a card you can screenshot.</h2>
      <p className="community-copy">
        This is the doorway to Founding Contributor, not the title itself. The samples are examples, not real customer reports. Finish one and this browser keeps the count.
      </p>
      <p className="community-before">
        {done
          ? `After: ${progress.tasks.length} doorway task${progress.tasks.length === 1 ? '' : 's'} on this browser.`
          : 'Before: no doorway task on this browser yet.'}
      </p>
      <label className="community-name">
        Name or handle, optional
        <input value={name} maxLength={40} onChange={(event) => setName(event.target.value)} />
      </label>
      <div className="community-tasks">
        <ChoiceBlock
          task={labelTask}
          onRight={() => finish(labelTask.id)}
        />
        <article>
          <h3>{promptTask.title}</h3>
          <p className="community-kicker">Example exercise</p>
          <p>{promptTask.prompt}</p>
          <textarea value={prompt} maxLength={500} onChange={(event) => setPrompt(event.target.value)} />
          <button type="button" className="btn-accent" disabled={!promptIsReady(prompt)} onClick={() => finish(promptTask.id)}>
            Save this prompt
          </button>
        </article>
        <ChoiceBlock task={flagTask} onRight={() => finish(flagTask.id)} />
      </div>
      {done ? (
        <div className="badge-wrap">
          <Burst active={burst} />
          <article id="doorway-badge" className={burst ? 'badge-card is-new' : 'badge-card'}>
            <img src="/brand/modguard-mark-96.png" alt="" />
            <p className="eyebrow">Doorway task</p>
            <h3>{name.trim() || 'Name left blank'}</h3>
            <p>{taskTitle[latest] ?? 'Doorway task'}</p>
            <time dateTime={progress.lastDay || todayStamp()}>{progress.lastDay || todayStamp()}</time>
            <p>On this browser. Not the public Founding Contributor list.</p>
          </article>
        </div>
      ) : null}
    </section>
  );
}

function ChoiceBlock({ task, onRight }: { task: ChoiceTask; onRight: () => void }) {
  const [picked, setPicked] = useState('');
  return (
    <article>
      <h3>{task.title}</h3>
      <p className="community-kicker">Example, not a real report</p>
      <p className="community-sample">{task.sample}</p>
      <div className="community-choices">
        {task.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            className={picked === choice ? 'on' : ''}
            onClick={() => {
              setPicked(choice);
              if (choiceIsRight(task, choice)) onRight();
            }}
          >
            {choice}
          </button>
        ))}
      </div>
      {picked ? <p>{choiceIsRight(task, picked) ? task.why : 'Not this one. Look at who it pretends to be, and what it asks you to do.'}</p> : null}
    </article>
  );
}

