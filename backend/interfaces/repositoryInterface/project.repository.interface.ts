import { Types } from "mongoose";
import { ProjectDoc, ProjectInput } from "../../model/projectModel";

//  Core project CRUD
export interface IProjectCoreRepository {
  createProject(project: ProjectInput): Promise<ProjectDoc | null>;
  updateProject(
    projectId: Types.ObjectId,
    name: string,
    description: string,
    members: string[]
  ): Promise<ProjectDoc | null>;
  deleteProject(projectId: string): Promise<void>;
  findProjectById(
    projectId: string | Types.ObjectId
  ): Promise<ProjectDoc | null>;
  findProjectByName(name:string):Promise<ProjectDoc|null>
}

export interface IProjectMemberRepository {
  projectMembers(projectId: string): Promise<ProjectDoc | null>;
}


export interface IProjectListingRepository {
  getProjects(email: string): Promise<ProjectDoc[]>;
  getAdminProjects(user_id: string): Promise<ProjectDoc[]>;

}

export interface IProjectRepository
  extends IProjectCoreRepository,
    IProjectMemberRepository,
    IProjectListingRepository {}
