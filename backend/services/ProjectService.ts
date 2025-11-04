import { IProjectService } from "../interfaces/serviceInterface/project.service.interface";
import { IProjectRepository } from "../interfaces/repositoryInterface/project.repository.interface";
import { IUserRepository } from "../interfaces/repositoryInterface/user.repository.interface";

import { ProjectDoc, ProjectInput } from "../model/projectModel";

import { HttpError } from "../utils/httpError";
import HTTP_statusCode from "../enums/httpStatusCode";
import { UserDoc } from "../model/userModel";
import { ITaskRepository } from "../interfaces/repositoryInterface/task.repository.interface";

class ProjectService implements IProjectService {
  private projectRepository: IProjectRepository;
  private userRepository: IUserRepository;
  private taskRepository: ITaskRepository;
  constructor(
    projectRepository: IProjectRepository,
    userRepository: IUserRepository,
    taskRepository: ITaskRepository
  ) {
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
    this.taskRepository = taskRepository;
  }
  createProject = async (
    user_id: string,
    role: string,
    project: ProjectInput
  ): Promise<ProjectDoc | null> => {
    try {
      const userData: UserDoc | null = await this.userRepository.findByUserId(
        user_id,
        role
      );
      if (!userData?._id) {
        throw new HttpError(HTTP_statusCode.NotFound, "User not found");
      }
      const adminEmail = userData.email;

      const memberEmails = project.members || [];

      if (memberEmails.includes(adminEmail)) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          "You cannot add your own email as a member."
        );
      }
      const projectData = await this.projectRepository.findProjectByName(project.name)
      if(projectData){
        throw new HttpError(HTTP_statusCode.Conflict,"Project Name already exists. Please change the name")
      }
      const projectDataWithUser = {
        ...project,
        user_id: userData._id,
      };
      return await this.projectRepository.createProject(projectDataWithUser);
    } catch (error: unknown) {
      throw error;
    }
  };
  getProjects = async (
    user_id: string,
    role: string
  ): Promise<ProjectDoc[]> => {
    try {
      const userData: UserDoc | null = await this.userRepository.findByUserId(
        user_id,
        role
      );
      if (!userData) throw new Error("No user Data");
      const email = userData.email;
      const projects: ProjectDoc[] = await this.projectRepository.getProjects(
        email
      );
      return projects;
    } catch (error: unknown) {
      throw error;
    }
  };
  getAdminProjects = async (
    user_id: string,
    role: string
  ): Promise<ProjectDoc[]> => {
    try {
      if (role !== "manager") {
        throw new Error("Please Login as a admin");
      }
      const projects: ProjectDoc[] =
        await this.projectRepository.getAdminProjects(user_id);
      console.log("projects", projects);

      return projects;
    } catch (error: unknown) {
      throw error;
    }
  };
  updateProject = async (
    user_id: string,
    role: string,
    projectData: ProjectDoc
  ): Promise<ProjectDoc> => {
    try {
      const user: UserDoc | null = await this.userRepository.findByUserId(
        user_id,
        role
      );
      if (!user) {
        throw new HttpError(HTTP_statusCode.NotFound, "Admin not found");
      }

      const adminEmail = user.email;

      const projectId = projectData._id;
      if (!projectId) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          "Project ID is required"
        );
      }
      const existingProject = await this.projectRepository.findProjectById(
        projectId
      );
      if (!existingProject) {
        throw new HttpError(HTTP_statusCode.NotFound, "Project not found");
      }
      const memberEmails: string[] = projectData.members || [];

      if (memberEmails.includes(adminEmail)) {
        throw new HttpError(
          HTTP_statusCode.BadRequest,
          "You cannot add your own email as a member."
        );
      }

      // 5️⃣ Update the project
      const updatedProject: ProjectDoc | null =
        await this.projectRepository.updateProject(
          projectId,
          projectData.name,
          projectData.description,
          memberEmails
        );
      if (!updatedProject) {
        throw new Error("Project doesn't exist");
      }
      return updatedProject;
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteProject = async (projectId: string): Promise<void> => {
    try {
      await this.projectRepository.deleteProject(projectId);
      await this.taskRepository.deleteTaskByProjectId(projectId);
    } catch (error: unknown) {
      throw error;
    }
  };
  projectMembers = async (projectId: string): Promise<string[]> => {
    try {
      const projectData: ProjectDoc | null =
        await this.projectRepository.projectMembers(projectId);
      if (projectData) {
        const projectMembers: string[] = projectData?.members;
        return projectMembers;
      } else {
        throw new HttpError(HTTP_statusCode.NotFound, "The projectId is wrong");
      }
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default ProjectService;
