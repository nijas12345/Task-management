import { Model } from "mongoose";
import { IUserRepository } from "../interfaces/repositoryInterface/user.repository.interface";
import { UserDoc } from "../model/userModel";
class UserRepository implements IUserRepository {
  private userModel = Model<UserDoc>;
  constructor(userModel: Model<UserDoc>) {
    this.userModel = userModel;
  }
  findByEmail = async (email: string): Promise<UserDoc | null> => {
    try {
      return await this.userModel.findOne({ email });
    } catch (error: unknown) {
      throw error;
    }
  };
  findByUserId = async (_id: string): Promise<UserDoc | null> => {
    try {
      return await this.userModel.findOne({
        _id,
      });
    } catch (error: unknown) {
      throw error;
    }
  };
  findByRole = async (role: string): Promise<UserDoc | null> => {
    try {
      return await this.userModel.findOne({
        role,
      });
    } catch (error: unknown) {
      throw error;
    }
  };

  register = async (userData: UserDoc): Promise<UserDoc> => {
    try {
      const createData = await this.userModel.create(userData);
      return createData;
    } catch (error: unknown) {
      throw error;
    }
  };
  login = async (email: string, role: string): Promise<UserDoc | null> => {
    try {
      return await this.userModel.findOne({ email, role });
    } catch (error: unknown) {
      throw error;
    }
  };
  checkAuth = async (
    user_id: string,
    role: string
  ): Promise<UserDoc | null> => {
    try {
      return await this.userModel.findOne({ _id: user_id, role });
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default UserRepository;
