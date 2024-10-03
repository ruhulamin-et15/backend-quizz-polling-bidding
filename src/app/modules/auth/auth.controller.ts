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

//reset password using otp varificaton
const resetPasswordUsingOTP = catchAsync(async (req, res) => {
  await authService.resetPasswordUsingOTPVerify(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Password Has Been Changed Successfully",
  });
});

//reset password using send token
const resetPasswordUsingToken = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const verifyToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret
  );
  if (!verifyToken) {
    throw new ApiError(404, "Your forget password link has expired");
  }

  await authService.resetPasswordUsingTokenVerify(req.body);

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
  resetPasswordUsingOTP,
  resetPasswordUsingToken,
};
