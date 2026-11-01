import { useCallback, useState } from 'react';
import { Modal } from '../components/marketing/Modal';
import { ThreatPulse } from '../components/marketing/ThreatPulse';
import { SCAMCHECK_URL } from '../components/marketing/site';

const checks = [
  ['01', 'Paste', 'A message, a link, or a screenshot of a text or email.'],
  ['02', 'Read', 'You get a plain-language verdict, plus OpenPhish and Phishing Army checks on links.'],
  ['03', 'Decide', 'The reason is on the page, so you can judge it before you act.'],
];

const faqs = [
  ['What is ModGuard ScamCheck?', 'ScamCheck is a free AI scam checker for messages, links, and screenshots of texts or emails. It returns an AI verdict and checks links against known-phishing lists from OpenPhish and Phishing Army.'],
  ['Is ScamCheck free? Do I need an account?', 'ScamCheck is free. This site does not say whether an account is required. Open ScamCheck to use it.'],
  ['How does ScamCheck decide if something is a scam?', 'It returns an AI verdict in plain language. Links are also checked against OpenPhish and Phishing Army. This site does not publish an accuracy rate.'],
  ['Can it detect AI voice-clone scam calls?', 'This site does not claim phone-call or voice-clone detection. What is published is checks of messages, links, and screenshots of texts or emails.'],
  ['Is my message stored?', 'This site does not state a retention policy. ScamCheck is where a check is handled.'],
  ['What should I do if ScamCheck says Scam?', 'Do not reply, pay, or open the link. Review the check on ScamCheck before you act.'],
  ['Is the verdict guaranteed?', 'No. A verdict is a check, not a guarantee.'],
];

const scams = [
  ['01', 'Fake bank text messages', '“Your account is locked. Verify now.”'],
  ['02', 'Crypto investment DMs', '“I turned $500 into $12,000 in two weeks.”'],
  ['03', 'AI voice-clone family emergency calls', '“Grandma, it’s me. I need bail money.”'],
  ['04', 'Fake package delivery texts', '“USPS: your package is on hold.”'],
  ['05', 'Fake job and task scams', '“Earn $300/day liking videos.”'],
  ['06', 'Tech support and virus pop-ups', '“Your computer is infected. Call Microsoft.”'],
];

type OpenState = { kind: 'faq' | 'scam'; index: number } | null;

