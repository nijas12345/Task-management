import { UserDoc } from "../../model/userModel";

export interface IAdminAuthRepository {
  findByEmail(email: string): Promise<UserDoc | null>;
  register(adminData: UserDoc): Promise<UserDoc>;
  login(email: string): Promise<UserDoc | null>;
}