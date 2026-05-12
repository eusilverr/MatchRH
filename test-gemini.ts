import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
  for (const m of models) {
    try {
      console.log(`Testing model: ${m}...`);
      const result = await genAI.getGenerativeModel({ model: m });
      const res = await result.generateContent("hi");
      console.log(`Success with ${m}:`, res.response.text());
      return;
    } catch (e: any) {
      console.error(`Error with ${m}:`, e.message);
    }
  }
}

listModels();