export const LandingPage = () => {
  const [open, setOpen] = useState<OpenState>(null);
  const close = useCallback(() => setOpen(null), []);
  const activeFaq = open?.kind === 'faq' ? faqs[open.index] : null;
  const activeScam = open?.kind === 'scam' ? scams[open.index] : null;

  return (
    <div>
      <section className="relative mx-auto flex min-h-[calc(100svh-7.5rem)] w-full max-w-6xl items-end px-4 py-24 sm:px-6 lg:items-center">
        <div className="max-w-3xl">
          <p className="eyebrow">AI-powered scams</p>
          <h1 className="rise display mt-5 text-5xl leading-[0.95] text-ice sm:text-7xl">
            Check it <em>before</em> you trust it.
          </h1>
          <p className="rise mt-6 max-w-xl text-xl leading-relaxed text-frost">
            A fake text can look ordinary, and a cloned voice can sound familiar. Paste the message into ScamCheck and get a plain-language verdict in seconds. Free.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a className="btn-accent w-full sm:w-auto" href={SCAMCHECK_URL}>Check a message — free</a>
            <a className="btn-ghost w-full sm:w-auto" href="#how">How it works</a>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <p className="eyebrow">Check a message</p>
          <h2 className="rise display mt-4 text-4xl text-ice">Paste it. Read the verdict.</h2>
          <p className="rise mt-4 max-w-xl text-lg text-frost">Nothing to install. Checking opens ScamCheck, where the verdict is written in plain language.</p>
          <form className="glass mt-8 p-6" action={SCAMCHECK_URL}>
            <label className="block text-sm text-frost" htmlFor="paste">
              Paste a message or link.
            </label>
            <textarea id="paste" className="field mt-3 min-h-28 py-3" placeholder="Paste a text, email, or link" />
            <button className="btn-accent mt-4 w-full sm:w-auto" type="submit">Check a message — free</button>
          </form>
          <aside className="glass mt-4 p-6">
            <p className="eyebrow">Example</p>
            <p className="rise mt-3 text-ice">“Your account is locked. Verify now.”</p>
            <p className="mt-2 text-sm text-frost">This card is an example, not a live verdict.</p>
          </aside>
        </div>
      </section>

      <section id="how" className="page-section">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="eyebrow">How it works</p>
          <h2 className="rise display mt-4 text-4xl text-ice sm:text-5xl">Three steps, then you decide.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {checks.map(([index, title, copy]) => (
              <article key={index} className="rise glass p-6">
                <p className="font-mono text-[11px] text-[#8a7355]">{index}</p>
                <h3 className="display mt-3 text-4xl text-ice">{title}</h3>
                <p className="mt-3 text-frost">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ThreatPulse />

      <section className="page-section">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Field guides</p>
              <h2 className="rise display mt-4 text-4xl text-ice sm:text-6xl">Scams going around right now</h2>
            </div>
            <a className="eyebrow" href={SCAMCHECK_URL}>All guides</a>
          </div>
          <p className="rise mt-4 max-w-2xl text-frost">Examples from ScamCheck. They are not incident reports from this site.</p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[20px] border border-[#E6E6E1] bg-[#E6E6E1] sm:grid-cols-2 lg:grid-cols-4">
            {scams.map(([index, title, quote], item) => (
              <button key={index} type="button" className="scam-tile min-h-40 bg-white p-5" onClick={() => setOpen({ kind: 'scam', index: item })}>
                <span className="font-mono text-[11px] text-[#8a7355]">{index}</span>
                <span className="mt-3 block text-lg text-ice">{title}</span>
                <span className="mt-2 block text-sm text-frost">{quote}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <p className="eyebrow">FAQ</p>
          <h2 className="rise display mt-4 text-4xl text-ice sm:text-6xl">Questions people ask</h2>
          <div className="mt-8 divide-y divide-[#E6E6E1] border-y border-[#E6E6E1]">
            {faqs.map(([question], item) => (
              <button key={question} type="button" className="faq-row flex min-h-16 items-center justify-between gap-4 py-4 text-left" onClick={() => setOpen({ kind: 'faq', index: item })}>
                <span>{question}</span>
                <span aria-hidden="true">+</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="next" className="page-section">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <p className="eyebrow">Research</p>
          <h2 className="rise display mt-4 text-4xl text-ice">What we&apos;re building next</h2>
          <p className="rise mt-4 text-lg text-frost">In research. Nothing else is live, and this page does not promise capabilities or dates.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <p className="eyebrow">Studio</p>
          <h2 className="rise display mt-4 text-4xl text-ice">Coach Samuel</h2>
          <p className="rise mt-4 text-lg text-frost">
            ModGuard AI is Coach Samuel&apos;s AI safety studio. ScamCheck is the first live tool.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <div className="glass p-8 sm:p-10">
            <p className="eyebrow">Newsletter</p>
            <h2 className="rise display mt-4 text-4xl text-ice">Get the weekly Scam Alert</h2>
            <p className="rise mt-3 text-frost">One email a week from ScamCheck: scams going around and how to spot them. Free. Unsubscribe on ScamCheck.</p>
            <a className="btn-accent mt-6 w-full sm:w-auto" href={SCAMCHECK_URL}>Subscribe on ScamCheck</a>
          </div>
        </div>
      </section>

      {activeFaq && (
        <Modal title={activeFaq[0]} onClose={close}>
          <p>{activeFaq[1]}</p>
          <a className="btn-accent w-full sm:w-auto" href={SCAMCHECK_URL}>Open ScamCheck</a>
          <button className="btn-ghost w-full sm:w-auto" type="button" onClick={close}>Close</button>
        </Modal>
      )}
      {activeScam && (
        <Modal title={activeScam[1]} onClose={close}>
          <p>{activeScam[2]}</p>
          <p>Example of a scam type listed on ScamCheck. It is not a live incident report from this site.</p>
          <a className="btn-accent w-full sm:w-auto" href={SCAMCHECK_URL}>Check a message like this</a>
          <button className="btn-ghost w-full sm:w-auto" type="button" onClick={close}>Close</button>
        </Modal>
      )}
    </div>
  );
};
