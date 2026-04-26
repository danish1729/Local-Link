import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🤖 1. Define the Logic Fallback (Plan B)
// If the API Key fails, this simple bot takes over so your app never crashes.
function getFallbackReply(message: string) {
  const lower = message.toLowerCase();
  if (
    lower.includes("plumber") ||
    lower.includes("water") ||
    lower.includes("leak")
  ) {
    return "You should check out our Plumbers section! Go to the 'Services' page to find top-rated professionals.";
  }
  if (lower.includes("login") || lower.includes("sign in")) {
    return "You can log in using the button at the top right of the header.";
  }
  if (lower.includes("signup") || lower.includes("register")) {
    return "Join our community! Click 'Sign Up' to create a Customer or Provider account.";
  }
  if (lower.includes("hello") || lower.includes("hi")) {
    return "Hello! I am the LocalLink Assistant. I can help you find services or navigate the app.";
  }
  return "I can help you find local services like Plumbers, Electricians, and Tutors. Try asking me about them!";
}

export async function POST(req: Request) {
    const { message } = await req.json();
  try {
    

    // 🔑 2. Validate API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ No API Key found. Using Fallback Bot.");
      return NextResponse.json({ reply: getFallbackReply(message) });
    }

    // 🚀 3. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);

    // 🔥 FIX: Use 'gemini-1.0-pro' (The most stable, widely available model)
    // If this fails, the catch block will trigger the fallback.
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are the support assistant for LocalLink. Keep answers short (max 2 sentences). Guide users to the Services, Login, or Signup pages.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Understood. I will help LocalLink users find services and navigate the app concisely.",
            },
          ],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: unknown) {
    console.error("❌ Gemini API Error:", error instanceof Error ? error.message : String(error));

    // 🛡️ 4. The Safety Net
    // If Google API fails (404, 500, etc), return the Logic Fallback response
    // so the user still gets a helpful answer.
    return NextResponse.json({
      reply: getFallbackReply(message),
    });
  }
}
