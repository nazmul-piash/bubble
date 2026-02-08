
import { GoogleGenAI, Type } from "@google/genai";

const MOCK_DELAY = 800;

export async function analyzeIntent(content: string) {
  // Simple heuristic for immediate UI feedback
  return new Promise((resolve) => {
    setTimeout(() => {
      if (content.includes('@')) resolve("Detected: Email / Communication");
      if (content.match(/\d{5}/)) resolve("Detected: Numeric Identifier");
      if (content.toLowerCase().includes('http')) resolve("Detected: External Resource");
      if (content.length > 50) resolve("Detected: Contextual Text");
      resolve("Detected: General Data Stream");
    }, MOCK_DELAY);
  });
}

export const getGeminiSuggestion = async (clipboard: string) => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found in environment.");
    return [{ action: "Local Mode", description: "Set API_KEY to enable AI mapping." }];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `The user copied: "${clipboard}". Suggest 3 useful automation actions based on this data.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["action", "description"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return [{ action: "Error", description: "Failed to reach intelligence layer." }];
  }
};
