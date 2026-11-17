const points = [
  { name: 'Your credit stays yours', detail: 'Your name stays on the work, and the portfolio piece is yours to show.' },
  { name: 'No hidden labeling', detail: 'A task on this page is the task you see. It is not quiet training data.' },
  { name: 'Consent for safety use', detail: 'A submission is used for community safety only when you send it.' },
  { name: 'Leave with your Mission Log', detail: 'The badge you download, and the tasks saved on this browser, leave with you.' },
];

export function Trust() {
  return (
    <section id="trust" className="community-block" aria-labelledby="trust-title">
      <p className="eyebrow">How your work is used</p>
      <h2 id="trust-title" className="display section-display text-ice">You can see the deal.</h2>
      <ul className="perk-grid">
        {points.map((point) => (
          <li key={point.name} className="perk-card">
            <h3>{point.name}</h3>
            <p>{point.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
