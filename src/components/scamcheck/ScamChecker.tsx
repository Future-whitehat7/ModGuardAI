import { useEffect, useState, type ReactNode } from 'react';
import { SCAMCHECK_FAQ_URL } from '../../config/platform';

type CheckMode = 'text' | 'link' | 'call' | 'shot';
type CheckStep = 'message' | 'statement';

interface CheckedLink {
  url: string;
  listed: boolean;
  source?: string;
  flags?: string[];
}

interface MessageResult {
  verdict: string;
  scamType: string;
  confidence: number;
  summary: string;
  redFlags: string[];
  nextSteps: string[];
  links?: CheckedLink[];
}

interface ChargeLine {
  merchant: string;
  amount: string;
  date?: string;
  flag: string;
  reason: string;
}

interface StatementResult {
  verdict: string;
  summary: string;
  charges: ChargeLine[];
  nextSteps: string[];
}

const MODES: { id: CheckMode; label: string }[] = [
  { id: 'text', label: 'Text' },
  { id: 'link', label: 'Link' },
  { id: 'call', label: 'Call' },
  { id: 'shot', label: 'Screenshot' },
];

const MESSAGE_SAMPLES: { label: string; mode: CheckMode; text: string }[] = [
  {
    label: 'Bank SMS',
    mode: 'text',
    text: 'CHASE ALERT: Your account has been temporarily locked due to unusual activity. Verify your identity within 24 hours to avoid permanent suspension: http://chase-secure-verify.top/login',
  },
  {
    label: 'Crypto DM',
    mode: 'text',
    text: "Hey! I saw your profile and I think you'd be perfect for my mentor's crypto trading group. I turned $500 into $12,000 in 2 weeks with guaranteed daily returns. Just send USDT to our wallet and he'll set up your account today, spots are limited!",
  },
  {
    label: 'Voice call',
    mode: 'call',
    text: "Caller: Grandma? It's me, it's Jake. I'm in trouble, I was in a car accident and the police arrested me. Please don't tell Mom. I need $4,000 for bail right now. My lawyer will call you, you can pay with gift cards or a wire. This is my new number, please hurry.",
  },
];

const STATEMENT_SAMPLES: { label: string; text: string }[] = [
  {
    label: 'Unknown charge',
    text: '10/02 NETFLIX.COM 15.49\n10/04 WHOLEFDS MKT #1023 64.12\n10/05 SHELL OIL 41.30\n10/07 XQZ*DGTLSRV 8833 HK 1.00\n10/08 XQZ*DGTLSRV 8833 HK 89.99\n10/11 SPOTIFY USA 11.99',
  },
  {
    label: 'Trial conversion',
    text: "09/28 FITPRO APP FREE TRIAL 0.00\n10/01 TRADER JOE'S #552 38.20\n10/05 FITPRO APP ANNUAL PLAN 119.99\n10/09 APPLE.COM/BILL 2.99\n10/12 CHIPOTLE 0921 13.85",
  },
  {
    label: 'Clean statement',
    text: '10/01 RENT PAYMENT ACH 1450.00\n10/03 KROGER #418 72.44\n10/06 NETFLIX.COM 15.49\n10/10 CON EDISON 88.10\n10/14 TARGET 00012 34.67',
  },
];

const FLAG_ORDER = ['Unknown', 'Duplicate', 'Trial conversion', 'Recurring', 'Normal'];
const MESSAGE_WAIT = ['Reading message…', 'Checking links against blocklists…', 'Writing your verdict…'];

function placeholderFor(mode: CheckMode): string {
  switch (mode) {
    case 'text':
      return 'Paste the text message, email, or DM here…';
    case 'link':
      return "Paste the link you're unsure about…";
    case 'call':
      return 'Paste or type what the caller said…';
    case 'shot':
      return 'Optional: add context about the screenshot…';
    default: {
      const unknown: never = mode;
      return unknown;
    }
  }
}

function verdictClass(verdict: string): string {
  const name = verdict.toLowerCase();
  if (name === 'scam' || name.includes('fraud')) return 'verdict-scam';
  if (name === 'safe' || name.includes('clean')) return 'verdict-safe';
  return 'verdict-review';
}

