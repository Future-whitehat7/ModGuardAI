import { getStore } from '@netlify/blobs';

export async function openBlobStore() {
  const store = getStore({ name: 'modguard-orders', consistency: 'strong' });
  return {
    async get(key) {
      return store.get(key, { type: 'json' });
    },
    async set(key, value) {
      await store.setJSON(key, value);
    },
  };
}
