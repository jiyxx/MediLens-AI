/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HealthReportAnalysis } from "../types";

// Ensure API key exists
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro"
});

export const analyzeMedicalReport = async (
  base64Data: string | null,
  mimeType: string | null,
  symptoms: string = ""
): Promise<HealthReportAnalysis> => {
  const prompt = base64Data
    ? `
You are a medical AI assistant.
Return ONLY valid JSON matching the required schema.
User symptoms: ${symptoms || "None"}
`
    : `
You are a medical AI assistant.
Analyze the symptoms and return ONLY valid JSON.
Symptoms: ${symptoms}
`;

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  // 🛡️ SAFE JSON EXTRACTION
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Model did not return valid JSON");
  }

  return JSON.parse(jsonMatch[0]) as HealthReportAnalysis;
};
