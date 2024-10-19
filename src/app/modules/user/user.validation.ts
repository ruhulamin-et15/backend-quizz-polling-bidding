import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/;

const userValidationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .regex(emailRegex, "Email must be valid and contain '@'"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      phoneRegex,
      "Phone number must be valid (e.g., 01762717397 or +8801762717397)"
    ),
  classDepartment: z.string().optional(),
  educationLevel: z.string().optional(),
  studentId: z.number().optional(),
  institution: z.string().optional(),
  hobbies: z.string().optional(),
  avatar: z.string().optional(),
  presentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  isVerified: z.boolean().default(false),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  otp: z.string().optional(),
  otpExpiresAt: z.date().optional(),
  role: z.enum(["ADMIN", "USER", "TEACHER"]).optional(),
  userStatus: z.enum(["ACTIVE", "BLOCKED", "DELETED"]).optional(),
});

const userValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    userValidationSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ errors: err.errors });
  }
};

export const userValidation = {
  userValidationSchema,
  userValidationMiddleware,
};
