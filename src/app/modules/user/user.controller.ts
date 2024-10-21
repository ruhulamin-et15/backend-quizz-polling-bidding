import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.services";

// register user
const createdUser = catchAsync(async (req, res) => {
  const result = await userService.createUserIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User created successfully",
    data: result,
  });
});

//send otp for user verification
const sendOtpByEmail = catchAsync(async (req: any, res) => {
  const userEmail = req.user.email;
  await userService.sendOtpByEmailIntoDB(userEmail);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP sent successfully",
  });
});

//verify user by otp
const verifyUser = catchAsync(async (req: any, res) => {
  const userEmail = req.user.email;
  await userService.verifyUserByOtpIntoDB(userEmail, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User verified successfully",
  });
});

//get users
const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsersIntoDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "users retrived successfully",
    data: users,
  });
});

//get single user
const getSingleUser = catchAsync(async (req, res) => {
  const user = await userService.getSingleUserIntoDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user retrived successfully",
    data: user,
  });
});

//update user
const updatedUser = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUserIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user updated successfully",
    data: updatedUser,
  });
});

//update user avatar
const updatedUserAvatar = catchAsync(async (req, res) => {
  const updateUser = await userService.updateUserAvatar(req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user avatar updated successfully",
    data: updateUser,
  });
});

//user soft delete
const deletedUser = catchAsync(async (req, res) => {
  await userService.deleteUserIntoDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user deleted successfully",
  });
});

//user hard delete
const deletedUserFromDatabase = catchAsync(async (req, res) => {
  await userService.deleteUserFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user deleted successfully",
  });
});

//user status update
const updatedUserStatus = catchAsync(async (req, res) => {
  const { userStatus } = req.body;
  await userService.updateUserStatusIntoDB(req.params.id, userStatus);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: `user ${userStatus.toLowerCase()} successfully`,
  });
});

//user role update
const updatedUserRole = catchAsync(async (req, res) => {
  const { role } = req.body;
  await userService.updateUserRoleIntoDB(req.params.id, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `user updated to ${role.toLocaleLowerCase()}`,
  });
});

export const UserControllers = {
  createdUser,
  sendOtpByEmail,
  verifyUser,
  getUsers,
  getSingleUser,
  updatedUser,
  deletedUser,
  deletedUserFromDatabase,
  updatedUserStatus,
  updatedUserRole,
  updatedUserAvatar,
};
