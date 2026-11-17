import { Link } from 'react-router-dom';
import { ScamChecker } from '../components/scamcheck/ScamChecker';

export const ScamCheckTool = () => {
  return (
    <article className="scamcheck-page page-wrap mx-auto w-full max-w-3xl px-4 sm:px-6">
      <header className="scamcheck-intro">
        <p className="eyebrow">Free tool</p>
        <h1>ScamCheck</h1>
        <p>Paste a message, link, call, screenshot, or a card statement. The verdict shows here.</p>
      </header>
      <ScamChecker />
      <p className="scamcheck-next">
        Need a person checked across sites? <Link to="/impersonation-check">Impersonation Check is $199</Link>, and the form comes before payment.
      </p>
    </article>
  );
};
