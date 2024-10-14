import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../errors/ApiErrors";
import { authService } from "./auth.service";

//login user
const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successfull",
    data: result,
  });
});

//change password
const changePassword = catchAsync(async (req, res) => {
  await authService.changePasswordIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password has been changed successfully",
  });
});

//forget password using email
const forgetPassword = catchAsync(async (req, res) => {
  await authService.forgetPasswordIntoDB(req.body.email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `forget password link send to ${req.body.email}`,
  });
});

//reset password using otp varificaton
const resetPasswordUsingOTP = catchAsync(async (req, res) => {
  await authService.resetPasswordUsingOTPVerify(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your Password Has Been Changed Successfully",
  });
});

export const authController = {
  loginUser,
  changePassword,
  forgetPassword,
  resetPasswordUsingOTP
};
