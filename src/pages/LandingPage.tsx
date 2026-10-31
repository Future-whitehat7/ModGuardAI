import { useRef } from 'react';
import type { CSSProperties } from 'react';
import { HeroStage } from '../components/marketing/HeroStage';
import { useReveal } from '../components/marketing/useReveal';
import { SCAMCHECK_LABEL, SCAMCHECK_URL } from '../components/marketing/site';

function revealDelay(index: number): CSSProperties {
  return { animationDelay: `${index * 70}ms` };
}

const checks = [
  {
    index: '01',
    title: 'Message',
    copy: 'Paste a text or email you are unsure about.',
  },
  {
    index: '02',
    title: 'Link',
    copy: 'Paste a link before you open it.',
  },
  {
    index: '03',
    title: 'Screenshot',
    copy: 'Upload a screenshot of a text or email.',
  },
];

export const LandingPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  useReveal(pageRef);

  return (
    <div ref={pageRef}>
      <section className="relative flex min-h-[calc(100svh-7.5rem)] items-start overflow-hidden lg:min-h-[calc(100svh-4.5rem)] lg:items-center">
        <HeroStage />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">
              ModGuard AI · AI safety studio
            </p>
            <h1 className="mt-4 text-[2.6rem] font-semibold leading-[0.95] tracking-tight text-ice sm:text-6xl">
              Check if a message is a scam.
            </h1>
            <p className="mt-5 text-xl font-medium leading-snug text-ice sm:text-2xl">
              ScamCheck is our first live tool: a free AI scam checker.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a href={SCAMCHECK_URL} className="btn-accent w-full sm:w-auto">
                {SCAMCHECK_LABEL}
              </a>
              <a href="#how" className="btn-ghost w-full sm:w-auto">
                How a check works
              </a>
            </div>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ice/75">
              Use it on a message, a link, or a screenshot of a text or email. You get an AI verdict, and the link is checked against known-phishing lists from OpenPhish and Phishing Army.
            </p>
          </div>
        </div>
      </section>

      <section id="how" className="chapter mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">01 / Check</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ice sm:text-5xl">
          An AI scam checker for messages and links
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ice/75">
          ScamCheck is free. It reads what you give it and returns a verdict in plain language.
        </p>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {checks.map((item, index) => (
            <li key={item.index} className="glass reveal p-6" style={revealDelay(index)}>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">
                {item.index} / {item.title}
              </p>
              <p className="mt-3 text-ice/80">{item.copy}</p>
            </li>
          ))}
        </ol>
        <a href={SCAMCHECK_URL} className="btn-accent mt-8 w-full sm:w-auto">
          {SCAMCHECK_LABEL}
        </a>
      </section>

      <section className="chapter border-t border-ice/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">02 / Verdict</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ice sm:text-5xl">
            An AI verdict, then a phishing link check
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="glass reveal p-6" style={revealDelay(0)}>
              <h3 className="text-xl font-semibold text-ice">AI verdict</h3>
              <p className="mt-3 leading-relaxed text-ice/75">
                ScamCheck gives an AI verdict on the message, link, or screenshot you submitted.
              </p>
            </article>
            <article className="glass reveal p-6" style={revealDelay(1)}>
              <h3 className="text-xl font-semibold text-ice">Phishing link checker</h3>
              <p className="mt-3 leading-relaxed text-ice/75">
                Links are also checked against known-phishing blocklists from OpenPhish and Phishing Army.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="chapter border-t border-ice/10">
        <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">03 / Letter</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ice sm:text-5xl">A newsletter</h2>
          <p className="mt-4 text-lg leading-relaxed text-ice/75">
            ScamCheck includes a newsletter. Sign-up lives on ScamCheck, with the checker.
          </p>
          <a href={SCAMCHECK_URL} className="btn-ghost mt-8 w-full sm:w-auto">
            Open ScamCheck
          </a>
        </div>
      </section>

      <section id="next" className="chapter border-t border-ice/10">
        <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-frost">04 / Next</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ice sm:text-5xl">
            What we&apos;re building next
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ice/75">
            In research. Nothing else is live, and this page does not promise capabilities or dates.
          </p>
        </div>
      </section>
    </div>
  );
};
