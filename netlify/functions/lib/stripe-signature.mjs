import { createHmac, timingSafeEqual } from 'node:crypto';

const TOLERANCE_SECONDS = 5 * 60;

function hexHmac(secret, payload) {
  return createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

function safeEqualHex(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length || left.length === 0) {
    return false;
  }
  return timingSafeEqual(Buffer.from(left, 'utf8'), Buffer.from(right, 'utf8'));
}

/**
 * Stripe signs `${timestamp}.${rawBody}` with the webhook secret.
 * The raw body must be the exact request bytes, not a re-serialized object.
 */
export function verifyStripeSignature(rawBody, header, secret, nowMs) {
  if (!secret || typeof rawBody !== 'string' || typeof header !== 'string') {
    return { ok: false, reason: 'missing' };
  }
  const parts = new Map();
  for (const piece of header.split(',')) {
    const eq = piece.indexOf('=');
    if (eq === -1) continue;
    const key = piece.slice(0, eq).trim();
    const value = piece.slice(eq + 1).trim();
    if (!parts.has(key)) parts.set(key, []);
    parts.get(key).push(value);
  }
  const timestamps = parts.get('t') ?? [];
  const signatures = parts.get('v1') ?? [];
  if (timestamps.length !== 1 || signatures.length === 0) return { ok: false, reason: 'malformed' };
  const timestamp = Number(timestamps[0]);
  if (!Number.isFinite(timestamp)) return { ok: false, reason: 'malformed' };
  const age = Math.abs(nowMs / 1000 - timestamp);
  if (age > TOLERANCE_SECONDS) return { ok: false, reason: 'stale' };
  const expected = hexHmac(secret, `${timestamps[0]}.${rawBody}`);
  const match = signatures.some((signature) => safeEqualHex(signature, expected));
  return match ? { ok: true } : { ok: false, reason: 'mismatch' };
}
