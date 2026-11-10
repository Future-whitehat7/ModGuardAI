export function deliveryConfigured(config) {
  return Boolean(config?.deliverySendEnabled && config?.resendApiKey && config?.resendFrom);
}

async function postEmail(fetchImpl, { apiKey, from, message }) {
  const response = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      attachments: (message.attachments || []).map((file) => ({
        filename: file.filename,
        content: file.contentBase64,
      })),
    }),
  });
  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }
  if (!response.ok) {
    return { ok: false, id: null, error: `resend_${response.status}` };
  }
  return { ok: true, id: typeof payload.id === 'string' ? payload.id : null, error: null };
}

export function createResendMailer({ apiKey, from, fetchImpl = fetch }) {
  return {
    async send(message) {
      try {
        const first = await postEmail(fetchImpl, { apiKey, from, message });
        if (first.ok || (first.error && !first.error.startsWith('resend_5'))) return first;
        return postEmail(fetchImpl, { apiKey, from, message });
      } catch {
        try {
          return await postEmail(fetchImpl, { apiKey, from, message });
        } catch {
          return { ok: false, id: null, error: 'resend_unreachable' };
        }
      }
    },
  };
}
