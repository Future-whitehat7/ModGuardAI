import { useState } from 'react';
import type { Progress } from '../../community/progress';
import { choiceIsRight, flagTask, labelTask, promptIsReady, promptTask, type ChoiceTask } from '../../community/samples';
import { shareOrCopy } from '../../community/share';
import { Burst } from './Burst';

const taskTitle: Record<string, string> = {
  [labelTask.id]: labelTask.title,
  [flagTask.id]: flagTask.title,
  [promptTask.id]: promptTask.title,
};

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

async function paintBadge(name: string, task: string, date: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#FAFAFA';
  ctx.fillRect(0, 0, 800, 1000);
  ctx.strokeStyle = '#C5A059';
  ctx.lineWidth = 10;
  ctx.strokeRect(28, 28, 744, 944);
  const image = new Image();
  image.src = '/brand/modguard-mark-192.png';
  await image.decode();
  ctx.drawImage(image, 300, 140, 200, 200);
  ctx.fillStyle = '#1E3A8A';
  ctx.font = '600 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DOORWAY TASK COMPLETE', 400, 400);
  ctx.fillStyle = '#0F172A';
  ctx.font = '64px Georgia, serif';
  ctx.fillText(name, 400, 490);
  ctx.font = '32px Georgia, serif';
  wrapText(ctx, task, 400, 560, 620, 42);
  ctx.fillStyle = '#334155';
  ctx.font = '24px Inter, sans-serif';
  ctx.fillText(date, 400, 760);
  ctx.fillText('modguardai.org/community', 400, 820);
  return canvas;
}

function downloadBadge(canvas: HTMLCanvasElement) {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'modguard-doorway-badge.png';
  link.click();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, line: number) {
  const words = text.split(' ');
  let row = '';
  words.forEach((word) => {
    const next = row ? `${row} ${word}` : word;
    if (ctx.measureText(next).width > max) {
      ctx.fillText(row, x, y);
      row = word;
      y += line;
    } else {
      row = next;
    }
  });
  if (row) ctx.fillText(row, x, y);
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
  const [copied, setCopied] = useState(false);
  const done = progress.tasks.length > 0;
  const latest = progress.tasks[progress.tasks.length - 1] ?? '';
  const shownName = name.trim() || progress.displayName || 'ModGuard Spotter';
  const shownTask = taskTitle[latest] ?? 'Doorway task';
  const shownDate = progress.lastDay || todayStamp();

  const finish = (taskId: string) => {
    onDone(taskId, name.trim());
    setBurst(true);
  };

  const shareText = `I finished a ModGuard doorway task: ${shownTask}. ${shownDate}. https://modguardai.org/community`;

  return (
    <section id="five" className="community-block" aria-labelledby="five-title">
      <p className="eyebrow">C. Start in 5 minutes</p>
      <h2 id="five-title" className="display section-display text-ice">Your first win takes one example.</h2>
      <p className="community-copy">
        Three labeled examples. Finish one and you leave with a card, a streak, and a step on the path. These are practice cases, so you can learn the check before a real one lands.
      </p>
      <label className="community-name">
        Name or handle, optional
        <input value={name} maxLength={40} onChange={(event) => setName(event.target.value)} placeholder="ModGuard Spotter" />
      </label>
      <div className="community-tasks">
        <ChoiceBlock task={labelTask} onRight={() => finish(labelTask.id)} />
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
            <p className="eyebrow">Doorway task complete</p>
            <h3>{shownName}</h3>
            <p>{shownTask}</p>
            <time dateTime={shownDate}>{shownDate}</time>
            <div className="badge-actions">
              <button type="button" className="btn-accent" onClick={() => void paintBadge(shownName, shownTask, shownDate).then((canvas) => { if (canvas) downloadBadge(canvas); })}>
                Download badge
              </button>
              <button
                type="button"
                onClick={() => {
                  void paintBadge(shownName, shownTask, shownDate).then(async (canvas) => {
                    if (!canvas) return;
                    const result = await shareOrCopy(shareText, canvas, 'modguard-doorway-badge.png');
                    if (result === 'copied' || result === 'shared') setCopied(true);
                  });
                }}
              >
                {copied ? 'Copied' : 'Share or copy'}
              </button>
            </div>
          </article>
          <p className="badge-fine">Saved on this browser. A public Founding Contributor credit is added when the work is confirmed.</p>
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
      {picked ? <p>{choiceIsRight(task, picked) ? task.why : 'Look again at who it pretends to be, and what it asks you to do.'}</p> : null}
    </article>
  );
}
