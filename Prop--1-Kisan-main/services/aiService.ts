import { GoogleGenAI, Type } from "@google/genai";
import { AiAnalysisResult } from "../types";

// Initialize Gemini
const apiKey =
  (typeof process !== "undefined" && (process as any).env?.API_KEY) ||
  (typeof process !== "undefined" && (process as any).env?.GEMINI_API_KEY) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GEMINI_API_KEY);
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeCropImage = async (base64Image: string): Promise<AiAnalysisResult> => {
  try {
    // We remove the data URL prefix if present to get just the base64 string
    const base64Data = base64Image.split(',')[1] || base64Image;

    if (!ai) {
      return {
        cropName: "Unknown Crop",
        grade: "B",
        estimatedPrice: 40,
        qualityDescription: "AI key not configured. Please enter manually.",
        confidence: 0
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          {
            text: `Analyze this crop image for a farmer marketplace. 
            Identify the crop name, assess its quality grade (A=Export/Premium, B=Standard/Market, C=Fair/Processing), 
            estimate a fair market price in INR per kg based on current general trends, 
            and provide a short 1-sentence description of visual quality.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING },
            grade: { type: Type.STRING, enum: ["A", "B", "C"] },
            estimatedPrice: { type: Type.NUMBER },
            qualityDescription: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["cropName", "grade", "estimatedPrice", "qualityDescription"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AiAnalysisResult;
    }

    throw new Error("No analysis returned");
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    // Fallback for demo purposes if API fails or quota exceeded
    return {
      cropName: "Unknown Crop",
      grade: "B",
      estimatedPrice: 40,
      qualityDescription: "Could not analyze image clearly. Please enter manually.",
      confidence: 0
    };
  }
};
