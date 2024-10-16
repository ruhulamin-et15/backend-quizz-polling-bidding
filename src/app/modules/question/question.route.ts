import express from "express";
import auth from "../../middlewares/auth";
import { questionControllers } from "./question.controller";

const router = express.Router();

router.post("/", auth("TEACHER"), questionControllers.createQuestion);

router.get("/", auth(), questionControllers.getQuestions);

router.get("/:questionId", auth(), questionControllers.getSingleQuestion);

router.patch(
  "/:questionId",
  auth("TEACHER", "ADMIN"),
  questionControllers.updateQuestion
);

router.delete(
  "/:questionId",
  auth("TEACHER", "ADMIN"),
  questionControllers.deleteQuestion
);

export const questionRoutes = router;
