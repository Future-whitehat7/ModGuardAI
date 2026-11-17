/** Public posts only. Nothing here is written by ModGuard, and nothing is stored. */

const QUERIES = ['phishing', 'ransomware', 'data breach', 'deepfake scam'];

function plain(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function excerpt(value, max = 280) {
  const text = plain(value);
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function count(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function post(fields) {
  const text = excerpt(fields.text);
  const author = plain(fields.author).replace(/^@/, '');
  const url = typeof fields.url === 'string' ? fields.url.trim() : '';
  if (!text || !author || author === '[deleted]' || !url.startsWith('https://')) return null;
  const row = {
    platform: fields.platform,
    author,
    text,
    url,
    time: typeof fields.time === 'string' ? fields.time : '',
  };
  const likes = count(fields.likes);
  const replies = count(fields.replies);
  const reposts = count(fields.reposts);
  if (likes !== undefined) row.likes = likes;
  if (replies !== undefined) row.replies = replies;
  if (reposts !== undefined) row.reposts = reposts;
  return row;
}

export function fromBluesky(payload) {
  const posts = Array.isArray(payload?.posts) ? payload.posts : [];
  return posts.flatMap((item) => {
    const uri = typeof item?.uri === 'string' ? item.uri : '';
    const key = uri.split('/').pop();
    const handle = item?.author?.handle;
    const row = post({
      platform: 'Bluesky',
      author: handle,
      text: item?.record?.text,
      url: handle && key ? `https://bsky.app/profile/${handle}/post/${key}` : '',
      time: typeof item?.indexedAt === 'string' ? item.indexedAt : '',
      likes: item?.likeCount,
      replies: item?.replyCount,
      reposts: item?.repostCount,
    });
    if (row && typeof item?.author?.avatar === 'string' && item.author.avatar.startsWith('https://')) {
      row.avatar = item.author.avatar;
    }
    return row ? [row] : [];
  });
}

export function fromReddit(payload) {
  const children = Array.isArray(payload?.data?.children) ? payload.data.children : [];
  return children.flatMap((child) => {
    const data = child?.data ?? {};
    const permalink = typeof data.permalink === 'string' ? data.permalink : '';
    const body = data.selftext || data.title;
    const row = post({
      platform: 'Reddit',
      author: data.author,
      text: data.title && data.selftext ? `${data.title}. ${data.selftext}` : body,
      url: permalink.startsWith('/') ? `https://www.reddit.com${permalink}` : '',
      time: typeof data.created_utc === 'number' ? new Date(data.created_utc * 1000).toISOString() : '',
      likes: data.score,
      replies: data.num_comments,
    });
    return row ? [row] : [];
  });
}

export function fromHackerNews(payload) {
  const hits = Array.isArray(payload?.hits) ? payload.hits : [];
  return hits.flatMap((hit) => {
    const story = plain(hit?.story_title);
    if (/who is hiring|freelancer\? seeking|jobs?\b/i.test(story)) return [];
    const id = hit?.objectID || hit?.story_id;
    const row = post({
      platform: 'Hacker News',
      author: hit?.author,
      text: story ? `${story}. ${hit?.comment_text ?? ''}` : hit?.comment_text,
      url: id ? `https://news.ycombinator.com/item?id=${id}` : '',
      time: typeof hit?.created_at === 'string' ? hit.created_at : '',
      likes: hit?.points,
    });
    return row ? [row] : [];
  });
}

export function fromX(payload) {
  const tweets = Array.isArray(payload?.data) ? payload.data : [];
  const users = new Map((payload?.includes?.users ?? []).map((user) => [user.id, user.username]));
  return tweets.flatMap((tweet) => {
    const username = users.get(tweet.author_id);
    const metrics = tweet.public_metrics ?? {};
    const row = post({
      platform: 'X',
      author: username,
      text: tweet.text,
      url: username && tweet.id ? `https://x.com/${username}/status/${tweet.id}` : '',
      time: typeof tweet.created_at === 'string' ? tweet.created_at : '',
      likes: metrics.like_count,
      replies: metrics.reply_count,
      reposts: metrics.retweet_count,
    });
    return row ? [row] : [];
  });
}

async function readJson(url, headers) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json', 'user-agent': 'ModGuardAI-Site/1.0', ...headers },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const BUZZ_TOPIC = /\b(cyber\w*|scams?|phish\w*|frauds?|deepfakes?|privacy|malware|ransom\w*|breach\w*|security|credentials?|impersonat\w*|2fa|mfa|hack\w*)\b/i;
const BUZZ_BOT = /\.bot\b|trending words|top 10 trending/i;
const BUZZ_PROMO = /\b(heurisko|use code|discount code|sign up now|sponsored post|buy now|reward site)\b/i;
const BUZZ_POLITICS = /\b(trump|biden|election|democrat|republican|maga|epstein|tariff)\b/i;
const BUZZ_CELEB = /\b(altman|musk|zuckerberg|pichai|amodei|huang)\b/i;
const BUZZ_CONCRETE = /\b(phish\w*|ransom\w*|malware|breach\w*|credential\w*|deepfake\w*|exploit\w*)\b/i;

export function buzzEngagement(row) {
  return (row.likes || 0) + (row.replies || 0) + (row.reposts || 0);
}

export function keepBuzz(row) {
  if (!row?.text || !row?.url) return false;
  const text = `${row.author ?? ''} ${row.text}`;
  if (BUZZ_BOT.test(text)) return false;
  const emoji = text.match(/\p{Extended_Pictographic}/gu) ?? [];
  if (emoji.length > 5) return false;
  if (BUZZ_PROMO.test(text)) return false;
  const onTopic = BUZZ_TOPIC.test(text);
  if (BUZZ_POLITICS.test(text) && !BUZZ_CONCRETE.test(text)) return false;
  if (BUZZ_CELEB.test(text) && !BUZZ_CONCRETE.test(text)) return false;
  if (!onTopic) return false;
  const counted = ['likes', 'replies', 'reposts'].some((key) => typeof row[key] === 'number');
  if (row.platform !== 'Hacker News' && counted && buzzEngagement(row) < 1) return false;
  return true;
}

function dedupe(rows) {
  const seen = new Set();
  const kept = [];
  rows.forEach((row) => {
    if (!keepBuzz(row) || seen.has(row.url)) return;
    seen.add(row.url);
    kept.push(row);
  });
  kept.sort((a, b) => buzzEngagement(b) - buzzEngagement(a) || Date.parse(b.time || 0) - Date.parse(a.time || 0));
  return kept.slice(0, 12);
}

export async function collectBuzz(env = {}) {
  const live = [];
  const skipped = [];
  const rows = [];

  const bluesky = await Promise.all(QUERIES.map((query) => readJson(
    `https://api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=${encodeURIComponent(query)}&limit=8&sort=latest`,
  )));
  const bluePosts = bluesky.flatMap((payload) => (payload ? fromBluesky(payload) : []));
  if (bluePosts.length) live.push('Bluesky');
  else skipped.push('Bluesky');
  rows.push(...bluePosts);

  const reddit = await Promise.all(['cybersecurity', 'scams'].map((sub) => readJson(
    `https://www.reddit.com/r/${sub}/new.json?limit=5&raw_json=1`,
  )));
  const redditPosts = reddit.flatMap((payload) => (payload ? fromReddit(payload) : []));
  if (redditPosts.length) live.push('Reddit');
  else skipped.push('Reddit');
  rows.push(...redditPosts);

  const comments = await Promise.all(QUERIES.map((query) => readJson(
    `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=comment&hitsPerPage=8`,
  )));
  const hnPosts = comments.flatMap((payload) => (payload ? fromHackerNews(payload) : []));
  if (hnPosts.length) live.push('Hacker News');
  else skipped.push('Hacker News');
  rows.push(...hnPosts);

  const token = typeof env.X_BEARER_TOKEN === 'string' ? env.X_BEARER_TOKEN.trim() : '';
  if (!token) {
    skipped.push('X (no token)');
  } else {
    const xPayload = await readJson(
      `https://api.x.com/2/tweets/search/recent?query=${encodeURIComponent('("cybersecurity" OR "AI scam" OR phishing) -is:retweet lang:en')}&max_results=10&tweet.fields=created_at,public_metrics&expansions=author_id&user.fields=username`,
      { authorization: `Bearer ${token}` },
    );
    const xPosts = xPayload ? fromX(xPayload) : [];
    if (xPosts.length) live.push('X');
    else skipped.push('X');
    rows.push(...xPosts);
  }

  return { asOf: new Date().toISOString(), posts: dedupe(rows), live, skipped };
}
