import { GoogleGenAI, Modality } from "@google/genai";
import { Language, Persona } from '../types';

// NOTE: In a real app, this key should not be exposed on the client side directly
// or should be proxied. For this prototype, we assume it's injected via env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
      text: language === Language.ENGLISH ? "I am having trouble connecting. Please try again." : "माफ करना, संपर्क नहीं हो पा रहा है।",
      audioBase64: undefined 
    };
  }
};