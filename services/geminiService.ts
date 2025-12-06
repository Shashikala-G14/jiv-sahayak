import { GoogleGenAI, Modality } from "@google/genai";
import { Language, Persona } from '../types';

// --- CONFIGURATION ---
// Safely check for environment variables to prevent crashes in browsers (Vite/React)
let envKey = "";
try {
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env) {
    // @ts-ignore
    envKey = process.env.API_KEY;
  }
} catch (e) {
  // Ignore reference errors
}

// REPLACE "PASTE_YOUR_KEY_HERE" WITH YOUR ACTUAL KEY IF RUNNING LOCALLY WITHOUT ENV FILES
const API_KEY = envKey || "PASTE_YOUR_KEY_HERE"; 

export const getSystemInstruction = (language: Language, persona: Persona) => {
  let langInstruction = "English";
  if (language === Language.HINDI) langInstruction = "Hindi (or Hinglish if appropriate)";
  if (language === Language.MARATHI) langInstruction = "Marathi";

  return `
    You are 'JivSahayak', a wise, empathetic, and patient village friend. 
    Your user is a ${persona}. 
    Your goal is to provide simple, actionable advice on life skills, government schemes, health, and social behavior.
    
    Rules:
    1. Respond in ${langInstruction}.
    2. Keep answers short (under 50 words) and very simple (explain like I'm 5).
    3. Use a warm, encouraging tone.
    4. If the user mentions crisis or violence, provide immediate helpline numbers (India context).
    5. Do not use complex jargon.
  `;
};

export const generateAssistantResponse = async (
  prompt: string, 
  language: Language, 
  persona: Persona
): Promise<{ text: string; audioBase64?: string }> => {
  try {
    // Safety check: Prevent crash if key is missing or default
    if (!API_KEY || API_KEY.includes("PASTE_YOUR_KEY")) {
       console.error("API Key is missing.");
       return {
         text: "Error: Please update 'services/geminiService.ts' with your Gemini API Key.",
         audioBase64: undefined
       };
    }

    // Initialize AI Client only when needed (Lazy Load)
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // 1. Generate Text Response
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(language, persona),
        temperature: 0.7,
      },
    });

    const text = response.text || "I am listening, but I cannot speak right now.";

    // 2. Generate Audio (TTS) for the response
    let audioBase64: string | undefined = undefined;
    
    try {
      const audioResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { 
                voiceName: 'Kore' 
              },
            },
          },
        },
      });
      
      const audioData = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        audioBase64 = audioData;
      }
    } catch (ttsError) {
      console.warn("TTS generation failed, falling back to text only", ttsError);
    }

    return { text, audioBase64 };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: language === Language.ENGLISH ? "Connection error. Please check your internet or API Key." : "संपर्क त्रुटि।",
      audioBase64: undefined 
    };
  }
};