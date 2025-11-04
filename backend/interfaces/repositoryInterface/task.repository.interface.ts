import { Types } from "mongoose";
import { TaskDoc } from "../../model/taskModel";
import { CreateTaskDTO } from "../commonInterface";

export interface ITaskCrudRepository {
  createTask(taskDetails: CreateTaskDTO): Promise<TaskDoc>;
  updateTask(
    taskId: Types.ObjectId,
    updateFields: CreateTaskDTO
  ): Promise<TaskDoc | null>;
  deleteTask(taskId: string): Promise<TaskDoc | null>;
  deleteTaskByProjectId(projectId: string): Promise<void>;
}

export interface ITaskQueryRepository {
  taskFindById(taskId: Types.ObjectId): Promise<TaskDoc | null>;
  updateTaskStatus(
    taskId: string,
    status: string,
    activity: { action: string; user: string; timestamp: Date }
  ): Promise<TaskDoc | null>;
}
export interface ITaskRoleViewRepository {
  adminTasks(): Promise<TaskDoc[]>;
  userTasks(email: string): Promise<TaskDoc[]>;
}
//  Final combined interface
export interface ITaskRepository
  extends ITaskCrudRepository,
    ITaskQueryRepository,
    ITaskRoleViewRepository {}
