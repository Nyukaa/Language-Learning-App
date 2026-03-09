import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkAuth } from "../middleware/auth";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

router.post("/", checkAuth, async (req, res) => {
  console.log("Voice route hit, body:", req.body);
  const { text, targetLanguage } = req.body;
  if (!text) return res.status(400).json({ error: "text is required" });

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Extract flashcard data from this voice input. Return ONLY valid JSON, no explanations.

Text: "${text}"
Target language being learned: "${targetLanguage || "unknown"}"

JSON format:
{
  "word": string,       // the word or phrase to learn
  "context": string     // example sentence using the word
}

Rules:
- "word" should be the main word/phrase the user wants to learn
- "context" should be a natural sentence containing the word
- If the user only said a word without context, generate a simple example sentence
- Keep original language of the word`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch {
    res.status(422).json({ error: "Failed to parse AI response" });
  }
});

export default router;
