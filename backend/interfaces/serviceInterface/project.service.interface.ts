import { ProjectDoc,ProjectInput } from "../../model/projectModel";

//  Core Project Management
export interface IProjectCoreService {
  createProject(user_id: string,role:string, projectData: ProjectInput): Promise<ProjectDoc | null>;
  updateProject(user_id:string,role: string, projectData: ProjectDoc): Promise<ProjectDoc>;
  deleteProject(projectId: string): Promise<void>;
}

//  Project Fetching for user/admin
export interface IProjectAccessService {
  getProjects(user_id: string,role:string): Promise<ProjectDoc[]>;
  getAdminProjects(user_id: string,role:string): Promise<ProjectDoc[]>;
}


export interface IProjectMemberService {
  projectMembers(projectId: string): Promise<string[]>;
//   getSelectedProject(project: ProjectDoc): Promise<UserDoc[]>;
}

//  Final Aggregated Interface
export interface IProjectService
  extends IProjectCoreService,IProjectAccessService,
          IProjectMemberService {}