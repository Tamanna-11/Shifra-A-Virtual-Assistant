import React, { createContext, useState } from "react";
import run from "../gemini"; // AI function

// Exporting the context object
export const UserContext = createContext();

function UserContextProvider({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("Listening...");
  const [response, setResponse] = useState(false);

  function speak(text) {
    if (!text) {
      console.error("❌ No text to speak!");
      return;
    }

    let cleanText = text.replace(/\*/g, "");
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.volume = 1;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onerror = (e) => console.error("❌ Speech synthesis error:", e);
    utterance.onstart = () => {
      setSpeaking(true);
      setResponse(true);
      setPrompt(text);
    };
    utterance.onend = () => {
      setSpeaking(false);
      setResponse(false);
    };

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  }

  async function aiResponse(userInput) {
    try {
      setPrompt(userInput);
      setResponse(false);
      const aiText = await run(userInput);
      const finalText = aiText.replace(/google/gi, "Tamanna Jhorar");
      setPrompt(finalText);
      speak(finalText);
      setResponse(true);
    } catch (error) {
      console.error("❌ Error fetching AI response:", error);
      setPrompt("Error getting response.");
    }
  }

  const speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!speechRecognition) {
    alert("Speech Recognition not supported in your browser.");
    return null;
  }

  const recognition = new speechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    setSpeaking(true);
    setPrompt("Listening...");
    setResponse(false);
  };

  recognition.onresult = (e) => {
    const transcript = e.results[e.resultIndex][0].transcript;
    setPrompt(transcript);
    setResponse(false);
    setTimeout(() => takeCommand(transcript.toLowerCase()), 500);
  };

  recognition.onerror = (e) => console.error("❌ Speech Recognition Error:", e);
  recognition.onend = () => setSpeaking(false);

  function takeCommand(command) {
    if (command.includes("open") && command.includes("youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      speak("Opening YouTube");
      setPrompt("Opening YouTube");
      setResponse(true);
    } else if (command.includes("open") && command.includes("google")) {
      window.open("https://www.google.com/", "_blank");
      speak("Opening Google");
      setPrompt("Opening Google");
      setResponse(true);
    } else if (command.includes("time")) {
      const time = new Date().toLocaleTimeString();
      speak(`The time is ${time}`);
      setPrompt(`The time is ${time}`);
      setResponse(true);
    } else if (command.includes("date")) {
      const date = new Date().toLocaleDateString();
      speak(`Today's date is ${date}`);
      setPrompt(`Today's date is ${date}`);
      setResponse(true);
    } else {
      aiResponse(command);
    }
  }

  const contextValue = {
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

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export default UserContextProvider;
