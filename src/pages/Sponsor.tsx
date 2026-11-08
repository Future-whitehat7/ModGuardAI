import { useState } from 'react';
import { brandImages } from '../components/marketing/brandImages';
import { ImageSlot } from '../components/marketing/ImageSlot';
import { SponsorInquiry } from '../components/marketing/SponsorInquiry';
import { TierColumns } from '../components/marketing/TierColumns';
import type { TierId } from '../config/platform';

export const Sponsor = () => {
  const [asked, setAsked] = useState<TierId>('starter');

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="measure text-xl text-ice">The audience is already deciding whether to trust something.</p>
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
