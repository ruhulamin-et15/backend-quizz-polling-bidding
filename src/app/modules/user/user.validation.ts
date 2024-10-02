import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Define the validation schema for the user
const userValidationSchema = z.object({
  userName: z.string().min(1, "user name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .regex(emailRegex, "Email must be valid and contain '@'"),
  phone: z.string().min(1, "phone number is required"),
  classDepartment: z.string().min(1, "Class or Department is required"),
  educationLevel: z.string().min(1, "Education Level is required"),
  studentId: z.number(),
  institution: z.string().optional(),
  hobbies: z.string().optional(),
  avatar: z.string().optional(),
  presentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  isVerified: z.boolean().default(false),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["ADMIN", "USER", "TEACHER"]).optional(),
  userStatus: z.enum(["ACTIVE", "BLOCKED", "DELETED"]).optional(),
});

export const userValidation = {
  userValidationSchema,
};
