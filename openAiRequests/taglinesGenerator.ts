import { loadMore } from "./index";

export const generateTaglines = (
  productName: string,
  shortDescription: string
) =>
  `List some creative taglines for the following product without numbers.\n${productName} is a ${shortDescription}.`;

export const generateMoreTaglines = (
  productName: string,
  shortDescription: string,
  previousOutput: string[]
) =>
  `List some creative taglines for the following product without numbers.\n${productName} is a ${shortDescription}.\n${loadMore(
    previousOutput,
    "more taglines",
    true
  )}`;
