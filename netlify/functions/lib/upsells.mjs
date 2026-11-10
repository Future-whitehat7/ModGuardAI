/**
 * Offer catalog shown after the results (status page, results email, PDF).
 *
 * Every entry below is a placeholder. Placeholders are never shown to a buyer:
 * `upsells` only includes entries with `placeholder: false`, and only when
 * UPSELLS_ENABLED=1. Replace the title, sentence, price, and link with a real
 * offer, set `placeholder: false`, then set UPSELLS_ENABLED=1 in Netlify.
 */
export const offerCatalog = [
  {
    placeholder: true,
    title: 'Replace with a real offer title',
    description: 'Replace with one true sentence about the service.',
    price: 'Replace with the real price',
    link: 'https://example.com/replace-this-offer',
  },
  {
    placeholder: true,
    title: 'Replace with a second offer title',
    description: 'Replace with one true sentence about the second service.',
    price: 'Replace with the real price',
    link: 'https://example.com/replace-this-second-offer',
  },
];

export function visibleOffers(catalog = offerCatalog, env = process.env) {
  if (env.UPSELLS_ENABLED !== '1') return [];
  return catalog.filter((offer) => offer && offer.placeholder === false);
}

export const upsells = visibleOffers();
