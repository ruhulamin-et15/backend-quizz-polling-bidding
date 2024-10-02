import { Response, NextFunction } from "express";
import ApiError from "../errors/ApiErrors";
import { AuthRequest } from "./isLoggedin";

const isTeacher = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== "TEACHER") {
      throw new ApiError(403, "Access denied. Teachers only.");
    }
    next();
  } catch (error: unknown) {
    throw error;
  }
};

export default isTeacher;
