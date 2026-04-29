import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Get AI-driven drug suggestions for a patient case.
 */
export const getDrugSuggestions = async (diagnosis, existingMeds = []) => {
  if (!API_KEY) {
    console.warn("Gemini API Key missing. Using Mock response.");
    return [
      { name: "Panadol 500mg", reason: "Standard pain relief for symptoms." },
      { name: "Vitamin C", reason: "Immune system support." }
    ];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      As a medical assistant for an Algerian doctor, suggest 2-3 medications for this case:
      Diagnosis: ${diagnosis}
      Current Meds: ${existingMeds.join(", ")}
      
      Requirements:
      - Use medications commonly available in Algeria.
      - Return the result in a STRICT JSON format: [{"name": "Drug Name", "reason": "Brief medical reason"}]
      - Do not include any extra text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse JSON from response
    const jsonMatch = text.match(/\[.*\]/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return [];
  }
};

/**
 * Predict shortages based on historical data (Simulation).
 */
export const predictShortages = async (wilaya) => {
  // In a real app, this would query a fine-tuned model or historical API
  return [
    { drug: "Doliprane 1g", risk: "High", wilaya },
    { drug: "Augmentin", risk: "Moderate", wilaya }
  ];
};
