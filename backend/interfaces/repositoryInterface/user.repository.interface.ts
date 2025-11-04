import { UserDoc, UserInput } from "../../model/userModel";

//  Auth-related methods
export interface IUserAuthRepository {
  findByEmail(email: string): Promise<UserDoc | null>;
  login(email: string, role: string): Promise<UserDoc | null>;
  checkAuth(user_id: string, role: string): Promise<UserDoc | null>;
}

export interface IUserProfileRepository {
  register(userData: UserInput): Promise<UserDoc>;
  findByUserId(user_id: string, role: string): Promise<UserDoc | null>; // ✅ placed here
  findByRole(role: string): Promise<UserDoc | null>;
}

export interface IUserRepository
  extends IUserAuthRepository,
    IUserProfileRepository {}
