import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getZenWisdom = async (topic: string, context?: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Breathe in, breathe out. (API Key missing)";

  try {
    const prompt = `
      You are a Zen Master and Meditation Teacher.
      The user is asking for guidance on: "${topic}".
      Context about their current practice: ${context || "General mindfulness"}.
      
      Provide a short, profound, and calming piece of wisdom or a very brief mini-instruction (max 2 sentences).
      Keep the tone gentle, minimalist, and soothing.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Silence is a source of great strength.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Inhale peace, exhale worry.";
  }
};