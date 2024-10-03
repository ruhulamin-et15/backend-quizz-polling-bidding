import { transporter } from "./../../../helpers/transporter";
import bcrypt from "bcryptjs";
import ApiError from "../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { authReusable } from "./auth.reusable";
import { IVerifyData } from "./auth.interface";
import prisma from "../../../shared/prisma";

// const client = twilio(config.otp.account_ssid, config.otp.auth_token);

interface TuserData {
  email: string;
  password: string;
  newPassword: string;
}

//login user
const loginUserIntoDB = async (userData: TuserData) => {
  try {
    const user = await authReusable.existUser(userData.email);

    const isPasswordMatch = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new ApiError(
        404,
        "user email/password don't match, please try again later"
      );
    }

    const payload = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    };

    const token = jwtHelpers.generateToken(
      payload,
      config.jwt.jwt_secret,
      config.jwt.expires_in
    );

    return {
      token,
    };
  } catch (error) {
    throw error;
  }
};

//change password
const changePasswordIntoDB = async (userData: TuserData) => {
  const user = await authReusable.existUser(userData.email);

  const isPasswordMatch = await bcrypt.compare(
    userData.password,
    user.password
  );

  if (!isPasswordMatch) {
    throw new ApiError(404, "your old password dont match, please try again");
  }

  const hashedPassword = await bcrypt.hash(userData.newPassword, 10);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });
};

//send token/otp using email
const forgetPasswordIntoDB = async (email: string) => {
  const user = await authReusable.existUser(email);
  const payload = {
    id: user.id,
    userName: user.userName,
    email: user.email,
    role: user.role,
  };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date();
  otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5);
  const otpExpiresAtString = otpExpiresAt.toISOString(); // Convert to string

  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt: otpExpiresAtString }, // Assign the string value
  });

  //generate token
  const resetToken = jwtHelpers.generateToken(
    payload,
    config.jwt.reset_pass_secret,
    config.jwt.reset_pass_token_expires_in
  );

  const emailTransport = transporter;

  // Email options
  const mailOptions = {
    from: `"BD Quizz-Polling" <${config.emailSender.email}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>Hello,</p>
      <p>Verify using this OTP: ${otp}, This OTP is Expired in 5 minutes,</p>
      <p>Or</p>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="http://localhost:3000/reset-password?token=${resetToken}">Reset Password</a>
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

//send otp using phone number
// const sendOtpUsingPhoneIntoDB = async (phone: string) => {
//   const user = await prisma.user.findUnique({
//     where: { phone: phone },
//   });

//   if (!user) {
//     throw new ApiError(
//       404,
//       `user not registered with ${phone}, please register first`
//     );
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const otpExpiresAt = new Date();
//   otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);

//   await prisma.user.update({
//     where: { phone },
//     data: { otp, otpExpiresAt },
//   });

//   // Send OTP via SMS using Twilio
//   await client.messages.create({
//     body: `Your password reset code is ${otp},
//     thanks,
//     BD Quezz & Polling`,
//     from: config.otp.twilioNumber,
//     to: phone,
//   });

//   return otp;
// };

//verify otp and reset password
const resetPasswordUsingOTPVerify = async (verifyData: IVerifyData) => {
  const { email, otp, newPassword } = verifyData;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found for change password!");
  }

  const currentTime = new Date(Date.now());

  if (user?.otp !== otp) {
    throw new ApiError(404, "Your OTP is incorrect!");
  } else if (!user.otpExpiresAt || user.otpExpiresAt <= currentTime) {
    throw new ApiError(409, "Your OTP is expired, please send new otp");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpiresAt: null,
    },
  });

  return user;
};

//reset password using token
const resetPasswordUsingTokenVerify = async (userData: {
  email: string;
  newPassword: string;
}) => {
  const hashedPassword = await bcrypt.hash(userData.newPassword, 10);
  await prisma.user.updateMany({
    data: {
      password: hashedPassword,
    },
  });
};

export const authService = {
  loginUserIntoDB,
  changePasswordIntoDB,
  forgetPasswordIntoDB,
  resetPasswordUsingOTPVerify,
  resetPasswordUsingTokenVerify,
};
