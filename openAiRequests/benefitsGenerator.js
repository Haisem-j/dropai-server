const { loadMore } = require(".");

const generateBenefits = (productName, shortDesc, seed) => `
List some creative benefits of purchasing a portable blender.
Product name: Blend Jet

-The ability to make healthy smoothies and shakes
-You can take it with you wherever you go, so you can make healthy smoothies and juices no matter where you are.
-The ability to make baby food
-It's great for making healthy snacks on the go, like fruit and vegetable smoothies, protein shakes, and more.
-It comes with a variety of different attachments, so you can use it for different purposes.

Product name: ${productName}
List some benefits of purchasing a ${shortDesc}.

`;
const generateMoreBenefits = (productName, shortDesc, previousOutput, seed) => `
Product name: ${productName}
List some creative benefits of purchasing a ${shortDesc}.

${loadMore(previousOutput, "list some more benefits", true)}
`;

module.exports = {
  generateBenefits,
  generateMoreBenefits,
};
