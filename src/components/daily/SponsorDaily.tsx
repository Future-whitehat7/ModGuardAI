import { Link } from 'react-router-dom';

const placements = [
  { name: 'Featured story', detail: 'A card in the Daily deck, labeled Sponsored, when a placement is agreed.' },
  { name: 'Tool spotlight', detail: 'A labeled spot beside the tools on this site.' },
  { name: 'Newsletter slot', detail: 'Ask about a labeled mention. This site does not send a newsletter.' },
];

export function SponsorDaily() {
  return (
    <div className="sponsor-daily">
      <ul>
        {placements.map((placement) => (
          <li key={placement.name}>
            <h3>{placement.name}</h3>
            <p>{placement.detail}</p>
          </li>
        ))}
      </ul>
      <Link className="btn-accent" to="/sponsor#inquiry">Ask about a placement</Link>
    </div>
  );
}
