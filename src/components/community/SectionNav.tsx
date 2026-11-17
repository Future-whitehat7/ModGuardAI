const links = [
  { href: '#founding', label: 'Founding' },
  { href: '#five', label: '5 minutes' },
  { href: '#play', label: 'Play' },
  { href: '#sprints', label: 'Sprints' },
  { href: '#mission', label: 'Mission' },
  { href: '#campus', label: 'Campus' },
  { href: '#rewards', label: 'Rewards' },
  { href: '#sponsor-community', label: 'Sponsorship' },
  { href: '#partnerships', label: 'Partnerships' },
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
