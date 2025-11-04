import { Router } from "express";
import UserRepository from "../repositories/UserRepository";
import User from "../model/userModel";
import Project from "../model/projectModel";
import Notification from "../model/notificationModel";
import UserServices from "../services/UserService";
import UserController from "../controllers/UserController";
import { verifyToken } from "../config/jwtConfig";
import ProjectRepository from "../repositories/ProjectRepository";
import ProjectController from "../controllers/ProjectController";
import ProjectService from "../services/ProjectService";
import TaskRepository from "../repositories/TaskRepository";
import Task from "../model/taskModel";
import TaskService from "../services/TaskService";
import NotificationRepository from "../repositories/NotificationRepository";
import NotificationService from "../services/NotificationService";
import NotificationController from "../controllers/NotificationController";
import TaskControllers from "../controllers/TaskControllers";

const userRepository = new UserRepository(User);
const userService = new UserServices(userRepository);
const userController = new UserController(userService);

const notificationRepository = new NotificationRepository(Notification);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

const taskRepository = new TaskRepository(Task);
const taskService = new TaskService(
  taskRepository,
  userRepository,
  notificationRepository
);
const taskController = new TaskControllers(taskService);
const projectRepository = new ProjectRepository(Project);
const projectService = new ProjectService(
  projectRepository,
  userRepository,
  taskRepository
);
const projectController = new ProjectController(projectService);

const userRoute = Router();

//user

userRoute.post("/auth/register", userController.register);
userRoute.post("/auth/login", userController.login);
userRoute.get("/auth/logout", userController.logout);
userRoute.get("/auth/check", verifyToken(), userController.checkAuth);

//project

userRoute.get(
  "/admin/get-projects",
  verifyToken(),
  projectController.getAdminProjects
);
userRoute.get(
  "/user/get-projects",
  verifyToken(),
  projectController.getProjects
);
userRoute.post(
  "/create-project",
  verifyToken(),
  projectController.createProject
);
userRoute.put(
  "/update-project",
  verifyToken(),
  projectController.updateProject
);
userRoute.delete(
  "/delete-project/:id",
  verifyToken(),
  projectController.deleteProject
);
userRoute.get(
  "/admin/get-members/:id",
  verifyToken(),
  projectController.projectMembers
);

//task

userRoute.get("/admin/get-tasks", verifyToken(), taskController.adminTasks);
userRoute.get("/user/get-tasks", verifyToken(), taskController.userTasks);
userRoute.post("/create-task", verifyToken(), taskController.createTask);
userRoute.put("/update-task", verifyToken(), taskController.updateTask);
userRoute.put(
  "/update-task-status",
  verifyToken(),
  taskController.updateTaskStatus
);

//notification
userRoute.get(
  "/admin/fetch-notifications",
  verifyToken(),
  notificationController.getAdminNotifications
);
userRoute.get(
  "/user/fetch-notifications",
  verifyToken(),
  notificationController.getNotifications
);
userRoute.delete(
  "/admin/delete-task/:id",
  verifyToken(),
  taskController.deleteTask
);

export default userRoute;
