import { insightBySlug } from '../../content/insights';
import { PLAYBOOK_URL, SCAMCHECK_URL } from '../../config/platform';

export const SITE_URL = 'https://modguardai.org';
export { PLAYBOOK_URL, SCAMCHECK_URL };
export const SCAMCHECK_LABEL = 'ScamCheck';

export const DEFAULT_TITLE = 'ModGuard AI — Free AI Scam Checker | ScamCheck';

export const DEFAULT_DESCRIPTION =
  'Check if a message is a scam. ModGuard ScamCheck is a free AI scam checker for texts, emails, and links, with an AI verdict and phishing link checks against OpenPhish and Phishing Army.';

export interface RouteMeta {
  title: string;
  description: string;
  robots?: string;
}

export function metaForPath(pathname: string): RouteMeta {
  if (pathname === '/about') {
    return {
      title: 'About ModGuard AI | ScamCheck',
      description:
        'ModGuard AI is an AI safety studio. ScamCheck, a free AI scam checker, is the first live tool. Impersonation Check is the paid manual sweep.',
    };
  }
  if (pathname === '/scamcheck') {
    return {
      title: 'ScamCheck | ModGuard AI',
      description: 'Paste a message into ScamCheck, the free checker, before you pay or click.',
    };
  }
  if (pathname === '/impersonation-check') {
    return {
      title: 'Impersonation Check | ModGuard AI',
      description:
        'Check a suspicious handle for free, then pay $199 for a manual sweep if you have 100K to 1 million followers.',
    };
  }
  if (pathname === '/impersonation-check/thanks') {
    return {
      title: 'Intake | Impersonation Check',
      description: 'The 48-hour clock starts when this intake is complete.',
      robots: 'noindex, follow',
    };
  }
  if (pathname === '/insights') {
    return {
      title: 'Industry Insights | ModGuard AI',
      description:
        'Sourced notes on fraud reports, AI impersonation, passkeys, breaches, and deepfake labeling rules.',
    };
  }
  if (pathname.startsWith('/insights/')) {
    const post = insightBySlug(pathname.slice('/insights/'.length));
    if (post) {
      return { title: `${post.title} | ModGuard AI`, description: post.description };
    }
  }
  if (pathname === '/sponsor') {
    return {
      title: 'Sponsors | ModGuard AI',
      description:
        'Starter, Growth, and Elite. Growth is the live $199 manual impersonation sweep. Starter and Elite ask first.',
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
  { label: 'ScamCheck', href: '/scamcheck' },
  { label: 'Impersonation Check', href: '/impersonation-check' },
  { label: 'Insights', href: '/insights' },
  { label: 'Sponsors', href: '/sponsor' },
];

export const menuLinks: SiteLink[] = [
  { label: 'Home', href: '/' },
  ...primaryLinks,
  { label: 'About', href: '/about' },
  { label: 'Playbook', href: PLAYBOOK_URL, external: true },
];
