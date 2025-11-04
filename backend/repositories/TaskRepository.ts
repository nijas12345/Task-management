import { Model, Types } from "mongoose";
import { ITaskRepository } from "../interfaces/repositoryInterface/task.repository.interface";
import { HttpError } from "../utils/httpError";
import HTTP_statusCode from "../enums/httpStatusCode";
import { TaskDoc } from "../model/taskModel";
import { CreateTaskDTO } from "../interfaces/commonInterface";

class TaskRepository implements ITaskRepository {
  private taskModel = Model<TaskDoc>;
  constructor(taskModel: Model<TaskDoc>) {
    this.taskModel = taskModel;
  }
  taskFindById = async (taskId: Types.ObjectId): Promise<TaskDoc | null> => {
    try {
      return await this.taskModel.findById(taskId);
    } catch (error: unknown) {
      throw error;
    }
  };
  createTask = async (task: CreateTaskDTO): Promise<TaskDoc> => {
    try {
      return await this.taskModel.create(task);
    } catch (error: unknown) {
      throw error;
    }
  };
  updateTask = async (
    taskId: Types.ObjectId,
    updateFields: CreateTaskDTO
  ): Promise<TaskDoc | null> => {
    try {
      return await this.taskModel.findByIdAndUpdate(
        taskId,
        { $set: updateFields },
        { new: true }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  updateTaskStatus = async (
    taskId: string,
    status: string,
    activity: { user: string; action: string; timestamp: Date }
  ): Promise<TaskDoc | null> => {
    try {
      const updatedTask = await this.taskModel.findByIdAndUpdate(
        taskId,
        {
          $set: { status },
          $push: { activityLog: activity },
        },
        { new: true }
      );
      return updatedTask;
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteTask = async (taskId: string): Promise<TaskDoc | null> => {
    try {
      return await this.taskModel.findByIdAndDelete(taskId);
    } catch (error: unknown) {
      throw error;
    }
  };

  deleteTaskByProjectId = async (projectId: string): Promise<void> => {
    try {
      await this.taskModel.deleteMany({ projectId: projectId });
    } catch (error: unknown) {
      throw error;
    }
  };
  adminTasks = async (): Promise<TaskDoc[]> => {
    try {
      return await this.taskModel.find().sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  };
  userTasks = async (email: string): Promise<TaskDoc[]> => {
    try {
      return await this.taskModel
        .find({ assignee: email })
        .sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default TaskRepository;
