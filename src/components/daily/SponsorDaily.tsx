import { Link } from 'react-router-dom';

const placements = [
  {
    name: 'Featured story',
    detail: 'A labeled card at the front of ModGuard Daily.',
  },
  {
    name: 'Tool spotlight',
    detail: 'A labeled place beside ScamCheck.',
  },
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
      <Link className="btn-accent" to="/sponsor#inquiry">Become a sponsor</Link>
    </div>
  );
}