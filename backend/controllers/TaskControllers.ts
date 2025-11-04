import { Request, Response } from "express";
import { ITaskService } from "../interfaces/serviceInterface/task.service.interface";
import HTTP_statusCode from "../enums/httpStatusCode";
import { handleError } from "../utils/handleError";
import { CreateTaskDTO } from "../interfaces/commonInterface";

class TaskControllers {
  private taskService: ITaskService;
  constructor(taskService: ITaskService) {
    this.taskService = taskService;
  }
  createTask = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const taskData: CreateTaskDTO = {
        title: req.body.title,
        description: req.body.description,
        assignee: req.body.assignee,
        projectId: req.body.projectId,
        priority: req.body.priority,
        deadline: req.body.deadline,
        activityLog: [
          {
            user: "admin@gmail.com",
            action: `Created task "${req.body.title}"`,
            timestamp: new Date(),
          },
        ],
      };
      const serviceResponse = await this.taskService.createTask(
        user_id,
        taskData
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  updateTask = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const taskData: CreateTaskDTO = {
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        assignee: req.body.assignee,
        projectId: req.body.projectId,
        priority: req.body.priority,
        deadline: req.body.deadline,
        activityLog: [
          {
            user: "admin@gmail.com",
            action: `Updated task "${req.body.title}"`,
            timestamp: new Date(),
          },
        ],
      };
      const serviceResponse = await this.taskService.updateTask(
        user_id,
        taskData
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const role = req.user_id as string;
      const taskId = req.body.taskId as string;
      const status = req.body.status as string;
      const serviceResponse = await this.taskService.updateTaskStatus(
        user_id,
        role,
        taskId,
        status
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  deleteTask = async (req: Request, res: Response) => {
    try {
      const taskId = req.params.id as string;
      console.log("taskId", taskId);

      await this.taskService.deleteTask(taskId);
      res.status(HTTP_statusCode.OK).send();
    } catch (error: unknown) {
      handleError(error, res);
    }
  };

  adminTasks = async (req: Request, res: Response) => {
    try {
      const serviceResponse = await this.taskService.adminTasks();
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  userTasks = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const role = req.role as string;
      const serviceResponse = await this.taskService.userTasks(user_id, role);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
}

export default TaskControllers;
