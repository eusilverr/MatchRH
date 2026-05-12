import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

async function listAllModels() {
  try {
    // Note: listModels is not on the genAI instance directly in some versions, 
    // it's a separate fetch usually. But let's try to find it.
    console.log("Attempting to list models...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log("Models found:", JSON.stringify(data, null, 2));
  } catch (e: any) {
    console.error("Error listing models:", e.message);
  }
}

listAllModels();
