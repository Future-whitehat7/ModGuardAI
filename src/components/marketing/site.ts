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
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (path === '/about') {
    return {
      title: 'About ModGuard AI | ScamCheck',
      description:
        'ModGuard AI is an AI safety studio. ScamCheck, a free AI scam checker, is the first live tool. Impersonation Check verifies accounts and ads you send. $199 one-time.',
    };
  }
  if (path === '/scamcheck') {
    return {
      title: 'ScamCheck | ModGuard AI',
      description:
        'One free tool. Check a message, then a bank or card statement. Both steps stay in ScamCheck.',
    };
  }
  if (path === '/impersonation-check') {
    return {
      title: 'Impersonation Check | ModGuard AI',
      description:
        'Send suspicious accounts or ads you have spotted. After payment, automated research emails notes, a data-confidence level, and the platform report steps. $199 one-time. It does not decide impersonation and it does not remove accounts.',
    };
  }
  if (path === '/impersonation-check/thanks') {
    return {
      title: 'Order status | Impersonation Check',
      description: 'Private status for one Impersonation Check. Opening this page does not submit an intake and does not confirm payment.',
      robots: 'noindex, nofollow',
    };
  }
  if (path === '/operator') {
    return {
      title: 'Operator | Impersonation Check',
      description: 'Optional override for a paid Impersonation Check.',
      robots: 'noindex, nofollow',
    };
  }
  if (path === '/insights') {
    return {
      title: 'Industry Insights | ModGuard AI',
      description:
        'Sourced notes on fraud reports, AI impersonation, passkeys, breaches, and deepfake labeling rules.',
    };
  }
  if (path.startsWith('/insights/')) {
    const post = insightBySlug(path.slice('/insights/'.length));
    if (post) {
      return { title: `${post.title} | ModGuard AI`, description: post.description };
    }
  }
  if (path === '/daily') {
    return {
      title: 'ModGuard Daily | ModGuard AI',
      description:
        'Public cybersecurity and AI reporting, posts from public platforms, a prompt generator, and sponsor placements. Every item links to its source.',
    };
  }
  if (path === '/community') {
    return {
      title: 'Community | ModGuard AI',
      description:
        'Join the ModGuard community, ask about a partnership, or inquire about a sponsorship tier.',
    };
  }
  if (path === '/sponsor') {
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
  { label: 'Daily', href: '/daily' },
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
