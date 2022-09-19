const { loadMore } = require(".");

const generateAd = (
  platform,
  targetAudience,
  productName,
  shortDescription
) => `
 Write a short creative ad for the following product to run on ${platform} aimed at ${targetAudience}:
Product: ${productName} is a ${shortDescription}

`;

const generateMoreAds = (
  platform,
  targetAudience,
  productName,
  shortDescription,
  previousOutput
) => `
Write a short creative ad for the following product to run on ${platform} aimed at ${targetAudience}:
Product: ${productName} is a ${shortDescription}
${loadMore(previousOutput, "more ads", false)}
`;

module.exports = {
  generateAd,
  generateMoreAds,
};
