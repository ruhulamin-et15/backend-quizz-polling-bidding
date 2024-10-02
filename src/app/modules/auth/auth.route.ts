import express from "express";
import { authController } from "./auth.controller";
import isLoggedIn from "../../middlewares/isLoggedin";

const router = express.Router();

router.post("/login", authController.loginUser);
router.patch("/change-password", isLoggedIn, authController.changePassword);
router.post("/forget-password", authController.forgetPassword);
router.post("/verify-otp-email", authController.verifyOtpFromEmail);

router.patch("/reset-password", authController.resetPassword);

export const authRoutes = router;
