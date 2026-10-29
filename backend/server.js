// import express from "express";
// import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai";
// import path from "path";
// import { fileURLToPath } from "url";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// // app.use(express.static("frontend"));

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const frontendPath = path.join(__dirname, "frontend");

// app.get("/", (req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
// });

// // Check API key
// if (!process.env.GEMINI_API_KEY) {
//     console.error("GEMINI_API_KEY is missing in your .env file");
//     process.exit(1);
// }

// // Connect to Gemini API
// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// });

// // Ask Gemini
// app.post("/ask-gemini", async (req, res) => {
//     try {
//         const question = req.body.question;

//         // Validate question
//         if (typeof question !== "string" || !question.trim()) {
//             return res.status(400).json({
//                 error: "Please enter a question."
//             });
//         }

//         if (question.length > 5000) {
//             return res.status(400).json({
//                 error: "Your question must be under 5000 characters."
//             });
//         }

//         // Generate a clear answer
//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: `Answer in simple, clear English.
// Use short paragraphs and headings when helpful.
// Use bullet points for lists.
// Avoid unnecessary formatting and decorative symbols.
// Explain technical concepts with examples when useful.

// Question: ${question}`
//         });

//         if (!response.text) {
//             return res.status(502).json({
//                 error: "Gemini did not return an answer. Please try again."
//             });
//         }

//         // Send answer to frontend
//         res.json({
//             answer: response.text
//         });

//     } catch (error) {
//         console.error("Gemini API error:", error);

//         res.status(500).json({
//             error: "Unable to generate an answer. Please try again."
//         });
//     }
// });


// app.listen(PORT, "0.0.0.0", () => {
//     console.log(`Server running on port ${PORT}`);
// });
// export default app;




import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve frontend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, "../frontend");

// Middleware
app.use(express.json());
app.use(express.static(frontendPath));

// Check API key
if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing. Configure it in your environment.");
    process.exit(1);
}

// Initialize Gemini API
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Ask Gemini endpoint
app.post("/ask-gemini", async (req, res) => {
    try {
        const { question } = req.body ?? {};

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

        // Generate an answer
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Answer in simple, clear English.
Use short paragraphs and headings when helpful.
Use bullet points for lists.
Avoid unnecessary formatting and decorative symbols.
Explain technical concepts with examples when useful.

Question: ${question.trim()}`
        });

        // Check Gemini response
        if (!response.text) {
            return res.status(502).json({
                error: "Gemini did not return an answer. Please try again."
            });
        }

        // Return answer to frontend
        return res.json({
            answer: response.text
        });

    } catch (error) {
        console.error("Gemini API error:", error);

        return res.status(500).json({
            error: "Unable to generate an answer. Please try again."
        });
    }
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found."
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
































