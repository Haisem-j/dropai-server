export const generateNames = ({
  description,
  seed,
  productNames,
}: {
  description: string;
  seed: string;
  productNames: string;
}) => {
  const seeds = [...seed].join("");
  return `
Create product names from examples words. Influenced by a community prompt.

Product Description: A home milkshake maker.
Seed Words: fast, healthy, compact.Similar Names: Blend Jet.
Similar Names: Quick Shaker
Product Names: HomeShaker, Fit Shaker, QuickShake, Shake Maker.

Product Description: Portable shower speaker. 
Seed Words: portable, shower, speaker.
Similar Names: Hey Song, Shower Jams.
Product Names: Shower Tunes, Shower Sounds, Aqua Beats, Water Jams.

Product Description: ${description}.
Seed Words: ${seeds}
${productNames && "Similar Names:" + productNames}
Product Names: 
`;
};
export const generateMoreNames = (
  {
    description,
    seed,
    productNames,
  }: {
    description: string;
    seed: string;
    productNames: string;
  },
  pNames: string
) => {
  return `
Create product names from examples words. Influenced by a community prompt.

Product Description: A home milkshake maker.
Seed Words: fast, healthy, compact.Similar Names: Blend Jet.
Similar Names: Quick Shaker
Product Names: HomeShaker, Fit Shaker, QuickShake, Shake Maker.

Product Description: Portable shower speaker. 
Seed Words: portable, shower, speaker.
Similar Names: Hey Song, Shower Jams.
Product Names: Shower Tunes, Shower Sounds, Aqua Beats, Water Jams.

Product Description: ${description}.
Seed Words: ${seed}
${productNames && "Similar Names:" + productNames}
Product Names: ${pNames}

more possible names:
`;
};
