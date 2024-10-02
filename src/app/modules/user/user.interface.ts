export interface IUser {
  userName: string;
  email: string;
  phone: string;
  classDepartment: string;
  educationLevel: string;
  studentId: number;
  institution?: string;
  hobbies?: string;
  avatar?: string;
  presentAddress?: string;
  permanentAddress?: string;
  isVerified?: boolean;
  password: string;
  role?: "ADMIN" | "USER" | "TEACHER";
  userStatus?: "ACTIVE" | "BLOCKED" | "DELETED";
  otp?: string;
}
