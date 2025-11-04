import { IUserService } from "../interfaces/serviceInterface/user.service.interface";
import { IUserRepository } from "../interfaces/repositoryInterface/user.repository.interface";
import bcrypt from "bcrypt";
import { createToken } from "../config/jwtConfig";

import HTTP_statusCode from "../enums/httpStatusCode";
import { UserDoc } from "../model/userModel";
import { HttpError } from "../utils/httpError";

class UserService implements IUserService {
  private userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  login = async (
    email: string,
    password: string,
    role: string
  ): Promise<{
    userData: UserDoc;
    userToken: string;
  }> => {
    try {
      const userData = await this.userRepository.login(email, role);
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "Email not found");
      }
      const comparePassword = await bcrypt.compare(
        password,
        userData.password as string
      );
      if (!comparePassword) {
        throw new HttpError(HTTP_statusCode.Unauthorized, "Wrong password");
      }
      const userToken = createToken(userData._id?.toString() as string, role);

      return { userToken, userData };
    } catch (error: unknown) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  register = async (userData: UserDoc): Promise<void> => {
    try {
      const alreadyExists: UserDoc | null =
        await this.userRepository.findByEmail(userData.email);

      if (alreadyExists) {
        throw new HttpError(HTTP_statusCode.Conflict, "Email already exists");
      }
      const hashedPassword = await bcrypt.hash(userData.password as string, 10);
      const newUserData = {
        ...userData,
        password: hashedPassword,
      };
      await this.userRepository.register(newUserData);
    } catch (error: unknown) {
      throw error;
    }
  };
  checkAuth = async (user_id: string, role: string): Promise<UserDoc> => {
    try {
      const userData = await this.userRepository.checkAuth(user_id, role);
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "Email not found");
      }
      return userData;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default UserService;
