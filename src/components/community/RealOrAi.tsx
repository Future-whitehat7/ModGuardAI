import { useState } from 'react';
import { arcadeCards } from '../../community/play';

export function RealOrAi() {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const card = arcadeCards[index];
  const finished = answered === arcadeCards.length;

  const guess = (kind: 'real' | 'ai') => {
    if (!card || finished) return;
    const hit = kind === card.kind;
    setCorrect((value) => value + (hit ? 1 : 0));
    setAnswered((value) => value + 1);
    setNote(hit ? `Yes. ${card.credit}` : `Not this time. ${card.credit}`);
    setIndex((value) => Math.min(value + 1, arcadeCards.length));
  };

  const share = `I scored ${correct} of ${arcadeCards.length} on ModGuard Real or AI. https://modguardai.org/community`;

  const download = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, 800, 800);
    ctx.strokeStyle = '#C5A059';
    ctx.lineWidth = 10;
    ctx.strokeRect(28, 28, 744, 744);
    ctx.fillStyle = '#1E3A8A';
    ctx.font = '28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('REAL OR AI', 400, 220);
    ctx.fillStyle = '#0F172A';
    ctx.font = '92px Georgia, serif';
    ctx.fillText(`${correct}/${arcadeCards.length}`, 400, 380);
    ctx.fillStyle = '#334155';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText('On this browser. Not a global board.', 400, 470);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'modguard-real-or-ai.png';
    link.click();
  };

  return (
    <article className="play-card" id="real-or-ai">
      <p className="community-kicker">Real or AI?</p>
      <h3>Tap the picture. Keep your score.</h3>
      <p>Credits are on each reveal. Audio round coming soon.</p>
      {card && !finished ? (
        <figure>
          <img src={card.src} alt="" />
          <div className="duel-pair">
            <button type="button" onClick={() => guess('real')}>Real</button>
            <button type="button" onClick={() => guess('ai')}>AI-made</button>
          </div>
        </figure>
      ) : (
        <div className="badge-card" id="arcade-score">
          <p className="eyebrow">Your score</p>
          <h3>{correct} of {arcadeCards.length}</h3>
          <div className="badge-actions">
            <button type="button" className="btn-accent" onClick={() => void download()}>Download score</button>
            <button type="button" onClick={() => { void navigator.clipboard.writeText(share).then(() => setCopied(true)); }}>
              {copied ? 'Copied' : 'Copy share text'}
            </button>
          </div>
        </div>
      )}
      {note ? <p role="status">{note}</p> : null}
      <p className="badge-fine">{answered} played on this browser. There is no global leaderboard.</p>
    </article>
  );
}
