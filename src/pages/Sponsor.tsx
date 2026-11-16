import { useState } from 'react';
import { brandImages } from '../components/marketing/brandImages';
import { ImageSlot } from '../components/marketing/ImageSlot';
import { SponsorInquiry } from '../components/marketing/SponsorInquiry';
import { TierColumns } from '../components/marketing/TierColumns';
import type { TierId } from '../config/platform';

export const Sponsor = () => {
  const [asked, setAsked] = useState<TierId>('starter');

  return (
    <article className="page-wrap mx-auto w-full max-w-6xl px-4 sm:px-6">
      <p className="eyebrow">Sponsors</p>
      <h1 className="display section-display mt-4 text-ice">The audience is already deciding whether to trust something.</h1>
      <ImageSlot image={brandImages.sponsor} priority />
      <div className="mt-8">
        <TierColumns onAsk={(tier) => {
          setAsked(tier);
          document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
        }} />
      </div>
      <div className="mt-12 max-w-3xl">
        <SponsorInquiry key={asked} initialTier={asked} />
      </div>
    </article>
  );
};
