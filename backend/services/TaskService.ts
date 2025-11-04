import HTTP_statusCode from "../enums/httpStatusCode";
import { UserDoc } from "../model/userModel";
import { TaskDoc } from "../model/taskModel";
import { ITaskRepository } from "../interfaces/repositoryInterface/task.repository.interface";
import { ITaskService } from "../interfaces/serviceInterface/task.service.interface";
import { IUserRepository } from "../interfaces/repositoryInterface/user.repository.interface";
import { HttpError } from "../utils/httpError";
import { CreateTaskDTO } from "../interfaces/commonInterface";
import { Types } from "mongoose";
import { NotificationInput } from "../model/notificationModel";
import { INotificationRepository } from "../interfaces/repositoryInterface/notification.repository.interface";
import { sendNotificationToUser } from "../config/socket_config";

class TaskService implements ITaskService {
  private taskRepository: ITaskRepository;
  private userRepository: IUserRepository;
  private notificationRepository: INotificationRepository;
  constructor(
    taskRepository: ITaskRepository,
    userRepository: IUserRepository,
    notificationRepository: INotificationRepository
  ) {
    this.taskRepository = taskRepository;
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
  }
  createTask = async (
    user_id: string,
    task: CreateTaskDTO
  ): Promise<TaskDoc> => {
    try {
      const taskData = await this.taskRepository.createTask(task);
      const userData = await this.userRepository.findByEmail(taskData.assignee);
      if (!userData?._id) {
        throw new HttpError(HTTP_statusCode.BadRequest, "No Task ID provided");
      }
      const notificationData: Omit<
        NotificationInput,
        "createdAt" | "updatedAt"
      > = {
        user_id: user_id,
        assignedUserId: userData._id,
        taskId: new Types.ObjectId(taskData._id),
        message: `You have been assigned a new task: ${taskData.title}`,
        isRead: false,
        notificationType:"User"
      };

      await this.notificationRepository.saveNotification(notificationData);

      sendNotificationToUser(userData._id.toString(), notificationData);
      return taskData;
    } catch (error: unknown) {
      throw error;
    }
  };
  updateTask = async (
    user_id: string,
    task: CreateTaskDTO
  ): Promise<TaskDoc> => {
    try {
      const taskId = task._id;
      console.log("task", task);

      if (!taskId) {
        throw new HttpError(HTTP_statusCode.BadRequest, "No Task ID provided");
      }
      const taskDetails: TaskDoc | null =
        await this.taskRepository.taskFindById(taskId);

      if (!taskDetails) {
        throw new HttpError(HTTP_statusCode.NotFound, "No task data available");
      }

      const userData = await this.userRepository.findByEmail(task.assignee);
      if (!userData?._id) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          "No UserEmail provided"
        );
      }
      const notificationData: Omit<
        NotificationInput,
        "createdAt" | "updatedAt"
      > = {
        user_id: user_id,
        assignedUserId: userData._id,
        taskId: new Types.ObjectId(taskDetails._id),
        message: `You have been assigned a new task: ${task.title}`,
        isRead: false,
        notificationType:"User"
      };
      await this.notificationRepository.saveNotification(notificationData);

      sendNotificationToUser(userData._id.toString(), notificationData);
      const taskData: TaskDoc | null = await this.taskRepository.updateTask(
        taskId,
        task
      );
      if (!taskData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No task Data exists");
      }
      return taskData;
    } catch (error: unknown) {
      throw error;
    }
  };

  updateTaskStatus = async (
    user_id: string,
    role: string,
    taskId: string,
    status: string
  ): Promise<TaskDoc> => {
    try {
      const userData = await this.userRepository.findByUserId(user_id, role);
      if (!userData?._id) {
        throw new HttpError(HTTP_statusCode.NotFound, "User not found");
      }

      const task = await this.taskRepository.taskFindById(
        new Types.ObjectId(taskId)
      );
      if (!task) {
        throw new HttpError(HTTP_statusCode.NotFound, "Task not found");
      }

      const activity = {
        user: userData.email,
        action: `Status changed from ${task.status} → ${status}`,
        timestamp: new Date(),
      };

      const taskData = await this.taskRepository.updateTaskStatus(
        taskId,
        status,
        activity
      );
      if (!taskData) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          "Failed to update task"
        );
      }

      const adminData = await this.userRepository.findByRole("manager");
      if (!adminData?._id) {
        throw new HttpError(HTTP_statusCode.NotFound, "Admin not found");
      }

      const notificationData: Omit<
        NotificationInput,
        "createdAt" | "updatedAt"
      > = {
        user_id: adminData._id.toString(),
        assignedUserId: userData._id,
        taskId: new Types.ObjectId(taskData._id),
        message: `Task "${task.title}" status changed to ${status}.`,
        isRead: false,
        notificationType:"Admin"
      };

      const savedNotification =
        await this.notificationRepository.saveNotification(notificationData);

      sendNotificationToUser(adminData._id.toString(), savedNotification);

      return taskData;
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteTask = async (taskId: string): Promise<void> => {
    try {
      const taskData: TaskDoc | null = await this.taskRepository.deleteTask(
        taskId
      );
      if (!taskData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "Task not found or could not be updated"
        );
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  adminTasks = async (): Promise<TaskDoc[]> => {
    try {
      const tasks: TaskDoc[] = await this.taskRepository.adminTasks();
      return tasks;
    } catch (error: unknown) {
      throw error;
    }
  };
  userTasks = async (user_id: string, role: string): Promise<TaskDoc[]> => {
    try {
      const userData: UserDoc | null = await this.userRepository.findByUserId(
        user_id,
        role
      );
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No User Data");
      }
      const email = userData.email;
      const tasks: TaskDoc[] | null = await this.taskRepository.userTasks(
        email
      );
      return tasks;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default TaskService;
