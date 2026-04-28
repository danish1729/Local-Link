import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Key exists?", !!apiKey);
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Hello" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Hi" }],
                },
            ],
        });
        const result = await chat.sendMessage("How are you?");
        const response = result.response;
        console.log("Response text:", response.text());
    } catch (e) {
        console.error("Error:", e.message);
    }
}

run();
