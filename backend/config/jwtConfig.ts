import jwt, {
  Secret,
  SignOptions,
  JwtPayload as JWTJwtPayload,
} from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import HTTP_statusCode from "../enums/httpStatusCode";

dotenv.config();

interface JwtPayload {
  user_id: string;
  role: string;
}

const secret_key: Secret = process.env.JWT_SECRET || "default_secret";
const userTokenTime: number =
  Number(process.env.USER_TOKEN_EXPIRY_TIME) || 1800; // 30 mins default
const userTokenName = process.env.USER_ACCESS_TOKEN_NAME || "userToken";

export const createToken = (user_id: string, role: string): string => {
  const payload: JwtPayload = { user_id, role };
  console.log(userTokenTime);
  const options: SignOptions = { expiresIn: userTokenTime };
  return jwt.sign(payload, secret_key, options);
};

export const verifyToken = (expectedRole?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Haiii");

      const accessToken = req.cookies[userTokenName];
      if (!accessToken) {
        return res
          .status(HTTP_statusCode.Unauthorized)
          .json({ message: "Access denied. No token provided." });
      }

      jwt.verify(
        accessToken,
        secret_key,
        (
          err: jwt.VerifyErrors | null,
          decoded: string | JWTJwtPayload | undefined
        ) => {
          if (err) {
            return res
              .status(HTTP_statusCode.Expired)
              .json({ message: "Token has expired. Please login again." });
          }

          const { user_id, role } = decoded as JwtPayload;

          if (expectedRole && role !== expectedRole) {
            return res
              .status(HTTP_statusCode.Unauthorized)
              .json({ message: "Access denied. Invalid role." });
          }

          req.user_id = user_id;
          req.role = role;

          next();
        }
      );
    } catch (error) {
      console.log("jallkdj");

      return res
        .status(HTTP_statusCode.Unauthorized)
        .json({ message: "Invalid or missing access token." });
    }
  };
};
