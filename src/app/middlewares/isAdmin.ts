import { Response, NextFunction } from "express";
import ApiError from "../errors/ApiErrors";
import { AuthRequest } from "./isLoggedin";

const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== "ADMIN") {
      throw new ApiError(403, "Access denied. Admins only.");
    }
    next();
  } catch (error: unknown) {
    throw error;
  }
};

export default isAdmin;
