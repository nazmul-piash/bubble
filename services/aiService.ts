
import { GoogleGenAI, Type } from "@google/genai";

// We use this to simulate what the "Windows Engine" would be doing in the background
// to provide those context-aware hints.

const MOCK_DELAY = 1000;

export async function analyzeIntent(content: string) {
  // In a real app, we would use Gemini to identify what the user is copying.
  // "Is this a medical claim ID? Is it a customer address?"
  return new Promise((resolve) => {
    setTimeout(() => {
      if (content.includes('@')) resolve("Detected: Email Address");
      if (content.match(/\d{5}/)) resolve("Detected: Postal Code / ID");
      if (content.length > 100) resolve("Detected: Long-form Prose");
      resolve("Detected: General Data Stream");
    }, MOCK_DELAY);
  });
}

// Logic for a real integration if process.env.API_KEY were active for the chat part
export const getGeminiSuggestion = async (clipboard: string, activeApp: string) => {
  if (!process.env.API_KEY) return "Simulation Mode: No API Key provided.";
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user copied: "${clipboard}". The current application window is "${activeApp}". Suggest 3 useful automation actions.`,
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    action: { type: Type.STRING },
                    description: { type: Type.STRING }
                }
            }
        }
    }
  });
  
  return JSON.parse(response.text);
};
