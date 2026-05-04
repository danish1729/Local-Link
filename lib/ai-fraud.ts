import { GoogleGenerativeAI } from "@google/generative-ai";
import FraudFlag from "@/models/FraudFlag";
import User from "@/models/User";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeBookingForFraud(bookingData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Fetch minimal user context to avoid massive payload
    const customer = await User.findById(bookingData.customerId).select("name email role createdAt").lean();
    const provider = await User.findById(bookingData.providerId).select("name email role createdAt serviceType").lean();

    if (!customer || !provider) return;

    const payload = {
      bookingId: bookingData._id.toString(),
      totalAmount: bookingData.totalAmount,
      hours: bookingData.hours,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      notes: bookingData.notes,
      reasonForBooking: bookingData.reasonForBooking,
      customer: {
        id: customer._id.toString(),
        joined: customer.createdAt,
      },
      provider: {
        id: provider._id.toString(),
        serviceType: provider.serviceType,
        joined: provider.createdAt,
      }
    };

    const prompt = `
      You are an expert AI Fraud Detection system for a professional service marketplace (like Fiverr/Upwork).
      Analyze the following booking transaction data for suspicious activity.

      Look out for these common fraud patterns:
      1. **Money Laundering / Absurd Pricing**: Unusually high prices for basic services or extremely short hours (e.g., $5000 for 1 hour of cleaning).
      2. **Off-Platform Circumvention**: Users sharing phone numbers, emails, or asking to pay outside the app in the notes or reasons.
      3. **Inappropriate / Illegal Services**: Code words or explicit requests for illegal activities.
      4. **Spam / Bot Activity**: Gibberish in the notes, bizarre timeframes (like 3 AM for a plumber, unless emergency), or weird combinations.
      5. **Identity/Account Takeover**: Brand new customer account making massive purchases instantly.
      6. **Location Spoofing / Impossible Logistics**: Booking an in-person physical service but providing a fake or logically impossible address.
      7. **Review Manipulation / Collusion**: Extremely low-value bookings (e.g., 1 hour at $1) with little context, usually done to artificially farm 5-star reviews.
      8. **Extortion / Blackmail Attempts**: Notes threatening negative reviews or platform reports if unreasonable demands aren't met.
      9. **Competitor Sabotage**: Repeatedly booking and holding up calendar slots with highly vague or suspicious details.

      Booking Data to Analyze:
      ${JSON.stringify(payload, null, 2)}

      Respond EXACTLY in this JSON format:
      {
        "isFraudulent": boolean,
        "severity": "Low" | "Medium" | "High" | "Critical",
        "reason": "Detailed explanation of what is suspicious and why.",
        "confidenceScore": number (0-100),
        "suspectedUserId": "User ID of the party mostly likely at fault (or both if collusion is suspected)"
      }
      
      Do NOT wrap the response in markdown blocks (like \`\`\`json). Just return the raw JSON object.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Parse the JSON (handling potential markdown wrapping just in case)
    let aiAnalysis;
    try {
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        aiAnalysis = JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse AI fraud response:", responseText);
        return;
    }

    if (aiAnalysis.isFraudulent && aiAnalysis.severity !== "Low") {
      // Determine the primarily suspected user
      let suspectId = customer._id;
      if (aiAnalysis.suspectedUserId === provider._id.toString()) {
          suspectId = provider._id;
      }

      await FraudFlag.create({
        userId: suspectId,
        bookingId: bookingData._id,
        reason: aiAnalysis.reason,
        severity: aiAnalysis.severity,
        aiConfidenceScore: aiAnalysis.confidenceScore,
        status: "Open"
      });
      
      console.log(`[FRAUD ALERT] Detected ${aiAnalysis.severity} severity fraud on booking ${bookingData._id}`);
    }

  } catch (error) {
    console.error("AI Fraud Detection Error:", error);
  }
}

export async function analyzeMessageForFraud(messageData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    if (!messageData.text || messageData.text.trim() === "") return;

    const payload = {
      messageId: messageData._id.toString(),
      senderId: messageData.senderId.toString(),
      conversationId: messageData.conversationId.toString(),
      text: messageData.text
    };

    const prompt = `
      You are an expert AI Fraud Detection system for a professional service marketplace.
      Analyze the following chat message for suspicious activity.

      Look out for these common fraud patterns:
      1. **Off-Platform Circumvention**: Users sharing phone numbers, emails, or asking to pay outside the app.
      2. **Inappropriate / Illegal Services**: Code words or explicit requests for illegal activities.
      3. **Extortion / Blackmail Attempts**: Threatening negative reviews or platform reports if demands aren't met.
      4. **Scam/Phishing**: Asking for passwords, credit card info, or sending suspicious links.

      Message Data to Analyze:
      ${JSON.stringify(payload, null, 2)}

      Respond EXACTLY in this JSON format:
      {
        "isFraudulent": boolean,
        "severity": "Low" | "Medium" | "High" | "Critical",
        "reason": "Detailed explanation of what is suspicious and why.",
        "confidenceScore": number (0-100)
      }
      
      Do NOT wrap the response in markdown blocks (like \`\`\`json). Just return the raw JSON object.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    let aiAnalysis;
    try {
        const cleanJson = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        aiAnalysis = JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse AI fraud response for message:", responseText);
        return;
    }

    if (aiAnalysis.isFraudulent && aiAnalysis.severity !== "Low") {
      await FraudFlag.create({
        userId: messageData.senderId,
        messageId: messageData._id,
        conversationId: messageData.conversationId,
        reason: aiAnalysis.reason,
        severity: aiAnalysis.severity,
        aiConfidenceScore: aiAnalysis.confidenceScore,
        status: "Open"
      });
      
      console.log(`[FRAUD ALERT] Detected ${aiAnalysis.severity} severity fraud on chat message ${messageData._id}`);
    }
  } catch (error) {
    console.error("AI Message Fraud Detection Error:", error);
  }
}
