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
    async keys(prefix) {
      const found = [];
      let cursor;
      do {
        const page = await store.list({ prefix, cursor });
        for (const blob of page.blobs ?? []) found.push(blob.key);
        cursor = page.nextCursor || undefined;
      } while (cursor);
      return found;
    },
  };
}
