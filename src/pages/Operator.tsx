import { useState } from 'react';
import type { FormEvent } from 'react';

const TOKEN_KEY = 'operator-token';

interface OrderRow {
  orderId: string;
  namespace: string;
  tier: string;
  state: string;
  email: string;
  name: string;
  research: string;
  emailStatus: string;
  emailError: string | null;
  operatorStatus: string;
}

interface OrderDetail {
  orderId: string;
  state: string;
  intake: Record<string, unknown>;
  evidence: { summary?: string; items?: unknown[] } | null;
  research: { status?: string; error?: string } | null;
  delivery: {
    results?: { status?: string; error?: string | null; sent?: boolean } | null;
    operator?: { status?: string; recipients?: { to: string; status: string; error: string | null }[] } | null;
    confirmation?: { status?: string } | null;
  };
}

function readToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? '';
  } catch {
    return '';
  }
}

async function postOperator(token: string, body: Record<string, unknown>) {
  const response = await fetch('/api/operator', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const payload: unknown = await response.json();
  return { ok: response.ok, status: response.status, payload };
}

export const Operator = () => {
  const [token, setToken] = useState(readToken);
  const [namespace, setNamespace] = useState('live');
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [summary, setSummary] = useState('');
  const [itemsText, setItemsText] = useState('[\n  {"url":"https://example.com/account","finding":""}\n]');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const remember = (value: string) => {
    setToken(value);
    try {
      sessionStorage.setItem(TOKEN_KEY, value);
    } catch {
      // The token stays in this form if storage is blocked.
    }
  };

  const load = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!token.trim()) {
      setMessage('Enter the operator token.');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      const result = await postOperator(token.trim(), { action: 'list', namespace });
      const payload = result.payload;
      if (!result.ok || !payload || typeof payload !== 'object' || !('orders' in payload) || !Array.isArray(payload.orders)) {
        setMessage(`The order list was not loaded (${result.status}).`);
        setOrders([]);
        return;
      }
      setOrders(payload.orders as OrderRow[]);
      setMessage(payload.orders.length === 0 ? 'No paid orders in this namespace.' : '');
    } catch {
      setMessage('The order list was not loaded.');
    } finally {
      setBusy(false);
    }
  };

  const openOrder = async (orderId: string) => {
    setBusy(true);
    setMessage('');
    try {
      const result = await postOperator(token.trim(), { action: 'get', namespace, orderId });
      const payload = result.payload;
      if (!result.ok || !payload || typeof payload !== 'object' || !('intake' in payload)) {
        setMessage(`The order was not loaded (${result.status}).`);
        return;
      }
      const next = payload as OrderDetail;
      setDetail(next);
      setSummary(next.evidence?.summary ?? '');
      setItemsText(JSON.stringify(next.evidence?.items ?? [], null, 2));
    } catch {
      setMessage('The order was not loaded.');
    } finally {
      setBusy(false);
    }
  };

  const run = async (action: string, extra: Record<string, unknown> = {}) => {
    if (!detail) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await postOperator(token.trim(), { action, namespace, orderId: detail.orderId, ...extra });
      const payload = result.payload;
      const error = payload && typeof payload === 'object' && 'error' in payload ? String(payload.error) : '';
      if (!result.ok) {
        setMessage(`${action} was not saved (${result.status}${error ? `: ${error}` : ''}).`);
        return;
      }
      await openOrder(detail.orderId);
      setMessage(`${action} saved.`);
    } catch {
      setMessage(`${action} was not saved.`);
    } finally {
      setBusy(false);
    }
  };

  const saveEvidence = () => {
    let items: unknown;
    try {
      items = JSON.parse(itemsText);
    } catch {
      setMessage('Evidence items must be a JSON array.');
      return;
    }
    if (!Array.isArray(items)) {
      setMessage('Evidence items must be a JSON array.');
      return;
    }
    void run('save-evidence', { evidence: { summary, items } });
  };

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Operator</p>
      <h1 className="display mt-4 text-5xl text-ice">Paid orders</h1>
      <p className="measure mt-6 text-lg text-frost">
        Payment already starts the research and the customer email. This page is an optional override: read a paid order, replace the notes, or retry a send that failed.
      </p>
      <form className="glass mt-8 p-6" onSubmit={load}>
        <label className="block text-sm text-frost" htmlFor="operator-token">
          Operator token
        </label>
        <input
          id="operator-token"
          className="field mt-2"
          type="password"
          autoComplete="current-password"
          value={token}
          onChange={(event) => remember(event.target.value)}
        />
        <label className="mt-4 block text-sm text-frost" htmlFor="operator-namespace">
          Namespace
        </label>
        <select
          id="operator-namespace"
          className="field mt-2"
          value={namespace}
          onChange={(event) => setNamespace(event.target.value)}
        >
          <option value="live">live</option>
          <option value="preview">preview</option>
          <option value="test">test</option>
        </select>
        <button className="btn-accent mt-4" type="submit" disabled={busy}>
          Load paid orders
        </button>
      </form>
      {message ? <p className="mt-4 text-frost" role="status">{message}</p> : null}
      <ul className="mt-6 space-y-3">
        {orders.map((order) => (
          <li key={order.orderId}>
            <button className="glass w-full p-4 text-left" type="button" onClick={() => void openOrder(order.orderId)}>
              <span className="text-ice">{order.name || 'Unnamed'} · {order.email}</span>
              <span className="mt-1 block text-sm text-frost">
                {order.orderId} · {order.state} · research {order.research} · email {order.emailStatus}
                {order.emailError ? ` (${order.emailError})` : ''} · operator mail {order.operatorStatus}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {detail ? (
        <section className="glass mt-8 p-6">
          <h2 className="display text-3xl text-ice">{detail.orderId}</h2>
          <p className="mt-2 text-sm text-frost">
            State {detail.state}. Customer email {detail.delivery.results?.status || 'not_sent'}
            {detail.delivery.results?.error ? ` (${detail.delivery.results.error})` : ''}.
            Confirmation {detail.delivery.confirmation?.status || 'not_sent'}.
            Operator copy {detail.delivery.operator?.status || 'not_sent'}.
          </p>
          {detail.delivery.operator?.recipients ? (
            <ul className="mt-3 text-sm text-frost">
              {detail.delivery.operator.recipients.map((recipient) => (
                <li key={recipient.to}>
                  {recipient.to}: {recipient.status}{recipient.error ? ` (${recipient.error})` : ''}
                </li>
              ))}
            </ul>
          ) : null}
          <pre className="mt-4 overflow-x-auto text-sm text-ice">{JSON.stringify(detail.intake, null, 2)}</pre>
          <label className="mt-4 block text-sm text-frost" htmlFor="operator-summary">
            Summary
          </label>
          <textarea id="operator-summary" className="field mt-2 min-h-24 py-3" value={summary} onChange={(event) => setSummary(event.target.value)} />
          <label className="mt-4 block text-sm text-frost" htmlFor="operator-items">
            Evidence items JSON
          </label>
          <textarea id="operator-items" className="field mt-2 min-h-40 py-3 font-mono text-sm" value={itemsText} onChange={(event) => setItemsText(event.target.value)} />
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="btn-accent" type="button" disabled={busy} onClick={saveEvidence}>Save evidence</button>
            <button className="btn-ghost" type="button" disabled={busy} onClick={() => void run('approve')}>Approve</button>
            <button className="btn-ghost" type="button" disabled={busy} onClick={() => void run('prepare-delivery', { resend: true })}>Prepare delivery</button>
            <button className="btn-ghost" type="button" disabled={busy} onClick={() => void run('retry-research')}>Retry research</button>
          </div>
        </section>
      ) : null}
    </article>
  );
};
