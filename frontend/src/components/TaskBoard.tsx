// src/components/TaskBoard.tsx
import React from "react";
import type { TaskProps } from "./interfaces/commonInterface";




const TaskBoard: React.FC<TaskProps> = ({
  tasks,
  onCreateTask,
  onTaskClick,
  hideCreateButton = false,
}) => {
  const pending = tasks.filter((t) => t.status === "pending");
  const inProgress = tasks.filter((t) => t.status === "inprogress");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <section className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      {/* Header row */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks Dashboard</h1>
        {!hideCreateButton && ( // 👈 conditionally show button
          <button
            onClick={onCreateTask}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            + Create Task
          </button>
        )}
      </div>

      {/* 3-column responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">🕓 Pending</h2>
          <div className="space-y-3">
            {pending.map((task) => (
              <div
                key={task._id}
                onClick={() => onTaskClick(task)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
              >
                <h3 className="font-medium text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Priority: <span className="font-semibold">{task.priority}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">⚙️ In Progress</h2>
          <div className="space-y-3">
            {inProgress.map((task) => (
              <div
                key={task._id}
                onClick={() => onTaskClick(task)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
              >
                <h3 className="font-medium text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Priority: <span className="font-semibold">{task.priority}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Completed */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">✅ Completed</h2>
          <div className="space-y-3">
            {completed.map((task) => (
              <div
                key={task._id}
                onClick={() => onTaskClick(task)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
              >
                <h3 className="font-medium text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Priority: <span className="font-semibold">{task.priority}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskBoard;
