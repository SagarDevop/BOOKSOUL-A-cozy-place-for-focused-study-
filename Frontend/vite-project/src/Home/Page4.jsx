import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ambientOptions = [
  { label: "Rain", value: "rain", file: "/sounds/calming-rain-257596.mp3" },
  { label: "Forest", value: "forest", file: "/sounds/forest-atmosphere-localization-poland-320813.mp3" },
  { label: "Fireplace", value: "fireplace", file: "/sounds/fireplace-loop-original-noise-178209.mp3" },
  { label: "Ocean", value: "ocean", file: "/sounds/ocean-waves-1-321649.mp3" },
  { label: "Cafe", value: "cafe", file: "/sounds/cafe-noise-32940.mp3" },
];

export default function Page4() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [ambienceOpen, setAmbienceOpen] = useState(false);
  const [selectedSound, setSelectedSound] = useState("");
  const [currentFile, setCurrentFile] = useState("");
  const audioRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [feedback, setFeedback] = useState("");
  

  const feedbackmessage = () =>
  {
    if (feedback.trim() === "") {
      alert("Please enter your feedback before submitting.");
      return;
    }
    const newReview = { id: Date.now(), text: feedback };
    setReviews((prevReviews) => [...prevReviews, newReview]);
    setFeedback("");
    alert("Thank you for your feedback!");
  }

  useEffect(() => {
    let timer;
    if (running && (minutes > 0 || seconds > 0)) {
      timer = setTimeout(() => {
        if (seconds === 0) {
          setMinutes((m) => m - 1);
          setSeconds(59);
        } else {
          setSeconds((s) => s - 1);
        }
      }, 1000);
    } else if (running && minutes === 0 && seconds === 0) {
      setRunning(false);
    }
    return () => clearTimeout(timer);
  }, [running, minutes, seconds]);

  const startTimer = () => {
    if (minutes > 0 || seconds > 0) setRunning(true);
  };

  const resetTimer = () => {
    setRunning(false);
    setMinutes(25);
    setSeconds(0);
  };

  const handleAmbiencePlay = () => {
    setAmbienceOpen(true);
  };

  const handleSoundSelect = (soundLabel, filePath) => {
    setSelectedSound(soundLabel);
    setCurrentFile(filePath);
    setAmbienceOpen(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }
    const newAudio = new Audio(filePath);
    newAudio.loop = true;
    newAudio.play();
    audioRef.current = newAudio;
  };

  const floatingAnimation = {
    animate: { y: [0, -10, 0] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 p-4 sm:p-6 text-white relative overflow-hidden">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">🎧 Focus Zone</h1>

      {/* Main content wrapper */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">

        {/* Focus Timer */}
        <motion.div
          {...floatingAnimation}
          className="w-full sm:w-80 p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-2">🎯 Focus Timer</h2>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={minutes}
              disabled={running}
              onChange={(e) => setMinutes(parseInt(e.target.value || "0"))}
              className="w-20 text-center px-2 py-1 bg-white/20 rounded"
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              placeholder="Sec"
              value={seconds}
              disabled={running}
              onChange={(e) => setSeconds(parseInt(e.target.value || "0"))}
              className="w-20 text-center px-2 py-1 bg-white/20 rounded"
            />
          </div>
          <div className="text-3xl font-bold mb-4">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <button
            onClick={startTimer}
            disabled={running}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
          >
            ▶ Start
          </button>
          <button
            onClick={resetTimer}
            className="ml-4 bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
          >
            🔁 Reset
          </button>
        </motion.div>

        {/* Ambience */}
        <motion.div
          {...floatingAnimation}
          transition={{ ...floatingAnimation.transition, delay: 1 }}
          className="w-full sm:w-80 p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-4">🔊 Study Ambience</h2>
          <button
            onClick={handleAmbiencePlay}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            🎵 Play Ambience
          </button>
          {selectedSound && (
            <div className="mt-2 text-sm text-gray-300">
              Now playing: <strong>{selectedSound}</strong>
            </div>
          )}
        </motion.div>
      </div>

      {/* Feedback Section */}
      <motion.div
        {...floatingAnimation}
        transition={{ ...floatingAnimation.transition, delay: 2 }}
        className="mt-10 mx-auto max-w-md w-full p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-2">💬 Feedback & Suggestions</h2>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Let us know how we can improve..."
          className="w-full p-2 rounded bg-white/20 text-white placeholder-gray-300"
          rows="3"
        />
        <button onClick={feedbackmessage} className="mt-3 bg-purple-500 px-4 py-2 rounded hover:bg-purple-600 transition">
          ✉ Submit
        </button>
      </motion.div>

      {/* Modal for Sound Options */}
      {ambienceOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg w-11/12 max-w-sm">
            <h3 className="text-xl font-semibold mb-4">🎼 Choose Ambience</h3>
            <ul className="space-y-2">
              {ambientOptions.map((opt) => (
                <li key={opt.value}>
                  <button
                    onClick={() => handleSoundSelect(opt.label, opt.file)}
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-200"
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setAmbienceOpen(false)}
              className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
