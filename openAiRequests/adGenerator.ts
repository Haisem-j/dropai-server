import { loadMore } from "./index";

export const generateAd = (
  platform: string,
  targetAudience: string,
  productName: string,
  shortDescription: string
) => `
 Write a short creative ad for the following product to run on ${platform} aimed at ${targetAudience}:
Product: ${productName} is a ${shortDescription}

`;

export const generateMoreAds = (
  platform: string,
  targetAudience: string,
  productName: string,
  shortDescription: string,
  previousOutput: string[]
) => `
Write a short creative ad for the following product to run on ${platform} aimed at ${targetAudience}:
Product: ${productName} is a ${shortDescription}
${loadMore(previousOutput, "more ads", false)}
`;