function linkNote(link: CheckedLink): string {
  if (link.listed) return link.source ? `on ${link.source}` : 'on a phishing blocklist';
  if (link.flags && link.flags.length > 0) return link.flags.join(' · ');
  return 'not on phishing blocklists';
}

async function readImage(file: File): Promise<string> {
  if (file.size > 4_000_000) throw new Error('Screenshot must be under 4 MB.');
  const result = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Could not read that screenshot.'));
    };
    reader.onerror = () => reject(new Error('Could not read that screenshot.'));
    reader.readAsDataURL(file);
  });
  return result;
}

async function runCheck(kind: CheckStep, text: string, image?: string): Promise<MessageResult & StatementResult> {
  const response = await fetch('/api/scamcheck', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(image ? { kind, text, image } : { kind, text }),
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(data.error || 'Something went wrong');
  return data as MessageResult & StatementResult;
}

export function ScamChecker() {
  const [step, setStep] = useState<CheckStep>('message');

  return (
    <div className="check-tool">
      <div className="check-steps" role="tablist" aria-label="What to check">
        <button type="button" role="tab" aria-selected={step === 'message'} className={step === 'message' ? 'on' : ''} onClick={() => setStep('message')}>
          Message
        </button>
        <button type="button" role="tab" aria-selected={step === 'statement'} className={step === 'statement' ? 'on' : ''} onClick={() => setStep('statement')}>
          Statement
        </button>
      </div>
      {step === 'message' ? <MessageCheck /> : <StatementCheck />}
      <p className="check-privacy">
        We don&apos;t store your messages. ScamCheck analyzes them for the result and does not save them to a database.{' '}
        <a href={SCAMCHECK_FAQ_URL}>How a check is handled</a>
      </p>
    </div>
  );
}

function MessageCheck() {
  const [mode, setMode] = useState<CheckMode>('text');
  const [text, setText] = useState('');
  const [image, setImage] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<MessageResult>();

  useEffect(() => {
    if (!busy) return undefined;
    setTick(0);
    const timer = window.setInterval(() => setTick((value) => Math.min(value + 1, MESSAGE_WAIT.length - 1)), 1400);
    return () => window.clearInterval(timer);
  }, [busy]);

  const ready = text.trim().length > 0 || (mode === 'shot' && Boolean(image));

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      setError('');
      setImage(await readImage(file));
    } catch (cause) {
      setImage(undefined);
      setError(cause instanceof Error ? cause.message : 'Could not read that screenshot.');
    }
  }

  async function submit() {
    setError('');
    setResult(undefined);
    setBusy(true);
    try {
      const data = await runCheck('message', text, mode === 'shot' ? image : undefined);
      setResult(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="check-tabs" role="tablist" aria-label="Input type">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            className={mode === item.id ? 'on' : ''}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {mode === 'shot' && (
        <label className="check-drop">
          {image ? 'Tap to change screenshot' : 'Tap to upload a screenshot'}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              void onFile(event.target.files?.[0]);
            }}
          />
          {image && <img src={image} alt="Uploaded screenshot preview" />}
        </label>
      )}
      <textarea
        className="check-input"
        placeholder={placeholderFor(mode)}
        value={text}
        maxLength={6000}
        aria-label="Message to check"
        onChange={(event) => setText(event.target.value)}
      />
      <button type="button" className="check-go" disabled={busy || !ready} onClick={() => void submit()}>
        {busy ? MESSAGE_WAIT[tick] : 'Check this message'}
      </button>
      <SampleRow label="Try a sample:">
        {MESSAGE_SAMPLES.map((sample) => (
          <button
            key={sample.label}
            type="button"
            onClick={() => {
              setMode(sample.mode);
              setText(sample.text);
              setImage(undefined);
              setResult(undefined);
              setError('');
            }}
          >
            {sample.label}
          </button>
        ))}
      </SampleRow>
      {error && <p className="check-error">{error}</p>}
      {result && <MessageVerdict result={result} />}
    </div>
  );
}

