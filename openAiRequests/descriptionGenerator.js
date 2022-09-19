const loadMore = (previousOutput) => {
  let more = "";

  previousOutput.forEach((item, i) => {
    if (i === 0) {
      more += `${item} \n `;
    } else {
      more += `\n more description \n ${item} \n`;
    }
  });

  more += `\n more description \n`;
  return more;
};

const generateDescription = (productName, shortDesc, seed) =>
  `
Write a creative product description for a home milkshake maker.
Product name: Shake Maker
${seed && "Seed words: portable,savings,convenient"}

Looking for a fun and delicious way to enjoy your favorite ice cream? Look no further than the Shake Maker! This innovative kitchen gadget lets you easily make delicious milkshakes right at home. Simply add your favorite ice cream and milk to the Shake Maker, and watch as it whips up a delicious and refreshing treat in just seconds. Choose from a variety of fun and unique flavor combinations, or get creative and make your own! The Shake Maker is perfect for any occasion and is sure to be a hit with family and friends. So what are you waiting for? Get shaking today!

Write a creative product description for a ${shortDesc}.
Product name: ${productName}
${seed && "Seed words: " + seed} 
`;
const generateMoreDescription = (
  productName,
  shortDesc,
  previousOutput,
  seed
) =>
  `
Write a creative product description for a ${shortDesc}.
Product name: ${productName}
${seed && "Seed words: " + seed} 

${loadMore(previousOutput)}

`;

module.exports = {
  generateDescription,
  generateMoreDescription,
};
