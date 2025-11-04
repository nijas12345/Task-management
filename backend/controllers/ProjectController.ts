import { Request, Response } from "express";
import { IProjectService } from "../interfaces/serviceInterface/project.service.interface";
import HTTP_statusCode from "../enums/httpStatusCode";
import { handleError } from "../utils/handleError";
import { ProjectDoc, ProjectInput } from "../model/projectModel";

class ProjectController {
  private projectService: IProjectService;
  constructor(projectService: IProjectService) {
    this.projectService = projectService;
  }
  createProject = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const role = req.role as string;
      const project: ProjectInput = req.body;
      const serviceResponse = await this.projectService.createProject(
        user_id,
        role,
        project
      );
      res.status(200).json(serviceResponse);
    } catch (error: unknown) {
      console.log("error",error);
      
      handleError(error, res);
    }
  };
  getProjects = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const role = req.role as string;
      const serviceResponse = await this.projectService.getProjects(
        user_id,
        role
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  getAdminProjects = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const role = req.role as string;
      const serviceResponse = await this.projectService.getAdminProjects(
        user_id,
        role
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  updateProject = async (req: Request, res: Response) => {
    try {
      console.log("ajdlkfjalskdfjalskd");

      const user_id: string = req.user_id as string;
      const role = req.role as string;
      const projectData: ProjectDoc = req.body;
      const serviceResponse = await this.projectService.updateProject(
        user_id,
        role,
        projectData
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  deleteProject = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id as string;
      const serviceResponse = await this.projectService.deleteProject(
        projectId
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  projectMembers = async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id as string;
      const serviceResponse = await this.projectService.projectMembers(
        projectId
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
       handleError(error, res);
    }
  };
}

export default ProjectController;
