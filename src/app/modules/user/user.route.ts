import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { userValidation } from "./user.validation";
import { fileUploader } from "../../../helpers/fileUploader";

const router = express.Router();

//create user
router.post(
  "/register",
  userValidation.userValidationMiddleware,
  UserControllers.createdUser
);

//send otp to user
router.post(
  "/send-otp",
  auth("USER", "ADMIN", "TEACHER"),
  UserControllers.sendOtpByEmail
);

//verify user
router.patch(
  "/verify-user",
  auth("ADMIN", "USER", "TEACHER"),
  UserControllers.verifyUser
);

//get all users
router.get("/", auth("ADMIN"), UserControllers.getUsers);

//get single user by id
router.get("/:id", UserControllers.getSingleUser);

//update user
router.patch("/update/:id", auth(), UserControllers.updatedUser);

//update user avatar
router.patch(
  "/update-avatar/:userId",
  auth(),
  fileUploader.updateUserAvatar,
  UserControllers.updatedUserAvatar
);

//delete user by id (soft delete)
router.patch("/delete/:id", auth(), UserControllers.deletedUser);

//update user status
router.patch("/status/:id", auth("ADMIN"), UserControllers.updatedUserStatus);

//update user role
router.patch("/role/:id", auth("ADMIN"), UserControllers.updatedUserRole);

//delete user by id (hard delete)
router.delete("/:id", auth("ADMIN"), UserControllers.deletedUserFromDatabase);

export const userRoutes = router;
