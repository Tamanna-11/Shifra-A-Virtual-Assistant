let apiKey = "AIzaSyAzXZA-dxsDIXQSPn06YB2pbKaR8Pzu90E";  // ⚠️ Never expose API keys in frontend!
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  try {
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(prompt);

    console.log("API Response:", result); // ✅ Debug the response structure

    if (!result || !result.response || typeof result.response.text !== "function") {
      throw new Error("Invalid response format from Gemini API");
    }

    return result.response.text();  // ✅ Safe return after validation
  } catch (error) {
    console.error("Error in run():", error);
    return "Error processing request.";
  }
}

export default run;
