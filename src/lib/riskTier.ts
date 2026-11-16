export type RiskTierId = 'low-signal' | 'suspicious' | 'high-risk' | 'unchecked';

export interface RiskSignals {
  similarity?: number | null;
  confidence?: string | null;
  httpStatus?: number | null;
  verdict?: string | null;
}

export interface RiskTier {
  id: RiskTierId;
  label: 'Low signal' | 'Suspicious' | 'High risk' | "Couldn't check";
}

const UNREAD_CONFIDENCE = new Set(['none', 'unreadable', 'blocked', 'timeout', 'timed out', 'error']);

const UNREAD_VERDICT = /\b(could(?:\s*n['’]t| not)|cannot|unavailable|blocked|timed?\s*out|timeout|unreadable|failed to read)\b/i;

function readable(signals: RiskSignals) {
  const status = signals.httpStatus;
  if (typeof status === 'number' && (status < 200 || status >= 400)) return false;
  const confidence = (signals.confidence ?? '').trim().toLowerCase();
  if (UNREAD_CONFIDENCE.has(confidence)) return false;
  const verdict = signals.verdict ?? '';
  if (verdict && UNREAD_VERDICT.test(verdict)) return false;
  if (typeof status === 'number' && status >= 200 && status < 400) return true;
  if (verdict.trim()) return true;
  if ((confidence === 'medium' || confidence === 'high') && typeof signals.similarity === 'number') return true;
  return false;
}

function indicatesFake(verdict: string) {
  const text = verdict.toLowerCase();
  if (/\b(not a scam|no scam|genuine|authentic|legitimate|likely real)\b/.test(text)) return false;
  return /\b(fake|scam|impersonat)/.test(text);
}

function indicatesSuspicious(verdict: string) {
  return /\b(suspicious|warning|unclear|mismatch|similar)\b/i.test(verdict);
}

/** Warning sign from fields we actually have. A page we could not read is never "Low signal". */
export function riskTier(signals: RiskSignals): RiskTier {
  if (!readable(signals)) return { id: 'unchecked', label: "Couldn't check" };
  const similarity = typeof signals.similarity === 'number' ? signals.similarity : null;
  const verdict = signals.verdict ?? '';
  if (indicatesFake(verdict) || (similarity !== null && similarity >= 0.72)) {
    return { id: 'high-risk', label: 'High risk' };
  }
  if (indicatesSuspicious(verdict) || (similarity !== null && similarity >= 0.4)) {
    return { id: 'suspicious', label: 'Suspicious' };
  }
  return { id: 'low-signal', label: 'Low signal' };
}
