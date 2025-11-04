import { Request, Response } from "express";
import { IUserService } from "../interfaces/serviceInterface/user.service.interface";
import HTTP_statusCode from "../enums/httpStatusCode";
import { UserDoc } from "../model/userModel";
import { handleError } from "../utils/handleError";

class UserController {
  private userService: IUserService;
  constructor(userService: IUserService) {
    this.userService = userService;
  }
  register = async (req: Request, res: Response) => {
    try {
      const userData: UserDoc = req.body;
      await this.userService.register(userData);
      res.status(HTTP_statusCode.OK).send("OTP send to mail");
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  login = async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;
      const serviceResponse = await this.userService.login(
        email,
        password,
        role
      );
      res.cookie("userToken", serviceResponse.userToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 30 * 60 * 1000,
      });
      res.status(HTTP_statusCode.OK).json(serviceResponse.userData);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  checkAuth = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id;
      const role = req.role;
      if (!user_id || !role) {
        return res
          .status(HTTP_statusCode.Unauthorized)
          .json({ authenticated: false, message: "Unauthorized access" });
      }

      const serviceResponse = await this.userService.checkAuth(user_id, role);
      res.status(HTTP_statusCode.OK).json({
        authenticated: true,
        user: serviceResponse,
      });
    } catch (error: unknown) {
      handleError(error, res);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("userToken", {
        httpOnly: true,
      });
      res.status(HTTP_statusCode.OK).json("Logged out successfully");
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
}
export default UserController;
