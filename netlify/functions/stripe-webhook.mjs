import { webhookFunction } from './lib/http.mjs';

export default webhookFunction;

export const config = { path: '/api/stripe-webhook' };
