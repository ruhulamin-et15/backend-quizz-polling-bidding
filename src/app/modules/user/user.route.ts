import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/register", UserControllers.createdUser);

router.post(
  "/send-otp",
  auth("USER", "ADMIN", "TEACHER"),
  UserControllers.sendOtpByEmail
);

router.patch(
  "/verify-user",
  auth("ADMIN", "USER", "TEACHER"),
  UserControllers.verifyUser
);

router.get("/", auth("ADMIN"), UserControllers.getUsers);

router.get("/:id", UserControllers.getSingleUser);
router.patch("/update/:id", auth(), UserControllers.updatedUser);
router.patch("/delete/:id", auth(), UserControllers.deletedUser);
router.patch("/status/:id", auth("ADMIN"), UserControllers.updatedUserStatus);
router.patch("/role/:id", auth("ADMIN"), UserControllers.updatedUserRole);
router.delete("/:id", auth("ADMIN"), UserControllers.deletedUserFromDatabase);

export const userRoutes = router;
