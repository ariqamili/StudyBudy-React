import { useState } from "react";
import { useFetch } from "../hooks/useFetch.js";
import { Spinner } from "../components/Spinner.jsx";

const QUADRANTS = {
  urgent_important: {
    title: "🔥 Urgent & Important",
    color: "bg-gradient-to-br from-red-400 to-pink-500",
    borderColor: "border-red-300",
    textColor: "text-white",
    bgLight: "bg-red-50",
  },
  not_urgent_important: {
    title: "⭐ Not Urgent & Important",
    color: "bg-gradient-to-br from-blue-400 to-cyan-500",
    borderColor: "border-blue-300",
    textColor: "text-white",
    bgLight: "bg-blue-50",
  },
  urgent_not_important: {
    title: "⚡ Urgent & Not Important",
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
    borderColor: "border-yellow-300",
    textColor: "text-white",
    bgLight: "bg-yellow-50",
  },
  not_urgent_not_important: {
    title: "📝 Not Urgent & Not Important",
    color: "bg-gradient-to-br from-gray-400 to-gray-500",
    borderColor: "border-gray-300",
    textColor: "text-white",
    bgLight: "bg-gray-50",
  },
};

export function EisenhowerMatrix() {
  const [newTask, setNewTask] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const {
    data: todos,
    loading,
    loadData,
    createData,
    updateData,
    deleteData,
  } = useFetch(
    "https://685586301789e182b37b8cfa.mockapi.io/studybudy/todos",
    true
  );

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await createData({
        title: newTask,
        completed: false,
        quadrant: "not_urgent_not_important",
      });
      setNewTask("");
      loadData();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateData(task.id, {
        ...task,
        completed: !task.completed,
      });
      loadData();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteData(taskId);
      loadData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, quadrant) => {
    e.preventDefault();

    if (draggedTask && draggedTask.quadrant !== quadrant) {
      try {
        await updateData(draggedTask.id, {
          ...draggedTask,
          quadrant,
        });
        loadData();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }

    setDraggedTask(null);
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
  };

  const getTasksByQuadrant = (quadrant) => {
    return todos.filter(
      (todo) => (todo.quadrant || "not_urgent_not_important") === quadrant
    );
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Eisenhower Matrix
        </h1>
        <p className="text-xl text-gray-600">
          Organize your tasks by priority and urgency
        </p>
      </div>

      <form onSubmit={handleCreateTask} className="max-w-2xl mx-auto">
        <div className="flex gap-4">
          <input
            type="text"
            id="new-task"
            name="newTask"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-6 py-4 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 text-lg bg-white/80 backdrop-blur-sm"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg text-lg"
          >
            Add Task
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.entries(QUADRANTS).map(([quadrant, config]) => (
          <div
            key={quadrant}
            className={`${config.color} rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:shadow-3xl min-h-[400px]`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, quadrant)}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <h3 className={`font-bold text-2xl mb-6 ${config.textColor}`}>
              {config.title}
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {getTasksByQuadrant(quadrant).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className={`p-4 rounded-2xl shadow-lg cursor-move hover:shadow-xl transition-all duration-200 group border border-white/20 ${
                    task.completed
                      ? "bg-white/50 backdrop-blur-sm opacity-75"
                      : "bg-white/90 backdrop-blur-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(task);
                      }}
                      className={`relative w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                        task.completed
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 shadow-lg"
                          : "border-gray-300 hover:border-green-400 bg-white"
                      }`}
                    >
                      {task.completed && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    <span
                      className={`flex-1 font-medium transition-all duration-200 ${
                        task.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-800"
                      }`}
                    >
                      {task.title || task.task}
                    </span>

                    {task.completed && (
                      <span className="text-xs px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold shadow-sm flex-shrink-0">
                        ✅ Done
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-full hover:bg-red-50 flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {getTasksByQuadrant(quadrant).length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📋</div>
                  <p className={`${config.textColor} opacity-80`}>
                    Drop tasks here
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
