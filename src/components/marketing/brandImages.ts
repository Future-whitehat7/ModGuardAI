import heroPng from '../../assets/brand/hero.png';
import heroWebp from '../../assets/brand/hero.webp';
import impersonationPng from '../../assets/brand/impersonation.png';
import impersonationWebp from '../../assets/brand/impersonation.webp';
import insightsPng from '../../assets/brand/insights.png';
import insightsWebp from '../../assets/brand/insights.webp';
import scamcheckPng from '../../assets/brand/scamcheck.png';
import scamcheckWebp from '../../assets/brand/scamcheck.webp';
import sponsorPng from '../../assets/brand/sponsor.png';
import sponsorWebp from '../../assets/brand/sponsor.webp';
import whoBrandsPng from '../../assets/brand/who-brands.png';
import whoBrandsWebp from '../../assets/brand/who-brands.webp';
import whoCreatorsPng from '../../assets/brand/who-creators.png';
import whoCreatorsWebp from '../../assets/brand/who-creators.webp';
import whoPeoplePng from '../../assets/brand/who-people.png';
import whoPeopleWebp from '../../assets/brand/who-people.webp';

export interface BrandImageSource {
  webp: string;
  png: string;
  alt: string;
  width: number;
  height: number;
}

export const brandImages = {
  hero: {
    webp: heroWebp,
    png: heroPng,
    width: 1280,
    height: 720,
    alt: 'A faceted crystal on a stone plinth in soft window light.',
  },
  sponsor: {
    webp: sponsorWebp,
    png: sponsorPng,
    width: 1280,
    height: 720,
    alt: 'Three glass spheres growing in size, the largest ringed in navy.',
  },
  scamcheck: {
    webp: scamcheckWebp,
    png: scamcheckPng,
    width: 1024,
    height: 1024,
    alt: 'A glass lens bringing a single navy line into focus.',
  },
  impersonation: {
    webp: impersonationWebp,
    png: impersonationPng,
    width: 1280,
    height: 720,
    alt: 'Two glass frames side by side: one marked genuine, one cracked.',
  },
  insights: {
    webp: insightsWebp,
    png: insightsPng,
    width: 1280,
    height: 720,
    alt: 'A stack of etched glass sheets on a stone plinth.',
  },
  whoPeople: {
    webp: whoPeopleWebp,
    png: whoPeoplePng,
    width: 1024,
    height: 1024,
    alt: 'A small house drawn in navy under a glass dome.',
  },
  whoCreators: {
    webp: whoCreatorsWebp,
    png: whoCreatorsPng,
    width: 1024,
    height: 1024,
    alt: 'A crystal star casting light across a stone surface.',
  },
  whoBrands: {
    webp: whoBrandsWebp,
    png: whoBrandsPng,
    width: 1024,
    height: 1024,
    alt: 'A crystal cube holding a navy line drawing of a building.',
  },
} as const satisfies Record<string, BrandImageSource>;
