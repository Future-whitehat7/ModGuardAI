import { writeFile } from 'node:fs/promises';
import { collectThreats } from '../netlify/functions/lib/collect.mjs';

const payload = await collectThreats();
await writeFile('public/threats.json', JSON.stringify(payload));
console.log(`threats: ${payload.items.length} headlines, ${payload.stats.length} stats`);
