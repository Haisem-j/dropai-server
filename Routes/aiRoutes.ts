import express, { Request, Response, NextFunction, Express } from "express";
import Stripe from "stripe";

import { openai } from "../openaiConfig";
import middleware from "../middleware";

import {
  generateNames,
  generateAd,
  generateBenefits,
  generateDescription,
  generateMoreAds,
  generateMoreBenefits,
  generateMoreDescription,
  generateMoreNames,
  generateMoreTaglines,
  generateTaglines,
} from "../openAiRequests";

const router = express.Router();
router.use(middleware.decodeToken);
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_KEY || "", {
  apiVersion: "2022-08-01",
});

/**
 * Req.body -> description, seed, productNames
 */
router.post("/generate-names", async (req, res) => {
  const { description, seed, productNames } = req.body;
  try {
    const { data } = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateNames({ description, seed, productNames }),
      temperature: 0.8,
      max_tokens: 120,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    if (data.choices) {
      res.status(200).json({
        result: data.choices[0].text,
        previous: {
          description,
          seed,
          productNames,
        },
      });
    }
  } catch (error) {
    console.log("Error /api/generate-names - ", error);
  }
});

/**
 * Req.body -> previousState: {description, seed, productNames}, pNames: string,
 */
router.post("/generate-more-names", async (req, res) => {
  const { description, seed, productNames } = req.body.previousState;
  try {
    const { data } = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateMoreNames(req.body.previousState, req.body.pNames),
      temperature: 0.8,
      max_tokens: 120,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    if (data.choices) {
      res.status(200).json({
        result: data.choices[0].text,
        previous: {
          description,
          seed,
          productNames,
        },
      });
    }
  } catch (error) {
    console.log("Error /api/generate-more-names - ", error);
  }
});

/**
 * Product Description Routes
 */
// Req.body -> productName, shortDescription, maxLength
router.post("/generate-prod-description", async (req, res) => {
  const { productName, shortDescription, maxLength, seed } = req.body;
  try {
    const { data } = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateDescription(productName, shortDescription, seed),
      temperature: 0.8,
      max_tokens: maxLength || 300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    if (data.choices) {
      res.status(200).json({
        result: data.choices[0].text,
      });
    }
  } catch (error) {
    console.log("Error /api/generate-prod-description - ", error);
  }
});
router.post("/generate-more-prod-description", async (req, res) => {
  const { productName, shortDescription, maxLength, previousOutput, seed } =
    req.body;
  const more = generateMoreDescription(
    productName,
    shortDescription,
    previousOutput,
    seed
  );
  try {
    const { data } = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: more,
      temperature: 0.8,
      max_tokens: maxLength || 300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    if (data.choices) {
      res.status(200).json({
        result: data.choices[0].text,
      });
    }
  } catch (error) {
    console.log("Error /api/generate-more-prod-description - ", error);
  }
});

/**
 * Product Benefits Routes
 */
// Req.body -> productName, shortDescription, seed
router.post("/generate-prod-benefits", async (req, res) => {
  const { productName, shortDescription, seed, maxLength } = req.body;
  console.log(generateBenefits(productName, shortDescription, seed));
  try {
    const { data } = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateBenefits(productName, shortDescription, seed),
      temperature: 0.8,
      max_tokens: maxLength || 300,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    if (data.choices) {
      res.status(200).json({
        result: data.choices[0].text,
      });
    }
  } catch (error) {
    console.log("Error /api/generate-prod-benefits - ", error);
  }
});
// Req.body -> productName, shortDescription, seed, previousOutput
router.post("/generate-more-prod-benefits", async (req, res) => {
  const { productName, shortDescription, seed, maxLength, previousOutput } =
    req.body;
  try {
    const { data } = await openai.createCompletion({
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
    if (data.choices) {
      res.status(200).json({
        result: data.choices[0].text,
      });
    }
  } catch (error) {
    console.log("Error /api/generate-more-prod-benefits - ", error);
  }
});

/**
 * Social Media Ads Routes
 */
// Req.body ->  platform, targetAudience, productName, shortDescription;
router.post("/generate-ad", async (req, res) => {
  const { platform, targetAudience, productName, shortDescription } = req.body;
  try {
    const { data } = await openai.createCompletion({
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
    if (data.choices) {
      res.status(200).json({
        result: data.choices[0].text,
      });
    }
  } catch (error) {
    console.log("Error /api/generate-ads - ", error);
  }
});
// Req.body ->  platform, targetAudience, productName, shortDescription, previousOutput;
router.post("/generate-more-ads", async (req, res) => {
  const {
    platform,
    targetAudience,
    productName,
    shortDescription,
    previousOutput,
  } = req.body;
  try {
    const { data } = await openai.createCompletion({
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
    if (data.choices) {
      res.status(200).json({
        result: data.choices[0].text,
      });
    }
  } catch (error) {
    console.log("Error /api/generate-ads - ", error);
  }
});

/**
 * Landing Page Copy Routes
 */
// Req.body ->  platform, targetAudience, productName, shortDescription;
router.post("/generate-taglines", async (req, res) => {
  const { productName, shortDescription } = req.body;
  try {
    const { data } = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: generateTaglines(productName, shortDescription),
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    if (data.choices) {
      res.status(200).json({
        result: data.choices[0].text,
      });
    }
  } catch (error) {
    console.log("Error /api/generate-taglines - err");
    res.send({ err: error });
  }
});
// Req.body ->  platform, targetAudience, productName, shortDescription;
router.post("/generate-more-taglines", async (req, res) => {
  const { productName, shortDescription, previousOutput } = req.body;
  try {
    const { data } = await openai.createCompletion({
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
    if (data.choices) {
      res.status(200).json({
        result: data.choices[0].text,
      });
    }
  } catch (error) {
    console.log("Error /api/generate-ads - ", error);
  }
});

/**
 * Payments route
 */
// Checkout session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.uid,
        product: req.body.paymentId,
      },
    });
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: req.body.paymentId,
          quantity: 1,
        },
      ],
      customer: customer.id,
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/app/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/app/plans?canceled=true`,
    });

    res.send({ url: session.url });
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("Error /create-checkout-session - ", error);
  }
});

export default router;
