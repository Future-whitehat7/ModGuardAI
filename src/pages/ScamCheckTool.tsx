import { Link } from 'react-router-dom';
import { ImageSlot } from '../components/marketing/ImageSlot';
import { SCAMCHECK_FAQ_URL, SCAMCHECK_URL } from '../config/platform';

export const ScamCheckTool = () => {
  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="measure text-xl text-ice">A message can look ordinary and still be the scam.</p>
      <div className="tool-frame mt-6">
        <iframe title="ScamCheck, the free message checker" src={SCAMCHECK_URL} />
      </div>
      <p className="mt-4 text-sm text-frost">
        <a href={SCAMCHECK_URL}>Open ScamCheck</a>
        {' · '}
        We don’t store your messages.{' '}
        <a href={SCAMCHECK_FAQ_URL}>ScamCheck’s own FAQ</a> says messages are analyzed for the result and are not saved to a database.
      </p>
      <ImageSlot file="scamcheck-card.svg" label="ScamCheck card" />
      <Link className="btn-accent mt-8" to="/impersonation-check">
        If the account itself is the problem, check it
      </Link>
    </article>
  );
};
