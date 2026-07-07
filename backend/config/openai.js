import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

console.log("API Key loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO")

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default client;