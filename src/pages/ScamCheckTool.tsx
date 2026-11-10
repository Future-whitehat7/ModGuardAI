import { useState } from 'react';
import { Link } from 'react-router-dom';
import { brandImages } from '../components/marketing/brandImages';
import { ImageSlot } from '../components/marketing/ImageSlot';
import { SCAMCHECK_FAQ_URL, SCAMCHECK_URL } from '../config/platform';

const steps = [
  { id: 'message', label: '1. Message', src: SCAMCHECK_URL },
  { id: 'statement', label: '2. Statement', src: `${SCAMCHECK_URL}/#statement` },
] as const;

type StepId = (typeof steps)[number]['id'];

export const ScamCheckTool = () => {
  const [step, setStep] = useState<StepId>('message');
  const active = steps.find((item) => item.id === step) ?? steps[0];

  return (
    <article className="page-wrap mx-auto w-full max-w-6xl px-4 sm:px-6">
      <p className="eyebrow">ScamCheck</p>
      <h1 className="display section-display mt-4 text-ice">A message can look ordinary and still be the scam.</h1>
      <p className="measure mt-5 text-lg text-frost">
        One tool. Check the message, then the statement. The statement step lives in the same checker.
      </p>
      <div className="step-switch mt-6" role="group" aria-label="ScamCheck steps">
        {steps.map((item) => (
          <button
            key={item.id}
            type="button"
            className="btn-ghost"
            aria-pressed={step === item.id}
            onClick={() => setStep(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="tool-frame mt-4">
        <iframe
          key={active.src}
          title={step === 'message' ? 'ScamCheck message check' : 'ScamCheck statement check'}
          src={active.src}
        />
      </div>
      <p className="mt-4 text-sm text-frost">
        <a href={SCAMCHECK_URL}>Open ScamCheck</a>
        {' · '}
        We don’t store your messages.{' '}
        <a href={SCAMCHECK_FAQ_URL}>ScamCheck’s own FAQ</a> says messages are analyzed for the result and are not saved to a database.
      </p>
      <ImageSlot className="brand-card" image={brandImages.scamcheck} />
      <Link className="btn-accent mt-8" to="/impersonation-check">
        If the account itself is the problem, check it
      </Link>
    </article>
  );
};
