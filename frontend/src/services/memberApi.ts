import api from "../api/axios";
import type { Project, Task } from "../components/interfaces/commonInterface";
import {handleApiError} from '../helpers/errorHandler'

export const login = async (
  formData: { email: string; password: string },
  role: string | null
) => {
  try {
    const response = await api.post(
      "/auth/login",
      { ...formData, role },
      { withCredentials: true } 
    );

    return response.data;
  } catch (error: unknown) {
    const message = handleApiError(error);
    console.error("Login Error:", message);
    throw new Error(message); // rethrow or return message
  }
};

export const register = async (
  formData: { firstName: string; lastName: string; email: string; password: string }
) => {
  try {
    const response = await api.post(
      "/auth/register",
      formData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};


//Project

export const fetchProjects = async (readOnlyFields: boolean) => {
  try {
    const endpoint = readOnlyFields
      ? "/user/get-projects" // user-specific
      : "/admin/get-projects"; // admin access

    const res = await api.get(endpoint, { withCredentials: true });
    return res.data.projects || res.data;
  } catch (error:unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

export const createProject = async (project: Project) => {
  try {
    const res = await api.post("/create-project", project);
    return res.data;
  } catch (error:unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

// ✅ Update an existing project
export const updateProject = async (project: Project) => {
  try {
    const res = await api.put("/update-project", project);
    return res.data;
  } catch (error:unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

export const fetchAdminProjects = async () => {
  try {
    const res = await api.get("/admin/get-projects");
    return res.data;
  } catch (error:unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

export const fetchUserProjects = async () => {
  try {
    const res = await api.get("/user/get-projects");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user projects:", error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    const res = await api.delete(`/delete-project/${id}`);
    return res.data;
  } catch (error:unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};



export const fetchAssignees = async (projectId: string) => {
  try {
    const res = await api.get(`/admin/get-members/${projectId}`);
    return res.data 
  } catch (error:unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

//Task

export const createTask = async (task: Task) => {
  try {
    const res = await api.post("/create-task", task);
    return res.data;
  } catch (error:unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};


export const updateTask = async (task: Task) => {
  try {
    const res = await api.put("/update-task", task);
    return res.data;
  } catch (error:unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};





export const fetchAdminTasks = async () => {
  try {
    const res = await api.get("/admin/get-tasks");
    return res.data;
  } catch (error:unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};



export const fetchUserTasks = async (): Promise<Task[]> => {
  try {
    const res = await api.get("/user/get-tasks");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user tasks:", error);
    throw error;
  }
};


export const updateTaskStatus = async (taskId: string, status: string): Promise<Task> => {
  try {
    const res = await api.put("/update-task-status", { taskId, status });
    return res.data;
  } catch (error) {
    console.error("Failed to update task status:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const res = await api.delete(`/admin/delete-task/${taskId}`);
    return res.data; 
  } catch (error:unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

//Notification

export const fetchNotifications = async (role: string) => {
  try {
    const endpoint =
      role === "manager"
        ? "/admin/fetch-notifications"
        : "/user/fetch-notifications";

    const res = await api.get(endpoint, { withCredentials: true });
    return res.data;
  } catch (error:unknown) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};