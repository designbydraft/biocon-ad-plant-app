import { GoogleGenAI } from "@google/genai";
import { PLANT_DATA, Feedstock } from "../constants";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
;

let aiClient: GoogleGenAI | null = null;

if (API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: API_KEY });
}

export const askGeminiAboutPlant = async (
  question: string, 
  contextId: string, 
  feedstock: Feedstock,
  metrics: { gas: number; power: string }
): Promise<string> => {
  if (!aiClient) {
    return "API Key is missing. Please configure the environment.";
  }

  const partData = PLANT_DATA[contextId];
  
  const contextPrompt = `
    You are an expert engineer at an Anaerobic Digestion (AD) plant.
    The plant is currently operating using **${feedstock.name}** as the primary feedstock.
    
    Current Live Plant Metrics:
    - Biogas Production: ${metrics.gas} m³/h
    - Power Generation: ${metrics.power} MW
    
    Context about the current feedstock (${feedstock.name}):
    - Description: ${feedstock.description}
    - Impact on this section: ${feedstock.impacts[contextId] || 'Standard operation.'}
    
    The user is asking a question about the "${partData.title}" section.
    
    General context about this section:
    ${partData.fullDescription}
    
    Technical Details:
    ${partData.technicalDetails.join(', ')}
    
    User Question: "${question}"
    
    Provide a concise, educational answer (under 100 words) suitable for a student or visitor. 
    Explicitly mention how the current feedstock (${feedstock.name}) or current production levels affect this part of the process if relevant.
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contextPrompt,
    });
    return response.text || "I couldn't generate an answer at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the plant's knowledge base right now.";
  }
};