function MessageVerdict({ result }: { result: MessageResult }) {
  return (
    <div className="check-result" id="result" tabIndex={-1}>
      <div className={`check-verdict ${verdictClass(result.verdict)}`}>
        <p className="check-verdict-name">{result.verdict}</p>
        <p className="check-verdict-meta">
          <strong>{result.scamType}</strong>
          {Number.isFinite(result.confidence) ? ` · ${Math.round(result.confidence)}% confident` : ''}
        </p>
        <p>{result.summary}</p>
      </div>
      {result.redFlags?.length > 0 && (
        <>
          <h2>Red flags found</h2>
          <ul>
            {result.redFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </>
      )}
      {result.links && result.links.length > 0 && (
        <>
          <h2>Links checked</h2>
          <ul>
            {result.links.map((link) => (
              <li key={link.url}>
                <code>{link.url}</code> — {linkNote(link)}
              </li>
            ))}
          </ul>
        </>
      )}
      {result.nextSteps?.length > 0 && (
        <>
          <h2>Your next steps</h2>
          <ol>
            {result.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </>
      )}
      <p className="check-fine">ScamCheck gives guidance, not a guarantee.</p>
    </div>
  );
}

function StatementCheck() {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<StatementResult>();

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      setError('');
      setImage(await readImage(file));
    } catch (cause) {
      setImage(undefined);
      setError(cause instanceof Error ? cause.message : 'Could not read that screenshot.');
    }
  }

  async function submit() {
    setError('');
    setResult(undefined);
    setBusy(true);
    try {
      setResult(await runCheck('statement', text, image));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  const charges = [...(result?.charges ?? [])].sort((left, right) => {
    const rank = (flag: string) => {
      const index = FLAG_ORDER.indexOf(flag);
      return index === -1 ? FLAG_ORDER.length : index;
    };
    return rank(left.flag) - rank(right.flag);
  });

  return (
    <div>
      <label className="check-drop">
        {image ? 'Change statement screenshot' : 'Upload a statement screenshot (optional)'}
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            void onFile(event.target.files?.[0]);
          }}
        />
        {image && <img src={image} alt="Uploaded statement preview" />}
      </label>
      {image && (
        <SampleRow label="">
          <button type="button" onClick={() => setImage(undefined)}>
            Remove screenshot
          </button>
        </SampleRow>
      )}
      <textarea
        className="check-input"
        placeholder="Paste your statement lines here (date, merchant, amount). Remove your name and full card number first."
        value={text}
        maxLength={8000}
        aria-label="Statement text to check"
        onChange={(event) => setText(event.target.value)}
      />
      <button type="button" className="check-go" disabled={busy || (!text.trim() && !image)} onClick={() => void submit()}>
        {busy ? 'Reading your statement…' : 'Check my charges'}
      </button>
      <SampleRow label="Try a sample:">
        {STATEMENT_SAMPLES.map((sample) => (
          <button
            key={sample.label}
            type="button"
            onClick={() => {
              setImage(undefined);
              setText(sample.text);
              setResult(undefined);
              setError('');
            }}
          >
            {sample.label}
          </button>
        ))}
      </SampleRow>
      {error && <p className="check-error">{error}</p>}
      {result && (
        <div className="check-result" id="result" tabIndex={-1}>
          <div className={`check-verdict ${verdictClass(result.verdict)}`}>
            <p className="check-verdict-name">{result.verdict}</p>
            <p>{result.summary}</p>
          </div>
          {charges.length > 0 && (
            <>
              <h2>Charges found</h2>
              <ul>
                {charges.map((charge) => (
                  <li key={`${charge.date ?? ''}-${charge.merchant}-${charge.amount}`}>
                    <strong>{charge.flag}</strong>: {charge.merchant} {charge.amount}
                    {charge.date ? ` (${charge.date})` : ''} — {charge.reason}
                  </li>
                ))}
              </ul>
            </>
          )}
          {result.nextSteps?.length > 0 && (
            <>
              <h2>What to do next</h2>
              <ol>
                {result.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </>
          )}
          <p className="check-fine">This is guidance, not a guarantee. Only your bank can confirm fraud.</p>
        </div>
      )}
    </div>
  );
}

function SampleRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="check-samples">
      {label && <span>{label}</span>}
      {children}
    </div>
  );
}
