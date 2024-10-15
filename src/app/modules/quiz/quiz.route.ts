import express from "express";
import { quizControllers } from "./quiz.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/create", auth("TEACHER"), quizControllers.createQuiz);
router.get("/", auth(), quizControllers.getAllQuizzes);

export const quizRoutes = router;
