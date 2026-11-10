# ModGuard AI

Marketing site for ModGuard AI, an AI safety studio. The only live product is [ScamCheck](https://scamcheck.modguardai.org), a free AI scam checker for messages, links, and screenshots of texts or emails.

## Scripts

```bash
npm install
npm run dev
npm run build
```

The production build is deployed on Netlify.

## Impersonation Check

A verified $199 payment starts automated public-page research in a background function and emails the buyer a short note plus a PDF. `OPERATOR_EMAIL` is a comma-separated list; each address gets its own copy. `/operator` is an optional override.

Set these in the Netlify UI, separately for preview and production. Do not commit values.

- `APP_ENV` (`production` on the production site)
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PAYMENT_LINK_ID`
- `OPERATOR_TOKEN`
- `OPERATOR_EMAIL`
- `RESEARCH_TRIGGER_TOKEN`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `DELIVERY_SEND_ENABLED` (`1` to send)
- `PUBLIC_SITE_URL` (optional)
- `ALLOW_TEST_NAMESPACE` (preview only)
- `UPSELLS_ENABLED` (`1` only after a real offer with `placeholder: false` is in the catalog)
