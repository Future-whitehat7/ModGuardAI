export const SITE_URL = 'https://modguardai.org';
export const SCAMCHECK_URL = 'https://scamcheck.modguardai.org';
export const SCAMCHECK_LABEL = 'ScamCheck: free AI scam checker';

export const DEFAULT_TITLE = 'AI scam checker for messages and links | ModGuard ScamCheck';

export const DEFAULT_DESCRIPTION =
  'Check if a message is a scam. ModGuard ScamCheck is a free AI scam checker for texts, emails, and links, with an AI verdict and phishing link checks against OpenPhish and Phishing Army.';

export interface RouteMeta {
  title: string;
  description: string;
}

export function metaForPath(pathname: string): RouteMeta {
  if (pathname === '/about') {
    return {
      title: 'About ModGuard AI | ScamCheck',
      description:
        'ModGuard AI is an AI safety studio. ScamCheck, a free AI scam checker, is the first live tool. Other work is in research.',
    };
  }
  return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
}

export interface SiteLink {
  label: string;
  href: string;
  external?: boolean;
}

export const primaryLinks: SiteLink[] = [
  { label: 'How it works', href: '/#how' },
  { label: 'About', href: '/about' },
];

export const menuLinks: SiteLink[] = [
  { label: 'Home', href: '/' },
  { label: 'How it works', href: '/#how' },
  { label: 'What is next', href: '/#next' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/about#contact' },
];
