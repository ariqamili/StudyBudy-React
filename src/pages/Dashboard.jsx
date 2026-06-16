import { useMemo } from "react";
import { useFetch } from "../hooks/useFetch.js";
import { usePomodoro } from "../context/PomodoroContext.jsx";
import { Link } from "react-router-dom";
import { Spinner } from "../components/Spinner.jsx";

export function Dashboard() {
  const { data: todos, loading } = useFetch(
    "https://685586301789e182b37b8cfa.mockapi.io/studybudy/todos",
    true
  );
  const { getTodaySessions } = usePomodoro();

  const todaySessions = getTodaySessions();

  const pendingTasks = useMemo(() => {
    return todos.filter((todo) => !todo.completed).slice(0, 5);
  }, [todos]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Welcome back to StudyBudy! 🎉
        </h1>
        <p className="text-xl text-gray-600">
          Let's make today productive and amazing!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Today's Sessions</h3>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
          <p className="text-4xl font-bold mb-2">{todaySessions.length}</p>
          <p className="text-blue-100">Pomodoro sessions completed</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Pending Tasks</h3>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
          <p className="text-4xl font-bold mb-2">{pendingTasks.length}</p>
          <p className="text-green-100">Tasks waiting for you</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Focus Time</h3>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
          <p className="text-4xl font-bold mb-2">
            {todaySessions.length * 25}m
          </p>
          <p className="text-purple-100">Minutes of focused work</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              📋 Recent Tasks
            </h2>
            <Link
              to="/matrix"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-semibold shadow-lg"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mr-4 shadow-sm"></div>
                <span className="text-gray-700 font-medium">
                  {task.title || task.task}
                </span>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="text-center py-8">
                <span className="text-6xl mb-4 block">🎉</span>
                <p className="text-gray-500 text-lg">
                  No pending tasks - Great job!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🍅 Today's Sessions
            </h2>
            <Link
              to="/timer"
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg"
            >
              Start Timer →
            </Link>
          </div>

          <div className="space-y-4">
            {todaySessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100 hover:shadow-lg transition-all duration-200"
              >
                <span className="text-gray-700 font-medium">
                  {session.type} Session
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-sm">
                  {session.duration}m
                </span>
              </div>
            ))}
            {todaySessions.length === 0 && (
              <div className="text-center py-8">
                <span className="text-6xl mb-4 block">🚀</span>
                <p className="text-gray-500 text-lg">
                  Ready to start your first session?
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
