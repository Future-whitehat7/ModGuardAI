import { writeFile } from 'node:fs/promises';
import { collectBuzz } from '../netlify/functions/lib/buzz.mjs';
import { collectThreats } from '../netlify/functions/lib/collect.mjs';

const payload = await collectThreats();
if (payload.items.length) {
  await writeFile('public/threats.json', JSON.stringify(payload));
}
console.log(`threats: ${payload.items.length} headlines, ${payload.stats.length} stats`);

try {
  const buzz = await collectBuzz(process.env);
  if (buzz.posts.length) await writeFile('public/buzz.json', JSON.stringify(buzz));
  console.log(`buzz: ${buzz.posts.length} posts, live ${buzz.live.join(', ') || 'none'}`);
} catch {
  console.log('buzz: skipped');
}
