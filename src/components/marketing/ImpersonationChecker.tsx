import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CHECKER_ENDPOINT } from '../../config/platform';

const platforms = ['X', 'Instagram', 'TikTok', 'YouTube', 'Facebook', 'Other'] as const;

interface CheckerResult {
  verdict: string;
  summary?: string;
  redFlags: string[];
  nextSteps: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function readResult(value: unknown): CheckerResult | null {
  if (!isRecord(value) || typeof value.verdict !== 'string') return null;
  return {
    verdict: value.verdict,
    summary: typeof value.summary === 'string' ? value.summary : undefined,
    redFlags: asStrings(value.redFlags),
    nextSteps: asStrings(value.nextSteps),
  };
}

function isLikelyFake(verdict: string) {
  return /fake|scam/i.test(verdict);
}

export function ImpersonationChecker() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<CheckerResult | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const suspect = String(data.get('suspect') ?? '').trim();
    const realHandle = String(data.get('realHandle') ?? '').trim();
    const platform = String(data.get('platform') ?? '').trim();
    const notes = String(data.get('notes') ?? '').trim();
    setStatus('sending');
    setError('');
    setResult(null);
    try {
      const response = await fetch(CHECKER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspect, realHandle, platform, notes }),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message = isRecord(payload) && typeof payload.error === 'string' ? payload.error : 'The checker did not return a verdict.';
        throw new Error(message);
      }
      const parsed = readResult(payload);
      if (!parsed) throw new Error('The checker returned a response this page could not read.');
      setResult(parsed);
      setStatus('done');
    } catch (cause) {
      setStatus('error');
      setError(cause instanceof Error ? cause.message : 'The checker did not respond.');
    }
  };

  return (
    <div>
      <form className="glass checker-form" onSubmit={onSubmit}>
        <div className="grid gap-4">
          <label className="block text-sm text-frost" htmlFor="suspect">
            Suspicious handle or profile URL
          </label>
          <input id="suspect" name="suspect" className="field" required autoComplete="off" placeholder="@account or https://" />
          <label className="block text-sm text-frost" htmlFor="realHandle">
            Real handle or profile URL
          </label>
          <input id="realHandle" name="realHandle" className="field" autoComplete="off" placeholder="The account you believe is genuine" />
          <label className="block text-sm text-frost" htmlFor="platform">
            Platform
          </label>
          <select id="platform" name="platform" className="field" defaultValue="X">
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
          <label className="block text-sm text-frost" htmlFor="checker-notes">
            Notes
          </label>
          <textarea id="checker-notes" name="notes" className="field min-h-24 py-3" placeholder="What the account is asking people to do" />
        </div>
        <button className="btn-accent mt-4" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Checking…' : 'Check this account'}
        </button>
      </form>

      {status === 'error' && (
        <p className="mt-4 text-ice" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="glass mt-4 p-6" aria-live="polite">
          <p className="eyebrow">Verdict</p>
          <p className={`mt-3 font-mono text-2xl ${isLikelyFake(result.verdict) ? 'verdict-fake' : 'text-ice'}`}>
            {result.verdict}
          </p>
          {result.summary && <p className="measure mt-4 text-ice">{result.summary}</p>}
          {result.redFlags.length > 0 && (
            <>
              <h3 className="eyebrow mt-6">Red flags</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-ice">
                {result.redFlags.map((flag) => (
                  <li key={flag}>{flag}</li>
                ))}
              </ul>
            </>
          )}
          {result.nextSteps.length > 0 && (
            <>
              <h3 className="eyebrow mt-6">Next steps</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-ice">
                {result.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </>
          )}
          <p className="mt-6 text-frost">A free read of the handle is not a sweep of the account.</p>
          <Link className="btn-accent mt-4" to="/impersonation-check#intake">
            Start intake for the manual sweep
          </Link>
        </div>
      )}
    </div>
  );
}
