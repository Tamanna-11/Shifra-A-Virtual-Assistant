import React, { createContext, useState } from "react";
import run from "../gemini"; // Import AI function

export const dataContext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("Listening...");
  const [response, setResponse] = useState(false);

  function speak(text) {
    if (!text) {
      console.error("❌ No text to speak!");
      return;
    }
    let cleanText = text.replace(/\*/g, "");
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    let text_speak = new SpeechSynthesisUtterance(cleanText);
    text_speak.volume = 1;
    text_speak.rate = 0.9;
    text_speak.pitch = 1;
    text_speak.lang = "en-US";

    console.log("🔊 Speaking:", cleanText);

    text_speak.onerror = (e) => console.error("❌ Speech synthesis error:", e);

    text_speak.onstart = () => {
      setSpeaking(true);
      setResponse(true);
      setPrompt(text);
    };

    text_speak.onend = () => {
      setSpeaking(false);
      setResponse(false);
    };

    setTimeout(() => {
      window.speechSynthesis.speak(text_speak);
    }, 100);
  }

  async function aiResponse(userInput) {
    console.log("🤖 Sending to AI:", userInput);
    try {
      setPrompt(userInput);
      setResponse(false); // Reset response before getting AI reply
      let aiText = await run(userInput);

      let newText = aiText.replace(/google/gi, "Tamanna Jhorar"); // Replace "google" with "Tamanna Jhorar"

      console.log("✅ AI Response:", newText);
      setPrompt(newText);
      speak(newText);
      setResponse(true);
    } catch (error) {
      console.error("❌ Error fetching AI response:", error);
      setPrompt("Error getting response.");
    }
  }

  let speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!speechRecognition) {
    console.error("❌ Speech Recognition Not Supported!");
    alert("Your browser does not support Speech Recognition.");
    return null;
  }

  let recognition = new speechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    console.log("🎙️ Speech Recognition Started...");
    setSpeaking(true);
    setPrompt("Listening...");
    setResponse(false);
  };

  recognition.onresult = (e) => {
    let transcript = e.results[e.resultIndex][0].transcript;
    console.log("🎙️ Recognized:", transcript);
    setPrompt(transcript);
    setResponse(false); // Ensure it doesn't show AI response yet

    setTimeout(() => {
      takeCommand(transcript.toLowerCase()); // ✅ Pass the command to AI
    }, 500);
  };

  recognition.onerror = (e) => console.error("❌ Speech Recognition Error:", e);

  recognition.onend = () => {
    console.log("🛑 Speech Recognition Stopped.");
    setSpeaking(false);
  };

  function takeCommand(command) {
    if (command.includes("open") && command.includes("youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      speak("Opening YouTube");
      setResponse(true);
      setPrompt("Opening YouTube");
    } else if (command.includes("open") && command.includes("google")) {
      window.open("https://www.google.com/", "_blank");
      speak("Opening Google");
      setResponse(true);
      setPrompt("Opening Google");
    } else if (command.includes("time")) {
      let time = new Date().toLocaleTimeString();
      speak(`The time is ${time}`);
      setResponse(true);
      setPrompt(`The time is ${time}`);
    } else if (command.includes("date")) {
      let date = new Date().toLocaleDateString();
      speak(`Today's date is ${date}`);
      setResponse(true);
      setPrompt(`Today's date is ${date}`);
    } else {
      aiResponse(command);
    }
  }

  let value = {
    recognition,
    speaking,
    prompt,
    response,
    setResponse,
    startListening: () => {
      setPrompt("Listening...");
      setSpeaking(true);
      setResponse(false);
      recognition.start();
    },
  };

  return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
}

export default UserContext;
