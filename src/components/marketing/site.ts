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
        'ModGuard AI is an AI safety studio. ScamCheck, a free AI scam checker, is the first live tool. Impersonation Check verifies accounts and ads you send. $199 one-time.',
    };
  }
  if (pathname === '/scamcheck') {
    return {
      title: 'ScamCheck | ModGuard AI',
      description:
        'One free tool. Check a message, then a bank or card statement. Both steps stay in ScamCheck.',
    };
  }
  if (pathname === '/impersonation-check') {
    return {
      title: 'Impersonation Check | ModGuard AI',
      description:
        'Send suspicious accounts or ads you have spotted. After payment, automated research emails notes, a data-confidence level, and the platform report steps. $199 one-time. It does not decide impersonation and it does not remove accounts.',
    };
  }
  if (pathname === '/impersonation-check/thanks') {
    return {
      title: 'Order status | Impersonation Check',
      description: 'Private status for one Impersonation Check. Opening this page does not submit an intake and does not confirm payment.',
      robots: 'noindex, nofollow',
    };
  }
  if (pathname === '/operator') {
    return {
      title: 'Operator | Impersonation Check',
      description: 'Optional override for a paid Impersonation Check.',
      robots: 'noindex, nofollow',
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
        'Starter, Growth, and Elite. Growth is $199/month. The Impersonation Check is a separate $199 one-time payment.',
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

export const headerLinks: SiteLink[] = [
  ...primaryLinks,
  { label: 'About', href: '/about' },
];

export const menuLinks: SiteLink[] = [
  { label: 'Home', href: '/' },
  ...primaryLinks,
  { label: 'About', href: '/about' },
  { label: 'Playbook', href: PLAYBOOK_URL, external: true },
];
