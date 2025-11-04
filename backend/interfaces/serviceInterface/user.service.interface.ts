import { UserDoc } from "../../model/userModel";

// Auth-related service methods
export interface IUserAuthService {
  login(email: string, password: string,role:string): Promise<{
    userData: UserDoc;
    userToken: string;
  }>;
  register(adminData: UserDoc): Promise<void>;
  checkAuth(user_id:string,role:string):Promise<UserDoc>;
}



export interface IUserService
  extends IUserAuthService{}
       