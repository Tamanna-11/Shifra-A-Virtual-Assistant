import React, { useContext, useEffect, useRef } from "react";
import "./App.css";
import va from "./assets/ai.png";
import { CiMicrophoneOn } from "react-icons/ci";
import { dataContext } from "./context/userContext";
import speakimg from "./assets/speak(1).gif";
import aigif from "./assets/aiVoice.gif";

function App() {
  let { recognition, speaking, prompt, response } = useContext(dataContext);

  const responseRef = useRef(null); // Reference for auto-scrolling

  useEffect(() => {
    // Scroll to bottom when new text appears
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [prompt]); // Trigger scroll whenever prompt updates

  const startListening = () => {
    if (!recognition) {
      console.error("❌ Speech recognition is not supported in this browser.");
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    console.log("🎙️ Starting speech recognition...");
    recognition.start();
  };

  return (
    <div className="main">
      <img src={va} alt="Shifra AI" id="shifra" />
      <span>I'm Shifra, Your Advanced Virtual Assistant</span>

      {!speaking ? (
        <button onClick={startListening} className="listen-btn">
          Click here <CiMicrophoneOn />
        </button>
      ) : (
        <div className="response-container" ref={responseRef}>
          {response ? (
            <img src={aigif} alt="AI Speaking" id="aigif" />
          ) : (
            <img src={speakimg} alt="Listening" id="speak" />
          )}
          <p>{prompt}</p>
        </div>
      )}
    </div>
  );
}

export default App;
