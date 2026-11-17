const links = [
  { href: '#founding', label: 'Founding' },
  { href: '#five', label: '5 minutes' },
  { href: '#trust', label: 'Your work' },
  { href: '#play', label: 'Play' },
  { href: '#sprints', label: 'Sprints' },
  { href: '#mission', label: 'Mission' },
  { href: '#campus', label: 'Chapters' },
  { href: '#rewards', label: 'Rewards' },
  { href: '#career', label: 'Career' },
  { href: '#readiness', label: 'Readiness' },
  { href: '#sponsor-community', label: 'Sponsorship' },
  { href: '#partnerships', label: 'Partnerships' },
  { href: '#next', label: 'Next' },
];

export function SectionNav() {
  return (
    <nav className="section-nav" aria-label="On this page">
      {links.map((link) => (
        <a key={link.href} href={link.href}>{link.label}</a>
      ))}
    </nav>
  );
}
