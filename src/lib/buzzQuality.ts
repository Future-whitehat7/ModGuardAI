export interface PublicPost {
  platform: string;
  author: string;
  text: string;
  url: string;
  time: string;
  avatar?: string;
  likes?: number;
  replies?: number;
  reposts?: number;
}

const TOPIC = /\b(cyber\w*|scams?|phish\w*|frauds?|deepfakes?|privacy|malware|ransom\w*|breach\w*|security|credentials?|impersonat\w*|2fa|mfa|hack\w*)\b/i;
const BOT = /\.bot\b|trending words|top 10 trending/i;
const PROMO = /\b(heurisko|use code|discount code|sign up now|sponsored post|buy now|reward site)\b/i;
const POLITICS = /\b(trump|biden|election|democrat|republican|maga|epstein|tariff)\b/i;
const CELEB = /\b(altman|musk|zuckerberg|pichai|amodei|huang)\b/i;
const CONCRETE = /\b(phish\w*|ransom\w*|malware|breach\w*|credential\w*|deepfake\w*|exploit\w*)\b/i;

export function postEngagement(post: PublicPost) {
  return (post.likes ?? 0) + (post.replies ?? 0) + (post.reposts ?? 0);
}

export function keepPublicPost(post: PublicPost): boolean {
  const text = `${post.author} ${post.text}`;
  if (BOT.test(text) || PROMO.test(text)) return false;
  const emoji = text.match(/\p{Extended_Pictographic}/gu) ?? [];
  if (emoji.length > 5) return false;
  const onTopic = TOPIC.test(text);
  if (POLITICS.test(text) && !CONCRETE.test(text)) return false;
  if (CELEB.test(text) && !CONCRETE.test(text)) return false;
  if (!onTopic) return false;
  const counted = post.likes !== undefined || post.replies !== undefined || post.reposts !== undefined;
  if (post.platform !== 'Hacker News' && counted && postEngagement(post) < 1) return false;
  return true;
}

export function selectPublicPosts(posts: PublicPost[]): PublicPost[] {
  const seen = new Set<string>();
  return posts.filter(keepPublicPost).filter((post) => {
    if (seen.has(post.url)) return false;
    seen.add(post.url);
    return true;
  }).sort((left, right) => postEngagement(right) - postEngagement(left));
}
