
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("frontend"));

// Check API key
if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing in your .env file");
    process.exit(1);
}

// Connect to Gemini API
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Ask Gemini
app.post("/ask-gemini", async (req, res) => {
    try {
        const question = req.body.question;

        // Validate question
        if (typeof question !== "string" || !question.trim()) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        if (question.length > 5000) {
            return res.status(400).json({
                error: "Your question must be under 5000 characters."
            });
        }

        // Generate a clear answer
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Answer in simple, clear English.
Use short paragraphs and headings when helpful.
Use bullet points for lists.
Avoid unnecessary formatting and decorative symbols.
Explain technical concepts with examples when useful.

Question: ${question}`
        });

        if (!response.text) {
            return res.status(502).json({
                error: "Gemini did not return an answer. Please try again."
            });
        }

        // Send answer to frontend
        res.json({
            answer: response.text
        });

    } catch (error) {
        console.error("Gemini API error:", error.message);

        res.status(500).json({
            error: "Unable to generate an answer. Please try again."
        });
    }
});

// Start server
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

export default app;



































