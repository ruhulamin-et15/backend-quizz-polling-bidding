import express from "express";
import { quizControllers } from "./quiz.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth("TEACHER"), quizControllers.createQuiz);

router.get("/", auth(), quizControllers.getAllQuizzes);

router.get("/:quizId", auth(), quizControllers.getQuizById);

router.patch("/:quizId", auth("ADMIN", "TEACHER"), quizControllers.updateQuiz);

router.delete("/:quizId", auth("ADMIN", "TEACHER"), quizControllers.deleteQuiz);

export const quizRoutes = router;
