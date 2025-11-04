import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import TaskBoard from "../components/TaskBoard";
import TaskModal from "../components/TaskModal";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import type { Project, Task } from "../components/interfaces/commonInterface";
import { fetchUserProjects, fetchUserTasks, updateTaskStatus } from "../services/memberApi";
  

const UserDashboard = (): React.JSX.Element => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
   const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"]  // <-- this allows cookies to be sent
});
socket.on("connect", () => {
  console.log("✅ Connected to socket server:", socket.id);
});
socket.on("notification", (data) => {
      console.log("📩 Live Notification received:", data);
      toast.success(`🔔 ${data.message}`);
});


socket.on("disconnect", (reason) => {

  if (reason === "io server disconnect") {
    socket.connect(); // try reconnecting manually
  }
});

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchUserProjects();
        setProjects(data);
      } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
    };

    loadProjects();
  }, []);

 useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchUserTasks();
        setTasks(data);
      } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

 const handleTaskUpdate = async (updatedTask: Task) => {
  try {
    if(!updatedTask._id) return;
    const res = await updateTaskStatus(updatedTask._id, updatedTask.status);

    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? res : t))
    );

    toast.success("Task status updated!");
    setIsTaskModalOpen(false);
  } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
};

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <header className="h-[10vh]">
          <Header />
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading your dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="h-[10vh]">
        <Header />
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT: User's Projects */}
        <aside className="md:w-[30%] w-full bg-gray-100 border-b md:border-r md:border-b-0 overflow-y-auto p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            My Projects
          </h2>

          <ul className="space-y-3">
            {projects.length > 0 ? (
              projects.map((p) => (
                <li
                  key={p._id}
                  className="p-3 bg-white rounded-lg shadow hover:bg-blue-50 cursor-default"
                >
                  <div>
                    <div className="font-medium text-gray-800">{p.name}</div>
                    <div className="text-sm text-gray-500">
                      {p.description || "No description"}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No projects found.</p>
            )}
          </ul>
        </aside>

        {/* RIGHT: Task Board */}
        <section className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <TaskBoard
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onCreateTask={() => {}} // no create button
            hideCreateButton
          />
        </section>
      </main>

      {/* Task Modal (Read-Only) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskUpdate}
        mode="edit"
        task={selectedTask}
        readOnlyFields
      />
    </div>
  );
};

export default UserDashboard;
