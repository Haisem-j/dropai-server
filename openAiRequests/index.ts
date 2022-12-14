import { generateMoreNames, generateNames } from "./nameGenerator";
import {
  generateDescription,
  generateMoreDescription,
} from "./descriptionGenerator";
import { generateBenefits, generateMoreBenefits } from "./benefitsGenerator";
import { generateAd, generateMoreAds } from "./adGenerator";
import { generateTaglines, generateMoreTaglines } from "./taglinesGenerator";
const loadMore = (
  previousOutput: string[],
  prefix: string,
  list: boolean = false
) => {
  let more = "";

  if (list) {
    previousOutput.forEach((item, i) => {
      if (i === previousOutput.length + 1) {
        more += `\n-${item}\n\n`;
      } else {
        more += `\n-${item}`;
      }
    });
  } else {
    previousOutput.forEach((item, i) => {
      if (i === 0) {
        more += `${item} \n `;
      } else {
        more += `\n ${prefix} \n ${item} \n`;
      }
    });
  }

  more += `\n\n${prefix}\n`;
  return more;
};

export {
  loadMore,
  generateNames,
  generateMoreNames,
  generateDescription,
  generateMoreDescription,
  generateBenefits,
  generateMoreBenefits,
  generateAd,
  generateMoreAds,
  generateTaglines,
  generateMoreTaglines,
};
