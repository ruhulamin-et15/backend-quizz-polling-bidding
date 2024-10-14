export interface IUser {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  studentId: number;
  classDepartment?: string;
  educationLevel?: string;
  institution?: string;
  hobbies?: string;
  avatar?: string;
  presentAddress?: string;
  permanentAddress?: string;
  isVerified?: boolean;
  role?: "ADMIN" | "USER" | "TEACHER";
  userStatus?: "ACTIVE" | "BLOCKED" | "DELETED";
  otp?: string;
}
