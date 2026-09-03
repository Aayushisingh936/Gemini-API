const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("frontend"));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
 
app.post("/ask-gemini", async (req, res) => {
    try {
        const question = req.body.question;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: question
        });

        res.json({
            answer: response.text
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
