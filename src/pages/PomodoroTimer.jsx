import { useState, useEffect, useRef } from "react";
import { usePomodoro } from "../context/PomodoroContext.jsx";

export function PomodoroTimer() {
  const { settings, setSettings, addSession } = usePomodoro();
  const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState("work");
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);

    addSession({
      type: currentSession,
      duration:
        currentSession === "work" ? settings.workTime : settings.breakTime,
      completedAt: new Date().toISOString(),
    });

    if (currentSession === "work") {
      setCurrentSession("break");
      setTimeLeft(settings.breakTime * 60);
    } else {
      setCurrentSession("work");
      setTimeLeft(settings.workTime * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setCurrentSession("work");
    setTimeLeft(settings.workTime * 60);
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    if (!isActive) {
      setTimeLeft(newSettings.workTime * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress =
    currentSession === "work"
      ? ((settings.workTime * 60 - timeLeft) / (settings.workTime * 60)) * 100
      : ((settings.breakTime * 60 - timeLeft) / (settings.breakTime * 60)) *
        100;

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
          Pomodoro Timer 🍅
        </h1>
        <p className="text-xl text-gray-600">
          Focus with the power of time-blocking
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center border border-white/20">
        <div className="mb-8">
          <div
            className={`inline-flex items-center px-6 py-3 rounded-2xl font-bold text-lg mb-4 ${
              currentSession === "work"
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            }`}
          >
            <span className="mr-2">
              {currentSession === "work" ? "🔥" : "☕"}
            </span>
            {currentSession === "work" ? "Work Session" : "Break Time"}
          </div>
        </div>

        <div className="relative mb-8">
          <svg className="w-80 h-80 mx-auto transform -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="120"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="160"
              cy="160"
              r="120"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={
                currentSession === "work" ? "text-red-500" : "text-green-500"
              }
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={toggleTimer}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg ${
              isActive
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            }`}
          >
            {isActive ? "⏸️ Pause" : "▶️ Start"}
          </button>

          <button
            onClick={resetTimer}
            className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg"
          >
            🔄 Reset
          </button>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg"
        >
          ⚙️ Settings
        </button>
      </div>

      {showSettings && (
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Timer Settings
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Work Time (minutes)
              </label>
              <input
                type="number"
                value={settings.workTime}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    workTime: Number.parseInt(e.target.value) || 25,
                  })
                }
                className="w-full px-6 py-4 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 text-lg bg-white/80"
                min="1"
                max="60"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Break Time (minutes)
              </label>
              <input
                type="number"
                value={settings.breakTime}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    breakTime: Number.parseInt(e.target.value) || 5,
                  })
                }
                className="w-full px-6 py-4 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 text-lg bg-white/80"
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
