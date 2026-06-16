import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { EisenhowerMatrix } from "./pages/EisenhowerMatrix.jsx";
import { PomodoroTimer } from "./pages/PomodoroTimer.jsx";
import { PomodoroProvider } from "./context/PomodoroContext.jsx";

export function App() {
  return (
    <PomodoroProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="matrix" element={<EisenhowerMatrix />} />
          <Route path="timer" element={<PomodoroTimer />} />
        </Route>
      </Routes>
    </PomodoroProvider>
  );
}
