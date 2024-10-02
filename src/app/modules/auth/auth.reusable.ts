import { PrismaClient } from "@prisma/client";
import ApiError from "../../errors/ApiErrors";

const prisma = new PrismaClient();

const existUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
      userStatus: {
        not: "DELETED",
      },
    },
  });

  if (!user) {
    throw new ApiError(
      404,
      "user not found with this email, please register first"
    );
  }

  if (user?.userStatus === "BLOCKED") {
    throw new ApiError(409, "you are blocked, please contact authority");
  }
  return user;
};

export const authReusable = {
  existUser,
};
