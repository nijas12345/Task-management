import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type {
  Project,
  Task,
  TaskModalProps,
} from "./interfaces/commonInterface";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { TaskActivity } from "./interfaces/commonInterface";
import {
  deleteTask,
  fetchAssignees,
  fetchProjects,
} from "../services/memberApi";

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  task,
  readOnlyFields = false,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [projectId, setProjectId] = useState<string>("");
  const [assignee, setAssignee] = useState<string>("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [status, setStatus] = useState<"pending" | "inprogress" | "completed">(
    "pending"
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [showActivityLog, setShowActivityLog] = useState(false);

  const handleDelete = async () => {
    if (!task?._id) return toast.error("Task ID missing.");

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(task._id);
      toast.success("Task deleted successfully!");
      onSubmit({ ...task, _id: "deleted" } as Task);
      onClose();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete task.");
    }
  };

  // Load task details when editing/viewing
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDeadline(task.deadline ? new Date(task.deadline) : null);
      setProjectId(task.projectId || "");
      setAssignee(task.assignee || "");
      setPriority(task.priority || "Medium");
      setStatus(task.status || "pending");
    } else {
      setTitle("");
      setDescription("");
      setDeadline(null);
      setProjectId("");
      setAssignee("");
      setPriority("Medium");
      setStatus("pending");
    }
  }, [task]);

  useEffect(() => {
    if (!isOpen) return;

    const loadProjects = async () => {
      try {
        const data = await fetchProjects(readOnlyFields);
        setProjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadProjects();
  }, [isOpen, readOnlyFields]);

  // Fetch members (admin only)
  useEffect(() => {
    if (!projectId || readOnlyFields) return;

    const loadAssignees = async () => {
      try {
        const data = await fetchAssignees(projectId);
        setAssignees(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadAssignees();
  }, [projectId, readOnlyFields]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (readOnlyFields && task) {
      const updatedTask = { ...task, status };
      onSubmit(updatedTask);
      onClose();
      return;
    }

    // Validation for admin create/edit
    if (!title.trim()) return toast.error("Please enter a task title.");
    if (!description.trim()) return toast.error("Please enter a description.");
    if (!projectId.trim()) return toast.error("Please select a project.");
    if (!assignee.trim()) return toast.error("Please select an assignee.");
    if (!deadline) return toast.error("Please choose a deadline date.");

    const newTask: Task = {
      _id: task?._id,
      title,
      description,
      deadline,
      projectId,
      assignee,
      priority,
      status: task?.status || "pending",
    };

    onSubmit(newTask);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white h-[90%] w-[90%] max-w-3xl p-6 rounded-xl shadow-lg relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {readOnlyFields
            ? "Task Details"
            : mode === "create"
            ? "Create New Task"
            : "Edit Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Task Name
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task name"
                className="w-full rounded-lg border-gray-300 shadow-sm mt-1 p-2"
                disabled={readOnlyFields}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full rounded-lg border-gray-300 shadow-sm mt-1 p-2"
                disabled={readOnlyFields}
              />
            </div>
          </div>

          {/* Deadline, Project, Assignee */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deadline
              </label>
              {readOnlyFields ? (
                <div className="mt-2 text-gray-700">
                  {deadline?.toLocaleDateString() || "No deadline"}
                </div>
              ) : (
                <DatePicker
                  selected={deadline || new Date()}
                  onChange={(date: Date | null) => setDeadline(date)}
                  dateFormat="yyyy/MM/dd"
                  minDate={new Date()}
                  className="w-full rounded-lg border-gray-300 shadow-sm mt-1 p-2"
                  placeholderText="Select a deadline"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project
              </label>
              {readOnlyFields ? (
                <div className="mt-2 text-gray-700">
                  {
                    // Find the project name from the list by matching IDs
                    projects.find((p) => p._id === task?.projectId)?.name || "-"
                  }
                </div>
              ) : (
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm mt-1 p-2"
                >
                  <option value="">Select a project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assignee
              </label>
              {readOnlyFields ? (
                <div className="mt-2 text-gray-700">{task?.assignee}</div>
              ) : (
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm mt-1 p-2"
                >
                  <option value="">Select a member</option>
                  {assignees.map((email) => (
                    <option key={email} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Priority / Status */}
          <div>
            {readOnlyFields ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Show the current priority (non-editable) */}
                <div>
                  <span className="text-sm text-gray-500">Priority:</span>
                  <div className="mt-1 text-gray-800 font-medium">
                    {task?.priority || "-"}
                  </div>
                </div>

                {/* Allow user to update status */}
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "pending" | "inprogress" | "completed"
                      )
                    }
                    className="w-full rounded-lg border-gray-300 shadow-sm mt-1 p-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ) : (
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "Low" | "Medium" | "High")
                }
                className="w-full rounded-lg border-gray-300 shadow-sm mt-1 p-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            )}
          </div>
          {/* Activity Log Toggle */}
          {task?.activityLog && task.activityLog.length > 0 && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowActivityLog((prev) => !prev)}
                className="text-sm text-indigo-600 hover:underline"
              >
                {showActivityLog ? "Hide Activity Log" : "View Activity Log"}
              </button>

              {showActivityLog && (
                <div className="mt-3 max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {task.activityLog
                    .slice()
                    .reverse()
                    .map((log: TaskActivity, index: number) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-2 mb-2 last:border-0 last:mb-0"
                      >
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold">{log.user}</span>{" "}
                          {log.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Close
            </button>
            {user?.role === "manager" && mode === "edit" && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {readOnlyFields
                ? "Update Status"
                : mode === "create"
                ? "Create Task"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
