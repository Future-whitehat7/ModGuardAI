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
if (!['save-evidence', 'approve', 'prepare-delivery'].includes(action) || !orderId) {
  fail('Usage: node scripts/operator.mjs <save-evidence|approve|prepare-delivery> <orderId> [evidence.json]');
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
process.stdout.write(`${JSON.stringify({ status: response.status, state: payload.state ?? payload.error, emailSent: payload.emailSent ?? false })}\n`);
if (!response.ok) process.exit(1);
