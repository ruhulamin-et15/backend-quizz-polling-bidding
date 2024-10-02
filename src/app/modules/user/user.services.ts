import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import { IUser } from "./user.interface";
import ApiError from "../../errors/ApiErrors";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

const createUserIntoDB = async (userData: IUser) => {
  try {
    const {
      userName,
      password,
      phone,
      email,
      classDepartment,
      educationLevel,
      institution,
      studentId,
      hobbies,
      avatar,
      presentAddress,
      permanentAddress,
      role = "USER",
      userStatus = "ACTIVE",
    } = userData;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email ?? undefined }, { phone: phone ?? undefined }],
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      throw new ApiError(409, "user with this email/phone already exist!");
    }
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        userName,
        password: hashedPassword,
        phone,
        email,
        classDepartment,
        educationLevel: educationLevel ?? "not specified",
        institution,
        studentId: studentId ?? 0,
        hobbies,
        avatar,
        presentAddress,
        permanentAddress,
        role,
        userStatus,
      },
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

const getUsersIntoDB = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        userStatus: {
          not: "DELETED" || "BLOCKED",
        },
      },
    });
    if (users.length === 0) {
      throw new ApiError(404, "Users not found!");
    }
    const sanitizedUsers = users.map(({ password, ...rest }) => rest);

    return sanitizedUsers;
  } catch (error) {
    throw error;
  }
};

const getSingleUserIntoDB = async (id: string) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID format");
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
        userStatus: {
          not: "DELETED" || "BLOCKED",
        },
      },
    });
    if (!user) {
      throw new ApiError(404, "user not found!");
    }
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  } catch (error) {
    throw error;
  }
};

const updateUserIntoDB = async (id: string, userData: IUser) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID format");
    }
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new ApiError(404, "user not found for edit user");
    } else if (existingUser.userStatus === "BLOCKED") {
      throw new ApiError(400, "user blocked, you cannot update this user");
    } else if (existingUser.userStatus === "DELETED") {
      throw new ApiError(400, "user deleted, you cannot update this user");
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });

    const { password, ...sanitizedUser } = updatedUser;
    return sanitizedUser;
  } catch (error) {
    throw error;
  }
};

const deleteUserIntoDB = async (id: string) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID format");
    }
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new ApiError(404, "user not found for delete this");
    } else if (existingUser.userStatus === "DELETED") {
      throw new ApiError(400, "user already deleted!");
    }
    const deletedUser = await prisma.user.update({
      where: { id },
      data: { userStatus: "DELETED" },
    });
    return deletedUser;
  } catch (error) {
    throw error;
  }
};

//delete user from database
const deleteUserFromDB = async (id: string) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID format");
    }
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new ApiError(404, "user not found for delete this");
    }
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return deletedUser;
  } catch (error) {
    throw error;
  }
};

const updateUserStatusIntoDB = async (id: string, userStatus: UserStatus) => {
  console.log(userStatus);
  try {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID format");
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new ApiError(
        404,
        `user not found for update status ${userStatus.toLocaleLowerCase()}`
      );
    }

    if (userStatus === existingUser.userStatus) {
      throw new ApiError(
        409,
        `user already ${userStatus.toLocaleLowerCase()}!`
      );
    }

    const updateUserStatus = await prisma.user.update({
      where: { id },
      data: { userStatus },
    });
    return updateUserStatus;
  } catch (error) {
    throw error;
  }
};

const updateUserRoleIntoDB = async (id: string, role: UserRole) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID format");
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new ApiError(
        404,
        `user not found for role ${role.toLocaleLowerCase()}`
      );
    }

    if (existingUser.role === role) {
      throw new ApiError(409, `user already ${role.toLocaleLowerCase()}`);
    }

    const updateUserRole = await prisma.user.update({
      where: { id },
      data: { role },
    });
    return updateUserRole;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createUserIntoDB,
  getUsersIntoDB,
  getSingleUserIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
  deleteUserFromDB,
  updateUserStatusIntoDB,
  updateUserRoleIntoDB,
};
