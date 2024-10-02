import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../errors/ApiErrors";
import { IVerifyData } from "./auth.interface";
import { authService } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successfull",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  await authService.changePasswordIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password has been changed successfully",
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  await authService.forgetPasswordIntoDB(req.body.email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `forget password link send to ${req.body.email}`,
  });
});

// const sendOtpUsingPhone = catchAsync(async (req, res) => {
//   const otp = await authService.sendOtpUsingPhoneIntoDB(req.body.phone);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: `OTP send your phone and otp is ${otp}`,
//   });
// });

//verify otp get from email
const verifyOtpFromEmail = catchAsync(async (req, res) => {
  await authService.verifyOtpFromEmailIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your OTP is verified",
  });
});

//reset password
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const verifyToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret
  );
  if (!verifyToken) {
    throw new ApiError(404, "Your forget password link has expired");
  }

  await authService.resetPasswordIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successfully",
  });
});

export const authController = {
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
  verifyOtpFromEmail,
};
