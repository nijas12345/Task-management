import { UserDoc } from "../../model/userModel";

// Auth-related service methods
export interface IAdminAuthService {
  login(email: string, password: string): Promise<{
    adminData: UserDoc;
    adminToken: string;
    adminRefreshToken: string;
  }>;
  register(adminData: UserDoc): Promise<void>;
}

//  Password & token-related service methods
export interface IAdminSecurityService {
  resetPassword(email: string): Promise<void>;
  confirmResetPassword(token: string, password: string): Promise<void>;
  validateToken(token: string): Promise<void>;
}


//  Final combined interface for full AdminService
export interface IAdminService
  extends IAdminAuthService,
          IAdminSecurityService{}