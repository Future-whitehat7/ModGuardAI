const FEEDS = [
  ['The Hacker News', 'https://feeds.feedburner.com/TheHackersNews', 'https://thehackernews.com/'],
  ['BleepingComputer', 'https://www.bleepingcomputer.com/feed/', 'https://www.bleepingcomputer.com/'],
  ['CISA', 'https://www.cisa.gov/cybersecurity-advisories/all.xml', 'https://www.cisa.gov/news-events/cybersecurity-advisories'],
];

const AI_TITLE = /\b(AI|LLM|LLMs|ChatGPT|OpenAI|Claude|Gemini|deepfake|machine learning|generative)\b/i;
const DAY = 86400000;

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
    const summaryText = tag(block, 'description') || tag(block, 'summary') || tag(block, 'content');
    const summary = summaryText.length > 420 ? `${summaryText.slice(0, 417).trim()}…` : summaryText;
    return {
      title,
      url,
      source,
      summary,
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

  if (feodoText) {
    try {
      const rows = JSON.parse(feodoText);
      const online = Array.isArray(rows) ? rows.filter((row) => row.status === 'online').length : 0;
      stats.push({
        label: 'Online botnet C2 hosts',
        value: online,
        source: 'abuse.ch Feodo Tracker',
        url: 'https://feodotracker.abuse.ch/',
        asOf,
      });
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

  return { asOf, stats, items, skipped };
}
