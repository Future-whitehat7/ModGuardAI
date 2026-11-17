import { useState } from 'react';
import { cardText, downloadCanvas, paintCard, shareOrCopy } from '../../community/share';

export function ShareActions({
  headline,
  detail,
  lines,
  filename,
}: {
  headline: string;
  detail: string;
  lines: string[];
  filename: string;
}) {
  const [status, setStatus] = useState('');
  const text = cardText(headline, detail);

  return (
    <div className="badge-actions">
      <button type="button" className="btn-accent" onClick={() => downloadCanvas(paintCard(lines), filename)}>
        Download card
      </button>
      <button
        type="button"
        onClick={() => {
          void shareOrCopy(text, paintCard(lines), filename).then((result) => {
            if (result === 'shared') setStatus('Shared');
            if (result === 'copied') setStatus('Copied');
          });
        }}
      >
        {status || 'Share or copy'}
      </button>
    </div>
  );
}
