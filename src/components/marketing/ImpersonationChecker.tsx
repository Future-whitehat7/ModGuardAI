import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CHECKER_ENDPOINT } from '../../config/platform';
import { riskTier } from '../../lib/riskTier';

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

const CHECK_STAGES = [
  'Reading the profile details...',
  'Comparing against known impersonation patterns...',
  'Preparing your summary...',
] as const;

function useCheckStage(active: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!active) {
      setIndex(0);
      return undefined;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % CHECK_STAGES.length);
    }, 900);
    return () => window.clearInterval(timer);
  }, [active]);
  return CHECK_STAGES[index];
}

export function ImpersonationChecker() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<CheckerResult | null>(null);
  const stage = useCheckStage(status === 'sending');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const suspect = String(data.get('suspect') ?? '').trim();
    const realHandle = String(data.get('realHandle') ?? '').trim();
    const platform = String(data.get('platform') ?? '').trim();
    const notes = String(data.get('notes') ?? '').trim();
    if (suspect.length > 500 || realHandle.length > 500 || notes.length > 2000) {
      setStatus('error');
      setError('That is too long to check here. Shorten it and try again.');
      return;
    }
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
        {status === 'sending' ? <p className="check-stage" role="status">{stage}</p> : null}
      </form>

      {status === 'error' && (
        <p className="mt-4 text-ice" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="glass mt-4 p-6" aria-live="polite">
          <p className={`risk-badge risk-${riskTier({ verdict: result.verdict }).id}`}>
            {riskTier({ verdict: result.verdict }).label}
          </p>
          <p className="eyebrow mt-4">Verdict</p>
          <p className="num mt-3 text-2xl">
            {result.verdict}
          </p>
          <p className="mt-3 text-sm">A warning sign from this free read. Not a determination. The platform decides, and this does not remove an account.</p>
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
          <p className="mt-6 text-frost">A free read of one handle is not the paid check. The paid check verifies the accounts and ads you send.</p>
          <Link className="btn-ghost mt-4" to="/impersonation-check#intake">
            Start my check
          </Link>
        </div>
      )}
    </div>
  );
}
