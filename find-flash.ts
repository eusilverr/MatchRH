import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";

async function findFlashModel() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    if (data.models) {
      const flashModels = data.models
        .filter((m: any) => m.name.includes("flash"))
        .map((m: any) => m.name);
      console.log("Flash Models:", flashModels);
    } else {
      console.log("No models found. Response:", data);
    }
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

findFlashModel();
