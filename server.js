const express = require("express");
const cors = require("cors");
require("dotenv").config();

const middleware = require("./middleware");
const { openai } = require("./openaiConfig");
const {
  generateNames,
  generateMoreNames,
} = require("./openAiRequests/nameGenerator");
const {
  generateDescription,
  generateMoreDescription,
} = require("./openAiRequests/descriptionGenerator");
const {
  generateBenefits,
  generateMoreBenefits,
} = require("./openAiRequests/benefitsGenerator");
const { generateAd, generateMoreAds } = require("./openAiRequests/adGenerator");
const {
  generateTaglines,
  generateMoreTaglines,
} = require("./openAiRequests/taglinesGenerator");

const app = express();
const port = 8080;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.decodeToken);

// Routes
/**
 * Req.body -> description, seed, productNames
 */
app.post("/api/generate-names", async (req, res) => {
  const { description, seed, productNames } = req.body;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateNames({ description, seed, productNames }),
      temperature: 0.8,
      max_tokens: 120,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({
      result: completion.data.choices[0].text,
      previous: {
        description,
        seed,
        productNames,
      },
    });
  } catch (error) {
    console.log("Error /api/generate-names - ", error);
  }
});

/**
 * Req.body -> previousState: {description, seed, productNames}, pNames: string,
 */
app.post("/api/generate-more-names", async (req, res) => {
  const { description, seed, productNames } = req.body.previousState;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateMoreNames(req.body.previousState, req.body.pNames),
      temperature: 0.8,
      max_tokens: 120,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({
      result: completion.data.choices[0].text,
      previous: {
        description,
        seed,
        productNames,
      },
    });
  } catch (error) {
    console.log("Error /api/generate-more-names - ", error);
  }
});

/**
 * Product Description Routes
 */
// Req.body -> productName, shortDescription, maxLength
app.post("/api/generate-prod-description", async (req, res) => {
  const { productName, shortDescription, maxLength, seed } = req.body;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateDescription(productName, shortDescription, seed),
      temperature: 0.8,
      max_tokens: maxLength || 300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({
      result: completion.data.choices[0].text,
    });
  } catch (error) {
    console.log("Error /api/generate-prod-description - ", error);
  }
});
app.post("/api/generate-more-prod-description", async (req, res) => {
  const { productName, shortDescription, maxLength, previousOutput, seed } =
    req.body;
  const more = generateMoreDescription(
    productName,
    shortDescription,
    previousOutput,
    seed
  );
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: more,
      temperature: 0.8,
      max_tokens: maxLength || 300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({
      result: completion.data.choices[0].text,
    });
  } catch (error) {
    console.log("Error /api/generate-more-prod-description - ", error);
  }
});

/**
 * Product Benefits Routes
 */
// Req.body -> productName, shortDescription, seed
app.post("/api/generate-prod-benefits", async (req, res) => {
  const { productName, shortDescription, seed, maxLength } = req.body;
  console.log(generateBenefits(productName, shortDescription, seed));
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateBenefits(productName, shortDescription, seed),
      temperature: 0.8,
      max_tokens: maxLength || 300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({
      result: completion.data.choices[0].text,
    });
  } catch (error) {
    console.log("Error /api/generate-prod-benefits - ", error);
  }
});
// Req.body -> productName, shortDescription, seed, previousOutput
app.post("/api/generate-more-prod-benefits", async (req, res) => {
  const { productName, shortDescription, seed, maxLength, previousOutput } =
    req.body;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateMoreBenefits(
        productName,
        shortDescription,
        previousOutput,
        seed
      ),
      temperature: 0.7,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({
      result: completion.data.choices[0].text,
    });
  } catch (error) {
    console.log("Error /api/generate-more-prod-benefits - ", error);
  }
});

/**
 * Social Media Ads Routes
 */
// Req.body ->  platform, targetAudience, productName, shortDescription;
app.post("/api/generate-ad", async (req, res) => {
  const { platform, targetAudience, productName, shortDescription } = req.body;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateAd(
        platform,
        targetAudience,
        productName,
        shortDescription
      ),
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({
      result: completion.data.choices[0].text,
    });
  } catch (error) {
    console.log("Error /api/generate-ads - ", error);
  }
});
// Req.body ->  platform, targetAudience, productName, shortDescription, previousOutput;
app.post("/api/generate-more-ads", async (req, res) => {
  const {
    platform,
    targetAudience,
    productName,
    shortDescription,
    previousOutput,
  } = req.body;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateMoreAds(
        platform,
        targetAudience,
        productName,
        shortDescription.toLocaleLowerCase(),
        previousOutput
      ),
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({
      result: completion.data.choices[0].text,
    });
  } catch (error) {
    console.log("Error /api/generate-ads - ", error);
  }
});

/**
 * Landing Page Copy Routes
 */
// Req.body ->  platform, targetAudience, productName, shortDescription;
app.post("/api/generate-taglines", async (req, res) => {
  const { productName, shortDescription } = req.body;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateTaglines(productName, shortDescription),
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({
      result: completion.data.choices[0].text,
    });
  } catch (error) {
    console.log("Error /api/generate-ads - ", error);
  }
});
// Req.body ->  platform, targetAudience, productName, shortDescription;
app.post("/api/generate-more-taglines", async (req, res) => {
  const { productName, shortDescription, previousOutput } = req.body;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateMoreTaglines(
        productName,
        shortDescription,
        previousOutput
      ),
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({
      result: completion.data.choices[0].text,
    });
  } catch (error) {
    console.log("Error /api/generate-ads - ", error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
