const { loadMore } = require(".");

const generateTaglines = (productName, shortDescription) =>
  `List some creative taglines for the following product without numbers.\n${productName} is a ${shortDescription}.`;

const generateMoreTaglines = (productName, shortDescription, previousOutput) =>
  `List some creative taglines for the following product without numbers.\n${productName} is a ${shortDescription}.\n${loadMore(
    previousOutput,
    "more taglines",
    true
  )}`;
// List some creative taglines for the following product without numbers.\n${productName} is a ${shortDescription}.\n\n- Listen to your favorite tunes in the shower with Shower Jamz!\n- Take your shower time up a notch with Shower Jamz!\n- Make your shower time extra fun with Shower Jamz!\n\nmore taglines,

module.exports = {
  generateTaglines,
  generateMoreTaglines,
};
