let apiKey = "AIzaSyBM0IlONPq0iGk8apbJeriaFNfXRi_YOdo";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Initialize the Gemini model
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Optional generation settings
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 256, // Increase token count for longer replies
  responseMimeType: "text/plain",
};

// Main function to run prompt through Gemini
async function run(prompt) {
  try {
    console.log("🔁 Sending prompt to Gemini:", prompt);

    // Start a chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [], // You can populate history if needed
    });

    // Send message to Gemini model
    const result = await chatSession.sendMessage(prompt);

    // Validate and extract the text response
    if (!result || !result.response || typeof result.response.text !== "function") {
      throw new Error("Invalid response format from Gemini API");
    }

    const text = await result.response.text(); // ✅ Use await here
    console.log("✅ Gemini response:", text);
    return text;

  } catch (error) {
    console.error("❌ Error in run():", error.message);
    return "Sorry, I couldn’t process your request.";
  }
}

export default run;
