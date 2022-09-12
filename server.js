const express = require("express");
const cors = require("cors");
require("dotenv").config();

const middleware = require("./middleware");
const { openai } = require("./openaiConfig");
const { generateNames, generateMoreNames } = require("./openAiRequests");

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
});

/**
 * Req.body -> previousState: {description, seed, productNames}, pNames: string,
 */
app.post("/api/generate-more-names", async (req, res) => {
  const { description, seed, productNames } = req.body.previousState;
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
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
