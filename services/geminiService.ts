
import { GoogleGenAI } from "@google/genai";
import { PLANT_DATA, Feedstock } from "../constants";

const API_KEY = process.env.API_KEY;

let aiClient: GoogleGenAI | null = null;

if (API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: API_KEY });
}

export const askGeminiAboutPlant = async (
  question: string, 
  contextId: string, 
  feedstock: Feedstock,
  metrics: { 
    gas: number; 
    power: string; 
    thermal: string; 
    methane: string; 
    retention: number; 
    feedRate: number;
    liquidDigestate: number;
    fibreDigestate: number;
    carbonSavings: number;
  }
): Promise<string> => {
  if (!aiClient) {
    return "API Key is missing. Please configure the environment.";
  }

  const partData = PLANT_DATA[contextId];
  
  const contextPrompt = `
    You are an expert engineer at an Anaerobic Digestion (AD) plant.
    
    Current Simulation Scenario:
    - Primary Feedstock Characteristic: ${feedstock.name}
    - Daily Feed Rate: ${metrics.feedRate} tonnes/day
    - Retention Time: ${metrics.retention} days
    - Biogas Output: ${metrics.gas} m³/h
    - Methane Concentration: ${metrics.methane}%
    - Electrical Power: ${metrics.power} MW
    - Thermal Output: ${metrics.thermal} MW
    - Digestate Output: ${metrics.liquidDigestate}t liquid / ${metrics.fibreDigestate}t fibre per day
    - Carbon Savings: ${metrics.carbonSavings} tCO2/year
    
    The user is asking a question about the "${partData.title}" section.
    
    General context about this section:
    ${partData.fullDescription}
    
    User Question: "${question}"
    
    Provide a concise, educational answer (under 100 words).
    Use the simulation data above to explain *why* performance is at this level.
    For example, if retention time is low (<30 days), warn about washout. If feed rate is high, mention stability.
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
