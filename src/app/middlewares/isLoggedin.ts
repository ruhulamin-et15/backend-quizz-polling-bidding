import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiErrors";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";

export interface AuthRequest extends Request {
  user?: any; // Extend the Request object to include user data
}

const isLoggedIn = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization as string;
    const verifyToken = jwtHelpers.verifyToken(token, config.jwt.jwt_secret);
    if (!verifyToken) {
      throw new ApiError(404, "Please login first for this access");
    }

    req.user = verifyToken;

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(401, "Token expired, please login again");
      } else if (error.name === "JsonWebTokenError") {
        throw new ApiError(401, "Invalid token, please login again");
      } else {
        throw error; // Re-throw the error if it's not handled
      }
    } else {
      // In case error is not an instance of Error, re-throw it or log it
      throw new ApiError(500, "An unknown error occurred");
    }
  }
};

export default isLoggedIn;
