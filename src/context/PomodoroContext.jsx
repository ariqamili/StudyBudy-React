import { createContext, useContext, useState } from "react";

const PomodoroContext = createContext();

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
};

export function PomodoroProvider({ children }) {
  const [settings, setSettings] = useState({
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
  });

  const [sessions, setSessions] = useState([]);

  const addSession = (session) => {
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...session,
    };
    setSessions((prev) => [...prev, newSession]);
  };

  const getTodaySessions = () => {
    const today = new Date().toISOString().split("T")[0];
    return sessions.filter((session) => session.date === today);
  };

  return (
    <PomodoroContext.Provider
      value={{
        settings,
        setSettings,
        sessions,
        addSession,
        getTodaySessions,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}
