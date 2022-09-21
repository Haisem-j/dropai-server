import { Configuration, OpenAIApi } from "openai";
require("dotenv").config();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(config);
