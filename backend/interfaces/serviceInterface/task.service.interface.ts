import {  TaskDoc } from "../../model/taskModel";
import { CreateTaskDTO } from "../commonInterface";

// 🛠️ Core Task Operations
export interface ITaskCoreService {
  createTask(user_id:string,taskDetails: CreateTaskDTO): Promise<TaskDoc>;
//   showTask(user_id: string, taskId: string): Promise<TaskDoc | { isAuth: boolean; taskData: TaskDoc }>;
  updateTask(user_id:string,task: CreateTaskDTO): Promise<TaskDoc>;
  deleteTask(taskId: string): Promise<void>;
}
export interface ITaskRoleViewService {
  adminTasks(): Promise<TaskDoc[]>;
  userTasks(user_id: string,role:string): Promise<TaskDoc[]>;
}

// 🔄 Task Status Handling
export interface ITaskStatusService {
  updateTaskStatus(user_id:string,role:string,taskId: string, status: string): Promise<TaskDoc>;
// //   assignedStatus(taskId: string, acceptanceStatus: string): Promise<TaskDoc>;
}




// ✅ Combined Task Service Interface (Optional)
export interface ITaskService
  extends ITaskCoreService,
  ITaskRoleViewService,
  ITaskStatusService{}
