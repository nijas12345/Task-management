import { Model, Types } from "mongoose";
import { IProjectRepository } from "../interfaces/repositoryInterface/project.repository.interface";
import { ProjectInput, ProjectDoc } from "../model/projectModel";

class ProjectRepository implements IProjectRepository {
  private projectModel = Model<ProjectDoc>;
  constructor(projectModel: Model<ProjectDoc>) {
    this.projectModel = projectModel;
  }
  createProject = async (project: ProjectInput): Promise<ProjectDoc | null> => {
    try {
      return await this.projectModel.create(project);
    } catch (error: unknown) {
      throw error;
    }
  };
  getProjects = async (email: string): Promise<ProjectDoc[]> => {
    try {
      return await this.projectModel
        .find({
          members: email,
        })
        .sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw error;
    }
  };
  getAdminProjects = async (user_id: string): Promise<ProjectDoc[]> => {
    try {
      return await this.projectModel
        .find({ user_id: user_id })
        .sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw error;
    }
  };
  findProjectById = async (
    projectId: string | Types.ObjectId
  ): Promise<ProjectDoc | null> => {
    try {
      return await this.projectModel.findById(projectId);
    } catch (error) {
      throw error;
    }
  };
  findProjectByName = async (name: string): Promise<ProjectDoc | null> => {
    try {
      return await this.projectModel.findOne({ name });
    } catch (error) {
      throw error;
    }
  };
  updateProject = async (
    projectId: Types.ObjectId,
    name: string,
    description: string,
    members: string[]
  ): Promise<ProjectDoc | null> => {
    try {
      const updateProject = {
        name,
        description,
        members,
      };
      return await this.projectModel.findOneAndUpdate(
        { _id: projectId },
        {
          $set: updateProject,
        },
        { new: true }
      );
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  };
  projectMembers = async (projectId: string): Promise<ProjectDoc | null> => {
    try {
      return await this.projectModel.findOne({
        _id: projectId,
      });
    } catch (error: unknown) {
      throw error;
    }
  };
  deleteProject = async (projectId: string): Promise<void> => {
    try {
      await this.projectModel.deleteOne({ _id: projectId });
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default ProjectRepository;
