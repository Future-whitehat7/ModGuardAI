export const SITE_URL = 'https://modguardai.org';
export const SCAMCHECK_URL = 'https://scamcheck.modguardai.org';
export const SCAMCHECK_LABEL = 'ScamCheck: free AI scam checker';

export const DEFAULT_TITLE =
  'ModGuard AI - Enterprise Content Moderation & Deepfake Detection Suite';

export const DEFAULT_DESCRIPTION =
  'AI-powered content moderation and deepfake detection for enterprise-grade content safety and compliance. Trusted by global leaders for real-time threat detection.';

export interface RouteMeta {
  title: string;
  description: string;
}

interface RouteRule {
  test: (pathname: string) => boolean;
  meta: RouteMeta;
}

const rules: RouteRule[] = [
  {
    test: (pathname) => pathname === '/',
    meta: {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
  },
  {
    test: (pathname) => pathname.startsWith('/features'),
    meta: {
      title: 'Features | ModGuard AI',
      description:
        'Deepfake detection, identity verification, document forensics, live video, and voice analysis from the ModGuard AI suite.',
    },
  },
  {
    test: (pathname) => pathname.startsWith('/solutions'),
    meta: {
      title: 'Solutions | ModGuard AI',
      description:
        'ModGuard AI for creators, brands and enterprises, policy makers, and journalists.',
    },
  },
  {
    test: (pathname) => pathname === '/about',
    meta: {
      title: 'About | ModGuard AI',
      description:
        'The origin story of ModGuard AI and founder Samuel Fagbamigbe, CEO and co-founder.',
    },
  },
  {
    test: (pathname) => pathname === '/blog',
    meta: {
      title: 'Blog | ModGuard AI',
      description:
        'Insights on AI, deepfakes, digital authenticity, and content verification from ModGuard AI.',
    },
  },
  {
    test: (pathname) => pathname === '/demo',
    meta: {
      title: 'Live Demo | ModGuard AI',
      description:
        'Upload image, video, or audio and try ModGuard AI content analysis and the deepfake challenge.',
    },
  },
  {
    test: (pathname) => pathname === '/earlyaccess' || pathname === '/waitlist',
    meta: {
      title: 'Early Access | ModGuard AI',
      description:
        'Join the ModGuard AI beta waitlist. 12,000+ professionals are waiting for early access.',
    },
  },
  {
    test: (pathname) => pathname === '/pricing',
    meta: {
      title: 'Pricing | ModGuard AI',
      description:
        'ModGuard AI plans: Starter at $49/month, Professional at $199/month, and custom Enterprise.',
    },
  },
  {
    test: (pathname) => pathname === '/case-studies',
    meta: {
      title: 'Case Studies | ModGuard AI',
      description:
        'How organizations use ModGuard AI for content moderation and deepfake detection.',
    },
  },
  {
    test: (pathname) => pathname === '/student-portal',
    meta: {
      title: 'AI Fellowship | ModGuard AI',
      description:
        'The ModGuard AI Fellowship for students and the next generation of AI defenders.',
    },
  },
  {
    test: (pathname) => pathname === '/leaderboard',
    meta: {
      title: 'Deepfake Challenge Leaderboard | ModGuard AI',
      description:
        'Top performers in the ModGuard AI deepfake detection challenge.',
    },
  },
  {
    test: (pathname) => pathname === '/api',
    meta: {
      title: 'API | ModGuard AI',
      description:
        'ModGuard AI API documentation, SDKs, and sandbox access for detection and moderation.',
    },
  },
];

export function metaForPath(pathname: string): RouteMeta {
  const match = rules.find((rule) => rule.test(pathname));
  if (match) return match.meta;
  return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
}

export interface SiteLink {
  label: string;
  href: string;
  external?: boolean;
}

export const primaryLinks: SiteLink[] = [
  { label: 'Technology', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'About', href: '/about' },
];

export const menuLinks: SiteLink[] = [
  { label: 'Technology', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Live demo', href: '/demo' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Early access', href: '/earlyaccess' },
  { label: 'Blog', href: '/blog' },
  { label: 'Case studies', href: '/case-studies' },
  { label: 'Press and media', href: '/media' },
  { label: 'AI Fellowship', href: '/student-portal' },
  { label: 'Deepfake challenge', href: '/leaderboard' },
  { label: 'Events', href: '/events' },
  { label: 'Research network', href: '/threat-map' },
  { label: 'API', href: '/api' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
  { label: 'Dashboard', href: '/dashboard' },
];
