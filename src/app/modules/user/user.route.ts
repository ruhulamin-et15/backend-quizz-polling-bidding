import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { userValidation } from "./user.validation";
import isLoggedIn from "../../middlewares/isLoggedin";
import isAdmin from "../../middlewares/isAdmin";

const router = express.Router();

//public routes
router.post(
  "/register",
  // validateRequest(userValidation.userValidationSchema), // Validation middleware
  UserControllers.createdUser
);
router.get("/",isLoggedIn, UserControllers.getUsers);
router.get("/:id", UserControllers.getSingleUser);

//loggedin user routes
router.patch("/update/:id", isLoggedIn, UserControllers.updatedUser);
router.patch("/delete/:id", isLoggedIn, UserControllers.deletedUser);

//admin routes
router.patch(
  "/status/:id",
  isLoggedIn,
  isAdmin,
  UserControllers.updatedUserStatus
);
router.patch("/role/:id", isLoggedIn, isAdmin, UserControllers.updatedUserRole);
router.delete(
  "/:id",
  isLoggedIn,
  isAdmin,
  UserControllers.deletedUserFromDatabase
);

export const userRoutes = router;
