const FEEDS = [
  ['The Hacker News', 'https://feeds.feedburner.com/TheHackersNews', 'https://thehackernews.com/'],
  ['BleepingComputer', 'https://www.bleepingcomputer.com/feed/', 'https://www.bleepingcomputer.com/'],
  ['CISA', 'https://www.cisa.gov/cybersecurity-advisories/all.xml', 'https://www.cisa.gov/news-events/cybersecurity-advisories'],
];

const PLACES = [
  ['US', 'United States', -97, 38], ['GB', 'United Kingdom', -2, 54], ['UA', 'Ukraine', 32, 49],
  ['RU', 'Russia', 90, 60], ['CN', 'China', 104, 35], ['IR', 'Iran', 53, 32], ['IL', 'Israel', 35, 31],
  ['IN', 'India', 79, 22], ['PK', 'Pakistan', 69, 30], ['KP', 'North Korea', 127, 40],
  ['KR', 'South Korea', 128, 36], ['JP', 'Japan', 138, 36], ['TW', 'Taiwan', 121, 24],
  ['AU', 'Australia', 134, -25], ['CA', 'Canada', -106, 56], ['MX', 'Mexico', -102, 23],
  ['BR', 'Brazil', -52, -10], ['DE', 'Germany', 10, 51], ['FR', 'France', 2, 46],
  ['IT', 'Italy', 12, 43], ['ES', 'Spain', -4, 40], ['NL', 'Netherlands', 5, 52],
  ['PL', 'Poland', 20, 52], ['TR', 'Turkey', 35, 39], ['SA', 'Saudi Arabia', 45, 24],
  ['AE', 'United Arab Emirates', 54, 24], ['SG', 'Singapore', 104, 1], ['VN', 'Vietnam', 108, 14],
  ['ID', 'Indonesia', 118, -2], ['NG', 'Nigeria', 8, 10], ['ZA', 'South Africa', 25, -29],
  ['EG', 'Egypt', 30, 27], ['KE', 'Kenya', 38, 0], ['PH', 'Philippines', 122, 12],
];

const AI_TITLE = /\b(AI|LLM|LLMs|ChatGPT|OpenAI|Claude|Gemini|deepfake|machine learning|generative)\b/i;
const DAY = 86400000;

function point(lon, lat) {
  return { x: ((lon + 180) / 360) * 100, y: ((90 - lat) / 180) * 50 };
}

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

async function load(url, { method = 'GET', body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      method,
      body,
      signal: controller.signal,
      headers: { 'user-agent': 'ModGuardAI-Site/1.0', accept: 'application/json,application/rss+xml,text/xml,*/*' },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function feedItems(xml, source) {
  if (!xml) return [];
  const parts = /<entry[\s>]/i.test(xml)
    ? xml.split(/<entry[\s>]/i).slice(1)
    : xml.split(/<item[\s>]/i).slice(1);
  return parts.map((block) => {
    const title = tag(block, 'title');
    const url = linkOf(block);
    const rawDate = tag(block, 'pubDate') || tag(block, 'updated') || tag(block, 'published');
    const time = Date.parse(rawDate);
    return {
      title,
      url,
      source,
      date: Number.isNaN(time) ? rawDate : new Date(time).toISOString().slice(0, 10),
      time: Number.isNaN(time) ? null : time,
      ai: AI_TITLE.test(title),
    };
  }).filter((item) => item.title && item.url.startsWith('http'));
}

export async function collectThreats(now = Date.now()) {
  const asOf = new Date(now).toISOString();
  const weekStart = now - 7 * DAY;
  const monthStart = new Date(now - 30 * DAY).toISOString().slice(0, 10);
  const nvdStart = new Date(weekStart).toISOString().slice(0, 19);
  const nvdEnd = new Date(now).toISOString().slice(0, 19);
  const stats = [];
  const skipped = [];

  const [kevText, nvdText, feodoText, ...feeds] = await Promise.all([
    load('https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'),
    load(`https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=1&startIndex=0&pubStartDate=${nvdStart}.000&pubEndDate=${nvdEnd}.999`),
    load('https://feodotracker.abuse.ch/downloads/ipblocklist.json'),
    ...FEEDS.map(([, url]) => load(url)),
  ]);

  if (kevText) {
    try {
      const kev = JSON.parse(kevText);
      const rows = Array.isArray(kev.vulnerabilities) ? kev.vulnerabilities : [];
      const total = Number.isInteger(kev.count) ? kev.count : rows.length;
      const added = rows.filter((row) => typeof row.dateAdded === 'string' && row.dateAdded >= monthStart).length;
      const released = typeof kev.dateReleased === 'string' ? kev.dateReleased : asOf;
      stats.push({
        label: 'Known exploited vulnerabilities',
        value: total,
        source: 'CISA KEV',
        url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
        asOf: released,
      });
      stats.push({
        label: `KEV entries added since ${monthStart}`,
        value: added,
        source: 'CISA KEV dateAdded',
        url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
        asOf: released,
      });
    } catch {
      skipped.push('CISA KEV');
    }
  } else skipped.push('CISA KEV');

  if (nvdText) {
    try {
      const nvd = JSON.parse(nvdText);
      if (Number.isInteger(nvd.totalResults)) {
        stats.push({
          label: 'CVEs published in the last 7 days',
          value: nvd.totalResults,
          source: 'NVD API 2.0',
          url: 'https://services.nvd.nist.gov/rest/json/cves/2.0',
          asOf: typeof nvd.timestamp === 'string' ? nvd.timestamp : asOf,
        });
      }
    } catch {
      skipped.push('NVD');
    }
  } else skipped.push('NVD');

  const pulses = [];
  if (feodoText) {
    try {
      const rows = JSON.parse(feodoText);
      const online = Array.isArray(rows) ? rows.filter((row) => row.status === 'online' && typeof row.country === 'string' && row.country) : [];
      stats.push({
        label: 'Online botnet C2 hosts with a country field',
        value: online.length,
        source: 'abuse.ch Feodo Tracker',
        url: 'https://feodotracker.abuse.ch/',
        asOf,
      });
      const grouped = new Map();
      for (const row of online) {
        const code = row.country.toUpperCase();
        const bucket = grouped.get(code) ?? [];
        bucket.push(row.malware);
        grouped.set(code, bucket);
      }
      for (const [code, names] of grouped) {
        const place = PLACES.find(([iso]) => iso === code);
        const located = place ? point(place[2], place[3]) : { x: null, y: null };
        pulses.push({
          country: place ? place[1] : code,
          code,
          count: names.length,
          x: located.x,
          y: located.y,
          source: 'abuse.ch Feodo Tracker',
          url: 'https://feodotracker.abuse.ch/',
          asOf,
        });
      }
    } catch {
      skipped.push('Feodo Tracker');
    }
  } else skipped.push('Feodo Tracker');

  const items = [];
  FEEDS.forEach(([source, , home], index) => {
    const parsed = feedItems(feeds[index], source);
    if (!parsed.length) {
      skipped.push(source);
      return;
    }
    const dated = parsed.filter((item) => item.time != null);
    if (dated.length) {
      stats.push({
        label: 'RSS items dated in the last 7 days',
        value: dated.filter((item) => item.time >= weekStart).length,
        source,
        url: home,
        asOf,
      });
    }
    items.push(...parsed.slice(0, 4).map(({ time, ...item }) => item));
  });

  skipped.push('URLhaus and ThreatFox require an API key, so they are omitted.');

  return {
    asOf,
    stats,
    pulses,
    items,
    dots: PLACES.map(([, name, lon, lat]) => ({ name, ...point(lon, lat) })),
    skipped,
  };
}
