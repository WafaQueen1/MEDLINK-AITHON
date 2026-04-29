import pg from 'pg';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const db = new Pool({
  user: 'postgres',
  password: 'Rami1412#',
  host: 'localhost',
  port: 5432,
  database: 'pharmatec_db',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * AI-OCR: Uses Gemini Pro Vision (or Gemini 1.5) to extract data from prescription
 */
const scanPrescription = async (imageUrl) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Extract patient name, date, and list of medicines (name, dosage, frequency, duration) from this prescription image. Return ONLY a valid JSON object.";
    
    // In a real implementation, imageUrl would be converted to base64
    // For this hackathon demo, we simulate the extraction but with Gemini's reasoning if text was provided
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text.replace(/```json|```/g, ''));
    } catch (e) {
      // Fallback mock
      return {
        patientName: "Amine Bensaid",
        date: new Date().toISOString(),
        medicines: [
          { name: "Doliprane 1g", dosage: "1 tab", frequency: "3 times/day", duration: "5 days" },
          { name: "Amoxil 500mg", dosage: "1 cap", frequency: "2 times/day", duration: "7 days" }
        ]
      };
    }
  } catch (error) {
    console.error("Gemini Scan Error:", error);
    return null;
  }
};

/**
 * AI-Doctor-Assistant: Suggests generic alternatives using Gemini + SQL Fallback
 */
const getGenericAlternatives = async (medicineName) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Suggest generic alternatives for the medicine "${medicineName}". Only provide names of molecules or equivalent brands common in Algeria.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text();

    // Now query our DB to see if we have these in stock
    const query = `
      SELECT name, price, status, generic_name
      FROM pharmacy_medicines
      WHERE generic_name = (
        SELECT generic_name FROM pharmacy_medicines WHERE name ILIKE $1 LIMIT 1
      ) AND status != 'Rupture'
      ORDER BY price ASC;
    `;
    
    const dbResult = await db.query(query, [`%${medicineName}%`]);
    return {
      aiAdvice: suggestions,
      databaseMatches: dbResult.rows
    };
  } catch (error) {
    // SQL Fallback
    const query = `
      SELECT name, price, status, generic_name
      FROM pharmacy_medicines
      WHERE generic_name = (
        SELECT generic_name FROM pharmacy_medicines WHERE name ILIKE $1 LIMIT 1
      ) AND status != 'Rupture'
      ORDER BY price ASC;
    `;
    const dbResult = await db.query(query, [`%${medicineName}%`]);
    return {
      aiAdvice: "Gemini API unavailable. Using database fallback.",
      databaseMatches: dbResult.rows
    };
  }
};

/**
 * AI-Demand-Predictor: Predicts shortages per Wilaya (simulated)
 */
const predictShortages = async () => {
  return [
    { wilaya: "Alger", shortageIntensity: 0.85, topMissing: "Doliprane 1g" },
    { wilaya: "Oran", shortageIntensity: 0.45, topMissing: "Ventoline" },
    { wilaya: "Constantine", shortageIntensity: 0.65, topMissing: "Glucophage" },
    { wilaya: "Setif", shortageIntensity: 0.30, topMissing: "Lovenox" },
    { wilaya: "Tizi Ouzou", shortageIntensity: 0.90, topMissing: "Clamoxyl" }
  ];
};

export default {
  scanPrescription,
  getGenericAlternatives,
  predictShortages
};
