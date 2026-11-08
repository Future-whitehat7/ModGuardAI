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
    alt: 'A clear crystal under a wireframe dome.',
  },
  sponsor: {
    webp: sponsorWebp,
    png: sponsorPng,
    width: 1280,
    height: 720,
    alt: 'Three glass spheres, each larger than the last, with a dotted ring.',
  },
  scamcheck: {
    webp: scamcheckWebp,
    png: scamcheckPng,
    width: 1024,
    height: 1024,
    alt: 'A glass dish with a dotted line and one marked point.',
  },
  impersonation: {
    webp: impersonationWebp,
    png: impersonationPng,
    width: 1280,
    height: 720,
    alt: 'A solid star, a clear crystal, and a broken star drawn in dashed lines.',
  },
  insights: {
    webp: insightsWebp,
    png: insightsPng,
    width: 1280,
    height: 720,
    alt: 'A glass panel marked with a network of points.',
  },
  whoPeople: {
    webp: whoPeopleWebp,
    png: whoPeoplePng,
    width: 512,
    height: 512,
    alt: 'A glass disc with a house drawn from stars.',
  },
  whoCreators: {
    webp: whoCreatorsWebp,
    png: whoCreatorsPng,
    width: 512,
    height: 512,
    alt: 'A small crystal with lines radiating outward.',
  },
  whoBrands: {
    webp: whoBrandsWebp,
    png: whoBrandsPng,
    width: 512,
    height: 512,
    alt: 'A glass cube with a columned building on its face.',
  },
} as const satisfies Record<string, BrandImageSource>;
