// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ProjectFormModal from "../components/ProjectFormModal";
import type { Project, Task } from "../components/interfaces/commonInterface";
import { toast } from "react-toastify";
import TaskModal from "../components/TaskModal";
import TaskBoard from "../components/TaskBoard";
import { io } from "socket.io-client";
import {
  createProject,
  createTask,
  deleteProject,
  fetchAdminProjects,
  fetchAdminTasks,
  updateProject,
  updateTask,
} from "../services/memberApi";

const AdminDashboard = (): React.JSX.Element => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await fetchAdminProjects();
        setProjects(projects);
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

  const socket = io(import.meta.env.VITE_SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket"], // <-- this allows cookies to be sent
  });
  socket.on("connect", () => {
    console.log("✅ Connected to socket server:", socket.id);
  });

  socket.on("notification", (data) => {
    console.log("📩 Live Notification received:", data);
    toast.success(`🔔 ${data.message}`);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected from server:", reason);

    if (reason === "io server disconnect") {
      socket.connect();
    }
  });

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await fetchAdminTasks();
        setTasks(tasks);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    };
    loadTasks();
  }, []);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return toast.error("Project ID missing.");
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((proj) => proj._id !== id));
      toast.success("Project Deleted Successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleSubmit = async (project: Project) => {
    try {
      if (!project._id) {
        const newProject = await createProject(project);
        setProjects((prev) => [newProject, ...prev]);
      } else {
        const updatedProject = await updateProject(project);
        setProjects((prev) =>
          prev.map((p) =>
            p._id === project._id ? { ...p, ...updatedProject } : p
          )
        );
      }
      setIsModalOpen(false);
    } catch (error: unknown) {
      console.log("error",error);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const openCreate = () => {
    setModalMode("create");
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setModalMode("edit");
    setSelectedProject(p);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = async (task: Task) => {
    try {
      // ✅ Handle deletion (sent from TaskModal)
      if (task._id === "deleted") {
        setTasks((prev) => prev.filter((t) => t._id !== selectedTask?._id));
        setIsTaskModalOpen(false);
        return;
      }

      if (taskModalMode === "create") {
        const newTask = await createTask(task);
        setTasks((prev) => [newTask, ...prev]);
        toast.success("Task created!");
      }
      // ✅ Handle update
      else {
        const updatedTask = await updateTask(task);
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? updatedTask : t))
        );
        toast.success("Task updated!");
      }

      setIsTaskModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleCreateTask = () => {
    setTaskModalMode("create");
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setTaskModalMode("edit");
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="h-[10vh]">
        <Header />
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT: Projects list */}
        <aside className="md:w-[30%] w-full bg-gray-100 border-b md:border-r md:border-b-0 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Projects</h2>
            <button
              onClick={openCreate}
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
            >
              + Create
            </button>
          </div>

          <ul className="space-y-3">
            {projects.map((p) => (
              <li
                key={p._id}
                className="p-3 bg-white rounded-lg shadow hover:bg-blue-50 flex justify-between items-center"
              >
                <div
                  onClick={() => openEdit(p)}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.description}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p._id);
                  }}
                  className="ml-3 text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition"
                  title="Delete Project"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* RIGHT: Task section */}
        <section className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {/* Task board (3 columns: Pending, In Progress, Done) */}
          <TaskBoard
            tasks={tasks}
            onCreateTask={handleCreateTask}
            onTaskClick={handleTaskClick}
          />
        </section>
      </main>

      {/* Modals */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        mode={modalMode}
        project={selectedProject}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        mode={taskModalMode}
        task={selectedTask}
      />
    </div>
  );
};

export default AdminDashboard;
