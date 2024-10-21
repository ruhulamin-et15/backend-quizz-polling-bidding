import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import { IUser } from "./user.interface";
import ApiError from "../../errors/ApiErrors";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { authReusable } from "../auth/auth.reusable";
import config from "../../../config";
import { transporter } from "../../../helpers/transporter";
import { generateImageUrl } from "../../../helpers/generateUrl";
import path from "path";

const prisma = new PrismaClient();

//create user
const createUserIntoDB = async (userData: IUser) => {
  const { password } = userData;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email ?? undefined },
          { phone: userData.phone ?? undefined },
        ],
      },
    });

    if (existingUser) {
      throw new ApiError(409, "User with this email/phone already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

//send otp for user verification
const sendOtpByEmailIntoDB = async (email: string) => {
  await authReusable.existUser(email);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date();
  otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5);
  const otpExpiresAtString = otpExpiresAt.toISOString();

  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt: otpExpiresAtString },
  });

  const emailTransport = transporter;

  // Email options
  const mailOptions = {
    from: `"BD Quizz-Polling" <${config.emailSender.email}>`,
    to: email,
    subject: "User Verification",
    html: `
      <p>Hello,</p>
      <p>Verify user using this OTP: ${otp}, This OTP is Expired in 5 minutes,</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  // Send the email
  try {
    const info = await emailTransport.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password reset email.");
  }
};

//verify user by otp
const verifyUserByOtpIntoDB = async (email: string, verifyData: any) => {
  const { otp } = verifyData;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found for verification!");
  }

  if (user.isVerified) {
    throw new ApiError(409, "User already verified!");
  }

  const currentTime = new Date(Date.now());

  if (user?.otp !== otp) {
    throw new ApiError(404, "Your OTP is incorrect!");
  } else if (!user.otpExpiresAt || user.otpExpiresAt <= currentTime) {
    throw new ApiError(409, "Your OTP is expired, please send new otp");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
    },
  });

  return user;
};

//get all users
const getUsersIntoDB = async () => {
  try {
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      throw new ApiError(404, "Users not found!");
    }
    const sanitizedUsers = users.map(({ password, ...rest }) => rest);

    return sanitizedUsers;
  } catch (error) {
    throw error;
  }
};

//get single user
const getSingleUserIntoDB = async (id: string) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID format");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        participations: true,
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

//update user
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

//update user avatar
const updateUserAvatar = async (req: any) => {
  const files = req.file;

  if (!files) {
    throw new ApiError(400, "No file uploaded");
  }

  const avatar = generateImageUrl(files);
  const user = await getSingleUserIntoDB(req.params.userId);

  if (user.avatar) {
    //avatar set to ""
    path.join(
      process.cwd(),
      user.avatar.replace(`${config.backend_base_url}`, "")
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.params.userId },
    data: { avatar: avatar },
  });
  return updatedUser.avatar;
};

//user soft delete
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

//user hard delete
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

//update user status
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

//update user role
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
  sendOtpByEmailIntoDB,
  verifyUserByOtpIntoDB,
  getUsersIntoDB,
  getSingleUserIntoDB,
  updateUserIntoDB,
  updateUserAvatar,
  deleteUserIntoDB,
  deleteUserFromDB,
  updateUserStatusIntoDB,
  updateUserRoleIntoDB,
};
