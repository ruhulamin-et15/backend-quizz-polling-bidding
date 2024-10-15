import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/login", authController.loginUser);
router.patch("/change-password", auth(), authController.changePassword);
router.post("/forget-password", authController.forgetPassword);
router.patch("/reset-password", authController.resetPasswordUsingOTP);

export const authRoutes = router;
