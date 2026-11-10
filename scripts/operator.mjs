/**
 * Optional CLI for the same actions as /operator.
 *
 * The paid webhook starts research and email on its own. Use this only to override or retry.
 *
 * Required in the shell: MODGUARD_API_BASE (site origin) and OPERATOR_TOKEN.
 * Optional: MODGUARD_NAMESPACE=live|preview|test (default preview).
 *
 * Netlify also needs APP_ENV, STRIPE_WEBHOOK_SECRET, STRIPE_PAYMENT_LINK_ID,
 * RESEARCH_TRIGGER_TOKEN, RESEND_API_KEY, RESEND_FROM, DELIVERY_SEND_ENABLED=1,
 * and OPERATOR_EMAIL as a comma-separated list. PUBLIC_SITE_URL is optional.
 *
 * Usage:
 *   node scripts/operator.mjs list
 *   node scripts/operator.mjs <save-evidence|approve|prepare-delivery|retry-research> <orderId> [evidence.json]
 */
import { readFileSync } from 'node:fs';

const base = process.env.MODGUARD_API_BASE || '';
const token = process.env.OPERATOR_TOKEN || '';
const [action, orderId, evidencePath] = process.argv.slice(2);

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

if (!base || !token) {
  fail('Set MODGUARD_API_BASE and OPERATOR_TOKEN in the server environment. The token is not printed.');
}
if (!['list', 'save-evidence', 'approve', 'prepare-delivery', 'retry-research'].includes(action)) {
  fail('Usage: node scripts/operator.mjs list | <save-evidence|approve|prepare-delivery|retry-research> <orderId> [evidence.json]');
}
if (action !== 'list' && !orderId) {
  fail('Usage: node scripts/operator.mjs <save-evidence|approve|prepare-delivery|retry-research> <orderId> [evidence.json]');
}

const body = { action, orderId, namespace: process.env.MODGUARD_NAMESPACE || 'preview' };
if (action === 'save-evidence') {
  if (!evidencePath) fail('save-evidence needs a JSON file written by the operator.');
  const evidence = JSON.parse(readFileSync(evidencePath, 'utf8'));
  if (!evidence.summary || !Array.isArray(evidence.items) || evidence.items.length === 0) {
    fail('The evidence file needs a summary and at least one reviewed item.');
  }
  body.evidence = evidence;
}

const response = await fetch(new URL('/api/operator', base), {
  method: 'POST',
  headers: {
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify(body),
});
const payload = await response.json();
const summary = Array.isArray(payload.orders)
  ? { status: response.status, orders: payload.orders.length }
  : { status: response.status, state: payload.state ?? payload.error ?? payload.result, emailSent: payload.emailSent ?? false };
process.stdout.write(`${JSON.stringify(summary)}\n`);
if (!response.ok) process.exit(1);
