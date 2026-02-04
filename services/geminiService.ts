
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export const analyzeContract = async (
  text: string,
  onStatusUpdate?: (status: string) => void
): Promise<AnalysisResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const systemInstruction = `
    You are ContractClarity AI, an expert legal document explainer designed to help non-lawyers understand contracts safely and clearly.
    You are NOT a lawyer and do not give legal advice. Your role is to simplify and highlight risks.
    
    CRITICAL INSTRUCTIONS:
    - Break the contract into logical clauses.
    - Explain each in plain English (12-year-old level).
    - Detect "Red Flags" like hidden penalties, one-sided obligations, and unfair termination.
    - ALWAYS remain neutral, calm, and non-alarmist.
    - If a contract is heavily biased towards the issuer, state it clearly but professionally.
    
    RESPONSE FORMAT:
    You must return a structured JSON response matching the provided schema. 
    Ensure the "plainVerdict" is a reassuring but honest summary for the user.
  `;

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      if (onStatusUpdate) onStatusUpdate(`Analyzing clauses (Attempt ${attempt + 1})...`);
      
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [{ parts: [{ text: `Analyze this contract:\n\n${text}` }] }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overview: {
                type: Type.OBJECT,
                properties: {
                  contractType: { type: Type.STRING },
                  whoItMainlyProtects: { type: Type.STRING },
                  overallTone: { type: Type.STRING }
                },
                required: ["contractType", "whoItMainlyProtects", "overallTone"]
              },
              clauses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    whatItMeans: { type: Type.STRING },
                    whyItMatters: { type: Type.STRING },
                    riskLevel: { type: Type.STRING, description: "Low, Medium, or High" },
                    watchOutIf: { type: Type.STRING }
                  },
                  required: ["title", "whatItMeans", "whyItMatters", "riskLevel", "watchOutIf"]
                }
              },
              redFlags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              summary: {
                type: Type.OBJECT,
                properties: {
                  overallRiskLevel: { type: Type.STRING, description: "Low, Medium, or High" },
                  plainVerdict: { type: Type.STRING }
                },
                required: ["overallRiskLevel", "plainVerdict"]
              },
              checklist: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["overview", "clauses", "redFlags", "summary", "checklist"]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) throw new Error("Empty response from AI");

      return JSON.parse(resultText) as AnalysisResult;

    } catch (error: any) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      attempt++;
      
      if (attempt >= MAX_RETRIES) {
        throw new Error(error.message || "We encountered an issue analyzing your document. It might be too large or contain complex formatting.");
      }
      
      // Exponential backoff
      await wait(RETRY_DELAY * Math.pow(2, attempt));
    }
  }

  return null;
};
