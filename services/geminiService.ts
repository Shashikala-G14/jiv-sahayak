import { GoogleGenAI, Modality } from "@google/genai";
import { Language, Persona } from '../types';

// --- CONFIGURATION ---
// 1. If using .env file, ensure it is in the ROOT directory and named '.env'
// 2. OR, for quick testing, replace the string below with your actual key:
const API_KEY = process.env.API_KEY || "PASTE_YOUR_KEY_HERE"; 

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
    // Safety check: Prevent crash if key is missing
    if (!API_KEY || API_KEY === "PASTE_YOUR_KEY_HERE") {
       console.error("API Key is missing.");
       return {
         text: "Error: Please add your Gemini API Key in services/geminiService.ts to chat.",
         audioBase64: undefined
       };
    }

    // Initialize AI Client only when needed (Lazy Load)
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // 1. Generate Text Response
    // Switched to 'gemini-2.5-flash' for faster response times
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
    // Using flash-preview-tts for low latency
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
                // Using 'Kore' for a gentle, neutral voice. 
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
      text: language === Language.ENGLISH ? "I am having trouble connecting. Please check your internet or API Key." : "माफ करना, संपर्क नहीं हो पा रहा है।",
      audioBase64: undefined 
    };
  }
};