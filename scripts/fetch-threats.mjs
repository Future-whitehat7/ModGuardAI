import { writeFile } from 'node:fs/promises';

const FEEDS = [
  ['The Hacker News', 'https://feeds.feedburner.com/TheHackersNews'],
  ['BleepingComputer', 'https://www.bleepingcomputer.com/feed/'],
  ['CISA', 'https://www.cisa.gov/cybersecurity-advisories/all.xml'],
];

const COUNTRIES = [
  ['United States', -97, 38], ['United Kingdom', -2, 54], ['Ukraine', 32, 49],
  ['Russia', 90, 60], ['China', 104, 35], ['Iran', 53, 32], ['Israel', 35, 31],
  ['India', 79, 22], ['Pakistan', 69, 30], ['North Korea', 127, 40],
  ['South Korea', 128, 36], ['Japan', 138, 36], ['Taiwan', 121, 24],
  ['Australia', 134, -25], ['Canada', -106, 56], ['Mexico', -102, 23],
  ['Brazil', -52, -10], ['Germany', 10, 51], ['France', 2, 46],
  ['Italy', 12, 43], ['Spain', -4, 40], ['Netherlands', 5, 52],
  ['Poland', 20, 52], ['Turkey', 35, 39], ['Saudi Arabia', 45, 24],
  ['United Arab Emirates', 54, 24], ['Singapore', 104, 1], ['Vietnam', 108, 14],
  ['Indonesia', 118, -2], ['Nigeria', 8, 10], ['South Africa', 25, -29],
  ['Egypt', 30, 27], ['Kenya', 38, 0], ['Philippines', 122, 12],
];

function decode(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decode(match[1]) : '';
}

function linkOf(block) {
  const text = tag(block, 'link');
  if (text.startsWith('http')) return text;
  const href = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  return href ? href[1] : '';
}

function countryNamed(text) {
  return COUNTRIES
    .filter(([name]) => new RegExp(`\\b${name}\\b`, 'i').test(text))
    .sort((a, b) => b[0].length - a[0].length)[0] || null;
}

function countryFrom(title, summary) {
  const titled = countryNamed(title);
  if (titled) return titled;
  const deployed = summary.match(/Countries\/Areas Deployed:\s*([^.]{0,80})/i);
  if (!deployed) return null;
  const value = deployed[1].trim();
  if (/worldwide|global|multiple|,|;/i.test(value)) return null;
  return countryNamed(value);
}

function parse(xml, source) {
  const parts = /<entry[\s>]/i.test(xml)
    ? xml.split(/<entry[\s>]/i).slice(1)
    : xml.split(/<item[\s>]/i).slice(1);
  return parts.slice(0, 4).map((block) => {
    const title = tag(block, 'title');
    const url = linkOf(block);
    const rawDate = tag(block, 'pubDate') || tag(block, 'updated') || tag(block, 'published');
    const summary = tag(block, 'description') || tag(block, 'summary');
    const named = countryFrom(title, summary);
    const parsed = Date.parse(rawDate);
    return {
      title,
      url,
      source,
      date: Number.isNaN(parsed) ? rawDate : new Date(parsed).toISOString().slice(0, 10),
      country: named ? named[0] : null,
      x: named ? ((named[1] + 180) / 360) * 100 : null,
      y: named ? ((90 - named[2]) / 180) * 50 : null,
    };
  }).filter((item) => item.title && item.url.startsWith('http'));
}

async function load(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { 'user-agent': 'ModGuardAI-Site/1.0' } });
    return response.ok ? await response.text() : '';
  } catch {
    return '';
  } finally {
    clearTimeout(timer);
  }
}

const batches = await Promise.all(FEEDS.map(async ([source, url]) => parse(await load(url), source)));
const items = batches.flat().slice(0, 12);
const dots = COUNTRIES.map(([name, lon, lat]) => ({
  name,
  x: ((lon + 180) / 360) * 100,
  y: ((90 - lat) / 180) * 50,
}));

await writeFile('public/threats.json', JSON.stringify({ items, dots }));
console.log(`threats: ${items.length}`);
